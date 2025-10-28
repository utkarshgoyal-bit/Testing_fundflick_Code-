export const getStatusStyles = (status: 'urgent' | 'warning' | 'neutral' | 'success' | 'info') => {
  switch (status) {
    case 'urgent':
      return {
        card: 'border-red-100 bg-gradient-to-br from-red-50/80 to-white',
        icon: 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-red-200',
        value: 'text-red-700',
        indicator: 'bg-red-500',
      };
    case 'warning':
      return {
        card: 'border-amber-100 bg-gradient-to-br from-amber-50/80 to-white',
        icon: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-amber-200',
        value: 'text-amber-700',
        indicator: 'bg-amber-500',
      };
    case 'success':
      return {
        card: 'border-green-100 bg-gradient-to-br from-green-50/80 to-white',
        icon: 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-200',
        value: 'text-green-700',
        indicator: 'bg-green-500',
      };
    case 'info':
      return {
        card: 'border-purple-100 bg-gradient-to-br from-purple-50/80 to-white',
        icon: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-200',
        value: 'text-purple-700',
        indicator: 'bg-purple-500',
      };
    default:
      return {
        card: 'border-blue-10 bg-gradient-to-br from-blue-50/50 to-white',
        icon: 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-blue-200',
        value: 'text-blue-600',
        indicator: 'bg-blue-400',
      };
  }
};
