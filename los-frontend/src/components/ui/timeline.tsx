type TimelineEntry = {
  date: string | number;
  title: string;
  content: string;
  name: string;
};

const Timeline = ({ timelineData }: { timelineData: TimelineEntry[] }) => {
  if (!timelineData || timelineData.length === 0) {
    return <div className="text-center py-6 text-fg-tertiary text-sm">No timeline entries yet</div>;
  }

  return (
    <div className="relative py-2">
      {/* Vertical line */}
      <div className="absolute left-1.5 top-0 bottom-0 w-px bg-fg-border" />

      {/* Timeline entries */}
      <div className="space-y-3">
        {timelineData.map((entry, index) => (
          <div key={index} className="relative pl-6">
            {/* Dot */}
            <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-color-primary border-2 border-color-surface" />

            {/* Content */}
            <div className="space-y-1">
              {/* Date and Name row */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs text-fg-tertiary font-medium">{entry.date}</span>
                {entry.name && <span className="text-xs text-fg-secondary">{entry.name}</span>}
              </div>

              {/* Title (if exists) */}
              {entry.title && <h4 className="text-sm font-semibold text-fg-primary">{entry.title}</h4>}

              {/* Comment/Content */}
              {entry.content && (
                <div
                  className="text-sm text-fg-secondary leading-relaxed prose-sm prose-p:my-0 prose-p:text-fg-secondary"
                  dangerouslySetInnerHTML={{ __html: entry.content }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Timeline };
