"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      modifiers={{
        today: (date) => {
          const today = new Date()
          return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
          )
        },
      }}
      modifiersClassNames={{
        selected: "bg-blue-600 text-white rounded-full font-semibold",
        range_middle: "bg-gray-200 text-black",
        today: "bg-orange-500 text-white border border-orange-600 rounded-full",
      }}
      classNames={{
        months: "flex flex-row space-x-4",
        month: "space-y-4 w-full",
        caption: "flex justify-between items-center px-2",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        table: "w-full border-collapse",
        head_row: "flex gap-2",
        head_cell:
          "text-muted-foreground w-9 font-normal text-[0.8rem] text-center",
        row: "flex w-full gap-2 my-2",
        cell:
          "relative h-9 w-9 text-center text-sm p-0 " +
          "focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal m-[0.5px]"
        ),
        day_selected: "bg-blue-600 text-white rounded-full font-semibold",
        day_range_middle: "bg-gray-200 text-black",
        day_today: "bg-orange-500 text-white border border-orange-600 rounded-full",
        day_outside:
          "day-outside text-gray-400 aria-selected:bg-gray-200 aria-selected:text-black",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
