interface ProgressBarProps {
  label: string;
  percentage: number;
}

export default function ProgressBar({ percentage }: ProgressBarProps) {
  return (
    <div className="flex items-center justify-end space-x-2">
      <div className="w-24 h-2 rounded-full bg-gray overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(to right, #16a34a, #facc15)`,
          }}
        />
      </div>
      <span className="text-xs font-medium">{percentage}%</span>
    </div>
  );
}
