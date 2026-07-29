export const dateTimeStringifier = (date: Date) => {
  return date.
    toISOString()
    .slice(0, 19)
    .replace("T", " ");
};

export const getStringifiedTimeStamp = () => {
  return dateTimeStringifier(new Date());
};

export const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}