/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // New Design System Colors
        'color-background': 'var(--color-background)',
        'color-surface': 'var(--color-surface)',
        'color-surface-muted': 'var(--color-surface-muted)',
        'color-primary': 'var(--color-primary)',
        'color-primary-light': 'var(--color-primary-light)',
        'color-secondary': 'var(--color-secondary)',
        'color-accent': 'var(--color-accent)',
        'fg-primary': 'var(--fg-primary)',
        'fg-secondary': 'var(--fg-secondary)',
        'fg-tertiary': 'var(--fg-tertiary)',
        'fg-accent': 'var(--fg-accent)',
        'fg-on-accent': 'var(--fg-on-accent)',
        'fg-inverse': 'var(--fg-inverse)',
        'fg-border': 'var(--fg-border)',
        'fg-hover': 'var(--fg-hover)',
        'text-color-primary': 'var(--text-color-primary)',
        'text-color-secondary': 'var(--text-color-secondary)',
        'text-color-tertiary': 'var(--text-color-tertiary)',
        'color-error': 'var(--color-error)',
        'color-error2': 'var(--color-error2)',
        'color-success': 'var(--color-success)',
        'color-upcoming': 'var(--color-upcoming)',
        'color-recurring': 'var(--color-recurring)',
        'color-success2': 'var(--color-success2)',
        'color-warning': 'var(--color-warning)',
        'color-warning2': 'var(--color-warning2)',
        'color-info': 'var(--color-info)',
        'color-info2': 'var(--color-info2)',

        // Legacy colors (keeping all existing ones)
        'light-primary-foreground': 'var(--light-primary-foreground)',
        success: 'var(--success)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        'light-primary-background': 'var(--light-primary-background)',
        'light-secondary-background': 'var(--light-secondary-background)',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar-background)',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        gray: '#f3f4f6',
      },
      backgroundColor: {
        'light-primary': 'var(--primary)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
