import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const formatDateToYear = (date) => dayjs(date).format('YYYY');
const formatDateToHM = (date) => `${Math.floor(date / 60)}h ${date % 60}m`;
const formatDateToDMY = (date) => dayjs(date).format('DD MMMM YYYY');
const humanizeDate = (date) => {
  const timeDiff = dayjs.duration(dayjs().diff(dayjs(date)));
  return timeDiff.humanize(true);
};
export { formatDateToYear, formatDateToHM, formatDateToDMY, humanizeDate };
