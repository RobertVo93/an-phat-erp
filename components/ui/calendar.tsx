"use client"

import * as React from "react"
import DatePicker, { DatePickerProps, registerLocale } from "react-datepicker"
// @ts-ignore: CSS import without type declarations
import "react-datepicker/dist/react-datepicker.css"
import { enUS, vi } from "date-fns/locale"
import { useLanguage } from "@/contexts/language-context"
import { Input } from "./input"
import { CalendarIcon } from "lucide-react"

registerLocale("en", enUS)
registerLocale("vi", vi)

export type DateRangeValue = {
  from?: Date
  to?: Date
}

type RangePickerCalendarProps = {
  className?: string
  startDate: Date | null | undefined
  endDate: Date | null | undefined
  mode?: "day" | "month" | "year"
  showIcon?: boolean
  showTodayButton?: boolean
  onDateRangeChange: (range: DateRangeValue | undefined) => void
}
function RangePickerCalendar({
  className,
  startDate, 
  endDate,
  mode = "day",
  showIcon = true,
  showTodayButton = false,
  onDateRangeChange,
}: RangePickerCalendarProps) {
  const { t, language } = useLanguage()
  const [localStartDate, setStartDate] = React.useState(startDate);
  const [localEndDate, setEndDate] = React.useState(endDate);

  React.useEffect(() => {
    if (startDate || endDate) {
      setStartDate(startDate);
      setEndDate(endDate);
    }
  }, [startDate, endDate, mode]);

  const onChangeHandler = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    let endAdjusted = end ?? undefined;
    if (end) {
      if (mode === "day") {
        // set to last millisecond of the day
        endAdjusted = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);
      }
      else if (mode === "month") {
        // set to last millisecond of the month
        endAdjusted = new Date(end.getFullYear(), end.getMonth() + 1, 0, 23, 59, 59, 999);
      } else if (mode === "year") {
        // set to last millisecond of the year
        endAdjusted = new Date(end.getFullYear(), 11, 31, 23, 59, 59, 999);
      }
    }
    setEndDate(endAdjusted ?? null);
    if (start && endAdjusted) {
      onDateRangeChange({ from: start, to: endAdjusted })
    }
  };

  return (
    <DatePicker
      className={className}
      wrapperClassName="w-full"
      showMonthYearPicker={mode === "month"}
      showYearPicker={mode === "year"}
      locale={language === "vi" ? vi : enUS}
      dateFormat="dd/MM/yyyy"
      customInput={<Input className="!pl-[45px] min-w-[235px] cursor-pointer" />}
      showIcon={showIcon}
      icon={<CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
      selectsRange
      onChange={onChangeHandler}
      startDate={localStartDate}
      endDate={localEndDate}
      selected={localStartDate}
      {...(showTodayButton ? { todayButton: t("production.today") } : {})}
    />
  )
}

function Calendar(props: DatePickerProps) {
  const { language } = useLanguage()
  return (
    <DatePicker
      wrapperClassName="w-full"
      locale={language === "vi" ? vi : enUS}
      dateFormat="dd/MM/yyyy"
      customInput={<Input className="!pl-[45px] min-w-[150px] cursor-pointer" />}
      showIcon
      icon={<CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />}
      {...props}
    />
  )
}

export { RangePickerCalendar, Calendar }
