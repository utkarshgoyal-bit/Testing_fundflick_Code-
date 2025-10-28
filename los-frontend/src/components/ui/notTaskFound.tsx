import { PlusCircle, Target, Calendar, Users } from 'lucide-react';

const NoTaskFound = () => {
  return (
    <div className="py-12 w-full">
      <div className="max-w-md mx-auto">
        {/* Main Empty State Card */}
        <div className="bg-color-surface border border-fg-border rounded-xl p-8 text-center">
          {/* Icon with Animation */}
          <div className="mb-6 relative">
            <div className="w-20 h-20 mx-auto bg-color-surface-muted rounded-full flex items-center justify-center">
              <Target className="w-10 h-10 text-fg-tertiary" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-color-warning/20 rounded-full flex items-center justify-center animate-pulse">
              <span className="w-2 h-2 bg-color-warning rounded-full"></span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-fg-primary mb-2">
            No Tasks Found
          </h2>
          
          {/* Description */}
          <p className="text-fg-secondary mb-6 leading-relaxed">
            There are no tasks available at the moment. Tasks will appear here once they are created or assigned.
          </p>

          {/* Suggestions */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm text-fg-tertiary bg-color-surface-muted/50 p-3 rounded-lg">
              <PlusCircle className="w-4 h-4 text-color-primary" />
              <span>Create a new task to get started</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-fg-tertiary bg-color-surface-muted/50 p-3 rounded-lg">
              <Users className="w-4 h-4 text-color-secondary" />
              <span>Check if you have permission to view tasks</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-fg-tertiary bg-color-surface-muted/50 p-3 rounded-lg">
              <Calendar className="w-4 h-4 text-color-accent" />
              <span>Try adjusting your filter criteria</span>
            </div>
          </div>

          {/* Visual Decoration */}
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-color-primary/30 rounded-full"></div>
            <div className="w-2 h-2 bg-color-secondary/30 rounded-full"></div>
            <div className="w-2 h-2 bg-color-accent/30 rounded-full"></div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-4 bg-color-surface-muted/30 border border-fg-border/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 bg-color-info/20 rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-color-info rounded-full"></span>
            </div>
            <span className="text-fg-tertiary">
              Tasks will automatically refresh when new data is available
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoTaskFound;
