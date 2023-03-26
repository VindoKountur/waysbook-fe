export const formatRp = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

export const dateFormat = (dateStr: string) => {
  const month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let date = new Date(dateStr);

  let dayName = days[date.getDay()];
  let dayMonth = date.getDate();
  let monthName = month[date.getMonth()];
  let year = date.getFullYear();
  return `${dayName}, ${dayMonth} ${monthName} ${year}`;
};

export const sliceText = (str: string, maxTextLength: number): string => {
  if (str.split("").length <= maxTextLength) return str;
  return str.slice(0, maxTextLength) + "...";
};

export const publishDateFormat = (dateToFormat: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(dateToFormat));
};

export const transactionDateFormat = (dateToFormat: string) => {
  return new Intl.DateTimeFormat("en-US", {
    day :'numeric',
    month: "long",
    year: "numeric",
  }).format(new Date(dateToFormat));
};
