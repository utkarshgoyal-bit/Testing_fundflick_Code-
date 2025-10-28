import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export default function Card({ 
  title, 
  desc, 
  icon: Icon 
}: { 
  title: string; 
  desc: ReactNode; 
  icon?: LucideIcon;
}) {
  return (
    <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 overflow-hidden shadow-lg">
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4 text-fg-secondary" />}
            <span className="text-xs text-fg-tertiary">{title}</span>
          </div>
        </div>
        <div className="text-xl font-bold text-fg-primary">{desc}</div>
      </div>
    </div>
  );
}
