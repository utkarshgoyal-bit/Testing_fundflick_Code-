import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'react-toastify';
import moment from 'moment';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isDev = !['prod', 'production', 'p'].includes(import.meta.env.VITE_API_ENV || 'dev');

export const copy = ({ text = '', needToast = false }: { text: string; needToast?: boolean }) => {
  try {
    navigator.clipboard.writeText(text);
    if (needToast) {
      toast.success('Text copied to clipboard');
    }
  } catch (error: any) {
    console.error(error);
    if (needToast) {
      toast.error('Text copy failed');
    }
  }
};

export const hasTodayDateInArray = (data: any[]): boolean => {
  const today = moment().startOf('day');

  return data.some((item) => {
    for (const key in item) {
      if (Object.prototype.hasOwnProperty.call(item, key)) {
        const value = item[key];
        if (moment.isMoment(value) || typeof value === 'string') {
          const date = moment(value);
          if (date.isValid()) {
            if (date.isSame(today, 'day')) return true;
          }
        }
      }
    }
    return false;
  });
};

export const statusStyle = {
  PENDING: 'bg-[#FFDC7F] text-amber-600 px-3 rounded-full text-sm font-medium  ',
  UNDER_REVIEW: 'bg-[#FFDC7F] text-amber-600 px-3 rounded-full text-sm font-medium  ',
  APPROVED: 'bg-green-100 text-green-600 px-3 rounded-full text-sm font-medium',
  REJECTED: 'bg-red-100   text-red-600  px-3 rounded-full text-sm font-medium ',
  TASK_PENDING: 'bg-[#FFDC7F]  text-amber-600 px-3 rounded-full text-sm font-medium ',
};

export const multiSelectStyle = {
  chips: {
    background: 'var(--primary)',
  },
  multiselectContainer: {
    color: 'var(--primary)',
    width: '100%',
    zIndex: 99,
    background: 'white',
  },
  searchBox: {
    borderRadius: 'calc(var(--radius) - 2px)',
    alignItems: 'center',
    display: 'flex',
    padding: '0.5rem',
    border: '1px solid var(--primary)',
    height: '3rem',
    fontSize: '0.875rem',
    flexGrow: 1,
    flexWrap: 'wrap',
    overflow: 'auto',
  },
  option: {
    color: 'var(--foreground)',
    background: 'var(--background)',
    fontSize: '0.875rem',
    zIndex: 99,
  },
  optionContainer: {
    zIndex: 99,
  },
};
