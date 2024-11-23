export const timeAgo = (
  timestamp: Date,
  locale = navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language
): string => {
  if (Object.prototype.toString.call(timestamp) !== '[object Date]') {
    return 'Invalid Date';
  }

  const diff = (new Date().getTime() - timestamp.getTime()) / 1000;
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (years > 0) {
    return rtf.format(0 - years, 'year');
  }
  if (months > 0) {
    return rtf.format(0 - months, 'month');
  }
  if (days > 0) {
    return rtf.format(0 - days, 'day');
  }
  if (hours > 0) {
    return rtf.format(0 - hours, 'hour');
  }
  if (minutes > 0) {
    return rtf.format(0 - minutes, 'minute');
  }

  return rtf.format(0 - diff, 'second');
};
