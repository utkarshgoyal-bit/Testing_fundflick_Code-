import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: React.ReactNode;
  icon: React.ReactNode;
  value: React.ReactNode;
  subValue?: React.ReactNode;
  onClickIcon?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, icon, value, subValue, onClickIcon }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-1 text-muted-foreground">
        {label}
        {React.cloneElement(icon as React.ReactElement, {
          className: cn((icon as any)?.props?.className, 'h-6 w-6'),
        })}
      </div>
      <div className="text-2xl font-semibold text-gray-900 flex items-center justify-between">
        {value}
        {onClickIcon && (
          <span onClick={onClickIcon} className="text-secondary hover:text-primary cursor-pointer transition">
            ↑
          </span>
        )}
      </div>
      {subValue && <p className="text-xs text-red-500 mt-1">{subValue}</p>}
    </div>
  );
};

export default StatCard;
