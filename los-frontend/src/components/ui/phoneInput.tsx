
import { cn } from '@/lib/utils';
import React from 'react';
import PhoneInput, { PhoneInputProps } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

// Exclude onFocus property from InputHTMLAttributes<HTMLInputElement> to resolve conflict


// Merge PhoneInputProps and InputPropsWithoutFocus, including only compatible properties
export interface InputProps extends PhoneInputProps {
    className?: string
}

const InputPhone = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        const { onChange, ...restProps } = props
        return (
            <div ref={ref}>
                <PhoneInput
                    containerClass={cn(
                        "flex h-12 w-full",
                        
                    )}
                    onChange={onChange}
                    inputClass={cn(
                        "flex h-12 w-full rounded-md focus:outline-input bg-background text-sm ring-offset-background file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        className
                    )}
                    inputStyle={{
                        width: '100%',
                        height: '100%',
                    }}
                    buttonClass={cn(
                        "border border-input bg-transparent hover:bg-accent",
                        className
                    )}
                    buttonStyle={{
                        background: 'var(--background)'
                    }}
                    countryCodeEditable={false}
                    disableDropdown
                    enableLongNumbers={false}
                    {...restProps}
                />
            </div>
        );
    }
);

export default InputPhone;
