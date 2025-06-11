import moment from 'moment';

export const getCurrentUtc = () => {
  return moment.utc();
  // returns a Moment object in UTC
};

export const toUtcIsoString = (date) => {
  return moment(date).toISOString();
  // returns a string in ISO 8601 format in UTC, e.g. '2025-06-05T12:30:45.000Z'
};
