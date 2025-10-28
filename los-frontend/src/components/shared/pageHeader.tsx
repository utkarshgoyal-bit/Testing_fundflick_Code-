import Back from '@/components/shared/Back';
import I8nTextWrapper from '@/translations/i8nTextWrapper';

interface PageHeaderProps {
  title: string;
  hideBack?: boolean;
  navigateTo?: string | number;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export default function PageHeader({ title, hideBack, navigateTo, subtitle, actions, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="w-full">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto pb-1">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {index > 0 && <span className="text-fg-tertiary text-xs sm:text-sm">/</span>}
              <span
                className={`text-xs sm:text-sm whitespace-nowrap ${
                  index === breadcrumbs.length - 1
                    ? 'text-fg-primary font-medium'
                    : 'text-fg-secondary hover:text-color-primary cursor-pointer'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Main Header */}
      <div className="relative bg-gradient-to-br from-color-surface via-color-surface to-color-surface-muted border border-fg-border rounded-lg p-4 sm:p-6 shadow-sm ">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-color-primary rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
          <div
            className="absolute bottom-0 left-0 w-24 h-24 bg-color-secondary rounded-full translate-y-12 -translate-x-12 animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-16 h-16 bg-color-accent rounded-full -translate-y-8 animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--fg-primary) 1px, transparent 0)`,
            backgroundSize: '20px 20px',
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-color-primary/5 via-transparent to-color-secondary/5"></div>

        <div className="relative z-10">
          {/* Mobile & Tablet Layout (up to lg breakpoint) */}
          <div className="lg:hidden space-y-4">
            {/* Title Row with Back Button */}
            <div className="flex items-center justify-between gap-3">
              {/* Back Button - Left */}
              {!hideBack && (
                <div className="p-1 flex-shrink-0">
                  <Back navigateTo={navigateTo} />
                </div>
              )}

              {/* Title - Right Aligned */}
              <div className="min-w-0 flex-1 text-right">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-fg-primary leading-tight break-words">
                  <I8nTextWrapper text={title} />
                </h1>
                {subtitle && <p className="text-fg-secondary mt-1 text-sm md:text-base break-words">{subtitle}</p>}
              </div>
            </div>

            {/* Actions Section - Right Aligned */}
            {actions && <div className="flex flex-wrap gap-2 sm:gap-3 justify-end">{actions}</div>}
          </div>

          {/* Desktop Layout (lg and above) */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                {/* Back Button & Title */}
                <div className="flex items-center gap-3">
                  {!hideBack && (
                    <div className="p-1">
                      <Back navigateTo={navigateTo} />
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-fg-primary leading-tight">
                      <I8nTextWrapper text={title} />
                    </h1>
                    {subtitle && <p className="text-fg-secondary mt-1 text-base">{subtitle}</p>}
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-4">
                {/* Actions */}
                {actions && <div className="flex items-center gap-2">{actions}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
