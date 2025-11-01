import moment from 'moment';

const getDateString = (offset: number) => {
  return moment().add(offset, 'days').startOf('day').toDate();
};

export default getDateString;
