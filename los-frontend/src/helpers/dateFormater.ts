import moment from 'moment-timezone';
const formatDate = (dateString: string, format = 'DD/MM/YYYY') => {
  const date = moment(dateString);
  if (!date.isValid()) {
    return 'NA';
  }
  return date.format(format);
};
const toFormatDateToUnix = ({
  date,
  dateFormat = 'D-MMM-YY',
  withFullTimeStamp = false,
}: {
  date: string;
  dateFormat?: string;
  withFullTimeStamp?: boolean;
}): string | number => {
  if (date) {
    const formattedDate = moment(date, dateFormat).tz('Asia/Kolkata');
    return withFullTimeStamp ? formattedDate.endOf('day').unix() : formattedDate.unix();
  }
  return 'Not a valid date';
};
const toFormatLastPaymentDate = ({
  date,
  dateFormat = 'MMMM D, YYYY',
  withFullTimeStamp = false,
}: {
  date: string;
  dateFormat?: string;
  withFullTimeStamp?: boolean;
}): number | string => {
  if (date) {
    const dateWithoutTime = date.split('(')[0].replace(/\s+/g, ' ').trim();
    return withFullTimeStamp
      ? moment(dateWithoutTime, dateFormat).endOf('day').unix()
      : moment(dateWithoutTime, dateFormat).unix();
  }
  return 'Not a valid date';
};

const toFormatDate = ({
  date,
  toFormat = 'DD/MM/YYYY',
  timeZone = 'Asia/Kolkata',
}: {
  date: number | string;
  toFormat?: string;
  timeZone?: string;
}) => {
  if (!date) return date;

  if (typeof date === 'number') {
    const isMillis = date > 1e12;
    const momentDate = isMillis ? moment(date) : moment.unix(date);
    return momentDate.tz(timeZone).format(toFormat);
  }

  if (typeof date === 'string') {
    const parsedDate = moment(date);
    if (parsedDate.isValid()) {
      return parsedDate.tz(timeZone).format(toFormat);
    }
  }

  return date;
};

function getNextWeekdayFromName(dayStr: string, timezone = 'Asia/Kolkata') {
  const weekdayMap = {
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
    sun: 7,
  };

  const day = dayStr.toLowerCase();
  const targetIsoWeekday = weekdayMap[day as keyof typeof weekdayMap];
  if (!targetIsoWeekday) {
    throw new Error(`Invalid weekday string: ${dayStr}`);
  }

  const now = moment.tz(timezone).startOf('day');
  const todayIsoWeekday = now.isoWeekday();

  let daysToAdd = targetIsoWeekday - todayIsoWeekday;
  if (daysToAdd <= 0) {
    daysToAdd += 7;
  }

  return now.add(daysToAdd, 'days');
}

function getNextMonthlyDate(dayOfMonth: number, timezone = 'Asia/Kolkata') {
  const today = moment.tz(timezone).startOf('day');
  const currentDay = today.date();

  let targetDate;

  if (currentDay <= dayOfMonth) {
    targetDate = today.clone().date(dayOfMonth);
    if (targetDate.month() !== today.month()) {
      targetDate = today.clone().add(1, 'month').date(dayOfMonth);
    }
  } else {
    targetDate = today.clone().add(1, 'month').date(dayOfMonth);
    if (targetDate.date() !== dayOfMonth) {
      targetDate = targetDate.endOf('month');
    }
  }

  return targetDate;
}

function getNextYearlyDateFromStrings(monthStr: string, dayStr: string, timezone = 'Asia/Kolkata') {
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10);

  if (isNaN(day) || isNaN(month) || month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error(`Invalid month/day: ${monthStr}/${dayStr}`);
  }

  const today = moment.tz(timezone).startOf('day');
  const currentYear = today.year();

  let targetDate = moment.tz({ year: currentYear, month: month - 1, day }, timezone);

  if (!targetDate.isValid() || targetDate.month() !== month - 1) {
    targetDate = moment.tz({ year: currentYear, month: month - 1 }, timezone).endOf('month');
  }
  if (today.isAfter(targetDate)) {
    targetDate = targetDate.add(1, 'year');

    if (!targetDate.isValid() || targetDate.month() !== month - 1) {
      targetDate = moment.tz({ year: targetDate.year(), month: month - 1 }, timezone).endOf('month');
    }
  }

  return targetDate;
}
export {
  toFormatDateToUnix,
  toFormatLastPaymentDate,
  formatDate,
  toFormatDate,
  getNextWeekdayFromName,
  getNextMonthlyDate,
  getNextYearlyDateFromStrings,
};
