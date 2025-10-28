import moment from "moment";
const toFormatDateToUnix = ({
  date,
  dateFormat = "D-MMM-YY",
  withFullTimeStamp = false,
}: {
  date: string;
  dateFormat?: string;
  withFullTimeStamp?: boolean;
}): null | number => {
  if (date) {
    const formattedDate = moment(date, dateFormat);
    return withFullTimeStamp ? formattedDate.endOf("day").unix() : formattedDate.unix();
  }
  return null;

};

const toFormatLastPaymentDate = ({
  date,
  dateFormat = "MMMM D, YYYY",
  withFullTimeStamp = false,
}: {
  date: string;
  dateFormat?: string;
  withFullTimeStamp?: boolean;
}): number | null => {
  if (!!date) {
    const dateWithoutTime = date.split("(")[0].replace(/\s+/g, " ").trim();
    return withFullTimeStamp
      ? moment(dateWithoutTime, dateFormat).endOf("day").unix()
      : moment(dateWithoutTime, dateFormat).unix();
  }
  return null;
};
export { toFormatDateToUnix, toFormatLastPaymentDate };
