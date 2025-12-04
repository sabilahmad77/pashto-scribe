interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar = ({ current, target, label, showPercentage = true }: ProgressBarProps) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-muted-foreground">
              {current.toLocaleString()} / {target.toLocaleString()} ({percentage.toFixed(1)}%)
            </span>
          )}
        </div>
      )}
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full gradient-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
