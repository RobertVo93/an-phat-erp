export function formatMonthYear(date?: Date | null): string {
  if (!date) return ""
  return date.getMonth() + 1 + "-" + date.getFullYear()
}

export function formatDate(date?: string | Date, symbol?: string): string {
  if (!date) return ""
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, symbol || '-')
}

export function formatDateTime(date: string | Date, symbol?: string): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).replace(/\//g, symbol || '-')
}

export function formatYYYYMMDD(date: string | Date): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0') // getMonth: 0-11
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function formatLocalDatetime(date: Date | string) {
  const dateData = new Date(date);
  const offset = dateData.getTimezoneOffset();
  const local = new Date(dateData.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
}

export function extractHourMinute(date: Date | string | null) {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function isTodayLocalDatetime(dateStr: Date | string): boolean {
  const inputDate = new Date(dateStr);

  const now = new Date();
  return (
    inputDate.getFullYear() === now.getFullYear() &&
    inputDate.getMonth() === now.getMonth() &&
    inputDate.getDate() === now.getDate()
  );
}

export function getStartOfMonth(date: Date | string): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date(NaN);
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function getEndOfMonth(date: Date | string): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date(NaN);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function getEndOfToday(date: Date | string = new Date()): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date(NaN);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
}

export function getNextDay(date: Date | string = new Date()): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date(NaN);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
}

export function getNextBlockTime(date: Date | string): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date(NaN);

  const minutes = d.getMinutes();
  const nextBlock = Math.ceil(minutes / 15) * 15;
  let nextHour = d.getHours();
  let nextDay = d.getDate();
  let nextMonth = d.getMonth();
  let nextYear = d.getFullYear();

  if (nextBlock === 60) {
    nextHour += 1;
    if (nextHour === 24) {
      nextHour = 0;
      // Move to next day
      d.setDate(d.getDate() + 1);
      nextDay = d.getDate();
      nextMonth = d.getMonth();
      nextYear = d.getFullYear();
    }
    return new Date(nextYear, nextMonth, nextDay, nextHour, 0, 0);
  } else {
    return new Date(nextYear, nextMonth, nextDay, nextHour, nextBlock, 0);
  }
}

export function startOfMonthLike(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function sameDayLastMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
}

export function sameDayLastYear(date: Date): Date {
  return new Date(date.getFullYear() - 1, date.getMonth(), date.getDate())
}

export const getCurrentWeekRange = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  // Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  // Sunday
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return [monday, sunday];
};

export const getRecentTimeIntervalSlot = (timeInterval: number = 30): Date => {
  const now = new Date()
  const roundedMinutes = Math.floor(now.getMinutes() / timeInterval) * timeInterval
  now.setMinutes(roundedMinutes, 0, 0)
  return now
}