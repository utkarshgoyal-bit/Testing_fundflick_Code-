import moment from 'moment-timezone';

export interface TimeUtils {
  now: () => moment.Moment;
  format: () => string;
}

const timeUtils: TimeUtils = {
  now: () => moment(),
  format: () => moment().format('YYYY-MM-DD HH:mm:ss'),
};

export default timeUtils;
