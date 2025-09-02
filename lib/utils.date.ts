export function formatMonthYear(date?: Date | null): string {
  if (!date) return ""
  return date.getMonth() + 1 + "-" + date.getFullYear()
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-')
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).replace(/\//g, '-')
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

export function getEndOfMonth(date: Date | string): Date {
  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date(NaN);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}
