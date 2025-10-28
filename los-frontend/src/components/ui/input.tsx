import * as React from "react";
import { Eye, EyeOff, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const [FocusVisible, setFocusVisible] = React.useState(false);
    const handleVisible = () => {
      setVisible(!visible);
    };

    const commonClasses = "h-12 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

    // Set font size to prevent iOS zoom
    const fontSizeClasses = "text-base"; // 16px or larger

    if (type === 'password') {
      return (
        <div className="flex items-center gap-2 rounded-md border">
          <input
            type={visible ? "text" : type}
            className={cn(commonClasses, fontSizeClasses, className)}
            ref={ref}
            {...props}
          />
          <button type="button" title="View Password" name="toggle-password" className="p-3 bg-background-secondary cursor-pointer" onClick={handleVisible}>
            {visible ? <EyeOff /> : <Eye />}
          </button>
        </div>
      );
    } else if (type === "search") {
      return (
        <div className={cn('flex items-center rounded-md gap-2 border bg-background px-3 focus-visible:border-green-300 w-full', FocusVisible ? "outline-none ring-2 ring-ring ring-offset-2" : '')}>
          <Search />
          <input
            type="text"
            className={cn('flex h-12 focus-visible:outline-none w-full bg-background border-none rounded-none focus-visible:ring-0 focus-visible:ring-offset-0', fontSizeClasses, className)}
            ref={ref}
            {...props}
            onFocus={() => setFocusVisible(true)}
            onBlur={() => setFocusVisible(false)}
          />
        </div>
      );
    } else if (type === "date" || type === 'month') {
      return (
        <input
          type={type}
          className={cn(commonClasses, fontSizeClasses)}
          ref={ref}
          {...props}
        />
      );
    } else {
      return (
        <input
          type={type}
          onKeyDown={(e) => {
            if (type === "number" && ["e", "E", "+", "-"].includes(e.key)) {
              e.preventDefault();
            }

          }}
          className={cn(commonClasses, fontSizeClasses, className)}
          ref={ref}
          {...props}
          onWheel={(e) => e.currentTarget.blur()}
          onScroll={(e) => e.stopPropagation()}
        />
      );
    }
  }
);

Input.displayName = "Input";

export { Input };
