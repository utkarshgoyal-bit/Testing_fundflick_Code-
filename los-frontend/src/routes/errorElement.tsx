import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronRight, Mail } from 'lucide-react';
import { useState } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: { componentStack: string } | null;
}

export const ErrorFallback = ({
  onReload,
  state,
}: {
  onReload: () => void;
  state: Readonly<ErrorBoundaryState> | null;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isReloading, setIsReloading] = useState(false);


  const handleReload = async () => {
    setIsReloading(true);
    setTimeout(() => {
      onReload();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-color-background via-color-surface to-color-surface-muted flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-color-primary/5 via-transparent to-color-secondary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--color-primary),0.1),transparent_70%)]" />
      
      <div className="relative z-10 w-full max-w-2xl">
        <Card className="border-0 shadow-2xl bg-color-surface/90 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            {/* Header Section */}
            <div className="relative bg-gradient-to-r from-color-error/10 via-color-error/5 to-transparent p-8 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-color-error/5 via-transparent to-color-warning/5" />
              
              <div className="relative">
                {/* Error Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-color-error/20 to-color-error/10 flex items-center justify-center border border-color-error/20">
                      <AlertTriangle className="w-10 h-10 text-color-error animate-pulse" />
                    </div>
                    <div className="absolute -inset-2 rounded-full bg-color-error/10 animate-ping" />
                  </div>
                </div>

                {/* Error Message */}
                <h1 className="text-3xl md:text-4xl font-bold text-color-primary mb-4">
                  Oops! Something went wrong
                </h1>
                <p className="text-lg text-fg-secondary leading-relaxed max-w-md mx-auto">
                  We encountered an unexpected error. Don't worry, it's not you, it's us. 
                  You can try reloading the page or head back to safety.
                </p>
              </div>
            </div>

            <Separator className="bg-fg-border/30" />

            {/* Action Buttons */}
            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Button
                  onClick={handleReload}
                  disabled={isReloading}
                  className="bg-color-primary hover:bg-color-primary-light text-fg-on-accent min-w-[140px] gap-2"
                >
                  {isReloading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  {isReloading ? 'Reloading...' : 'Reload Page'}
                </Button>
              </div>

              {/* Error Details Toggle */}
              {state && (state.error || state.errorInfo) && (
                <div className="space-y-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowDetails(!showDetails)}
                    className="w-full justify-between text-fg-tertiary hover:text-fg-secondary hover:bg-color-surface-muted/50"
                  >
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Error Details
                    </span>
                    {showDetails ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>

                  {showDetails && (
                    <Card className="border-color-error/20 bg-color-error/5">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {state.error && (
                            <div>
                              <h4 className="font-medium text-color-error mb-2">Error Message:</h4>
                              <pre className="text-sm text-fg-secondary bg-color-surface-muted/50 p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                                {state.error.toString()}
                              </pre>
                            </div>
                          )}
                          
                          {state.errorInfo?.componentStack && (
                            <div>
                              <h4 className="font-medium text-color-error mb-2">Component Stack:</h4>
                              <pre className="text-sm text-fg-secondary bg-color-surface-muted/50 p-3 rounded-md overflow-x-auto whitespace-pre-wrap max-h-48 overflow-y-auto">
                                {state.errorInfo.componentStack}
                              </pre>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>

            <Separator className="bg-fg-border/30" />

            {/* Footer */}
            <div className="p-6 bg-color-surface-muted/30 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-fg-tertiary">
                <Mail className="w-4 h-4" />
                <span>
                  If the issue persists, please contact your administrator for assistance.
                </span>
              </div>
              <p className="text-xs text-fg-tertiary mt-2 opacity-75">
                Error ID: {Date.now().toString(36).toUpperCase()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo: { componentStack: errorInfo.componentStack ?? '' },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          onReload={() => window.location.reload()} 
          state={this.state} 
        />
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;