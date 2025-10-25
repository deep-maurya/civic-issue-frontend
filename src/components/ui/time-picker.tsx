"use client"

import * as React from "react"
import { Clock, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TimePicker({
  value = "",
  onChange,
  placeholder = "Select time",
  disabled = false,
  className,
  ...props
}: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [hours, setHours] = React.useState("09")
  const [minutes, setMinutes] = React.useState("00")
  const [period, setPeriod] = React.useState<"AM" | "PM">("AM")

  // Parse initial value
  React.useEffect(() => {
    if (value && value.includes(':')) {
      const [h, m] = value.split(":")
      if (h && m) {
        const hour24 = parseInt(h)
        const min = m
        
        if (hour24 === 0) {
          setHours("12")
          setPeriod("AM")
        } else if (hour24 < 12) {
          setHours(hour24.toString().padStart(2, "0"))
          setPeriod("AM")
        } else if (hour24 === 12) {
          setHours("12")
          setPeriod("PM")
        } else {
          setHours((hour24 - 12).toString().padStart(2, "0"))
          setPeriod("PM")
        }
        setMinutes(min)
      }
    } else {
      // Reset to default if no valid value
      setHours("09")
      setMinutes("00")
      setPeriod("AM")
    }
  }, [value])

  const handleTimeChange = () => {
    let hour24 = parseInt(hours)
    if (period === "PM" && hour24 !== 12) {
      hour24 += 12
    } else if (period === "AM" && hour24 === 12) {
      hour24 = 0
    }
    
    const timeString = `${hour24.toString().padStart(2, "0")}:${minutes}`
    onChange?.(timeString)
    setIsOpen(false)
  }

  const formatDisplayValue = () => {
    if (!value || !value.includes(':')) return placeholder
    
    const [h, m] = value.split(":")
    if (!h || !m) return placeholder
    
    const hour24 = parseInt(h)
    const min = m
    
    let hour12 = hour24
    let period = "AM"
    
    if (hour24 === 0) {
      hour12 = 12
      period = "AM"
    } else if (hour24 < 12) {
      hour12 = hour24
      period = "AM"
    } else if (hour24 === 12) {
      hour12 = 12
      period = "PM"
    } else {
      hour12 = hour24 - 12
      period = "PM"
    }
    
    return `${hour12}:${min} ${period}`
  }

  // Generate hour options (1-12)
  const hourOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = (i + 1).toString().padStart(2, "0")
    return { value: hour, label: hour }
  })

  // Generate minute options (00-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => {
    const minute = i.toString().padStart(2, "0")
    return { value: minute, label: minute }
  })

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal h-10 px-3 py-2",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
          {...props}
        >
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            {formatDisplayValue()}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select Time</Label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="hours" className="text-xs text-muted-foreground mb-1 block">
                  Hour
                </Label>
                <Select value={hours} onValueChange={setHours}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {hourOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="minutes" className="text-xs text-muted-foreground mb-1 block">
                  Min
                </Label>
                <Select value={minutes} onValueChange={setMinutes}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {minuteOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="period" className="text-xs text-muted-foreground mb-1 block">
                  Period
                </Label>
                <Select value={period} onValueChange={(value: "AM" | "PM") => setPeriod(value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 px-3"
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleTimeChange} className="h-8 px-3">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
