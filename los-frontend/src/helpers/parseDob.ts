import moment from 'moment';

const parseDob = (dob?: string): string => {
  if (!dob) return '';

  const date = moment(dob, 'DD/MM/YYYY');

  if (!date.isValid()) return '';

  return date.format('YYYY-MM-DD');
};

export default parseDob;
