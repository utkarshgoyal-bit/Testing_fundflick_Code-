import moment from 'moment-timezone';
const getPriorityColor = (dueDate: string) => {
    const daysDiff = moment(dueDate).diff(moment(), 'days');
    if (daysDiff <= 1) return 'text-color-error';
    if (daysDiff <= 3) return 'text-color-black';
    return 'text-fg-secondary';
};
export default getPriorityColor;