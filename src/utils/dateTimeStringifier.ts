export const dateTimeStringifier = (date: Date) => {
  return date.
    toISOString()
    .slice(0, 19)
    .replace("T", " ");
};

export const getStringifiedTimeStamp = () => {
  return dateTimeStringifier(new Date());
};