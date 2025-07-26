import * as React from "react"
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css"

import { cn } from "@/lib/utils"

export function Calendar({
  className,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      className={cn("p-3 bg-white rounded-md border", className)}
      {...props}
    />
  );
}

