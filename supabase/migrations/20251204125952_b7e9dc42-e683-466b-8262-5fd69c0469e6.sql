-- Create enum for sample status
CREATE TYPE public.sample_status AS ENUM ('pending', 'approved', 'rejected');

-- Create table for OCR samples
CREATE TABLE public.ocr_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  original_ocr_text TEXT,
  corrected_text TEXT NOT NULL,
  status sample_status DEFAULT 'pending',
  contributor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'contributor');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.ocr_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- OCR samples policies
CREATE POLICY "Anyone can view approved samples" ON public.ocr_samples FOR SELECT USING (status = 'approved');
CREATE POLICY "Contributors can view own samples" ON public.ocr_samples FOR SELECT USING (auth.uid() = contributor_id);
CREATE POLICY "Admins can view all samples" ON public.ocr_samples FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can insert samples" ON public.ocr_samples FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can update any sample" ON public.ocr_samples FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Contributors can update own pending samples" ON public.ocr_samples FOR UPDATE USING (auth.uid() = contributor_id AND status = 'pending');
CREATE POLICY "Admins can delete samples" ON public.ocr_samples FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  
  -- Give all new users contributor role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'contributor');
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for OCR images
INSERT INTO storage.buckets (id, name, public) VALUES ('ocr-images', 'ocr-images', true);

-- Storage policies
CREATE POLICY "Anyone can view OCR images" ON storage.objects FOR SELECT USING (bucket_id = 'ocr-images');
CREATE POLICY "Authenticated users can upload OCR images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ocr-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Admins can delete OCR images" ON storage.objects FOR DELETE USING (bucket_id = 'ocr-images' AND public.has_role(auth.uid(), 'admin'));

-- Function to get community stats
CREATE OR REPLACE FUNCTION public.get_ocr_stats()
RETURNS JSON
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'total_samples', (SELECT COUNT(*) FROM public.ocr_samples),
    'approved_samples', (SELECT COUNT(*) FROM public.ocr_samples WHERE status = 'approved'),
    'pending_samples', (SELECT COUNT(*) FROM public.ocr_samples WHERE status = 'pending'),
    'total_contributors', (SELECT COUNT(DISTINCT contributor_id) FROM public.ocr_samples)
  )
$$;