"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "../ui/toggle-group"


export function AreaAnalyticsChart({
  title,
  description,
  data,
  config,
  dateKey = "date",
}) {

  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) setTimeRange("7d")
  }, [isMobile])

  if (!data || data.length === 0) {
    return null
  }

  const filteredData = React.useMemo(() => {

    const referenceDate = new Date(data[data.length - 1]?.[dateKey])
    const days =
      timeRange === "7d" ? 7 :
      timeRange === "30d" ? 30 : 90

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - days)

    return data.filter((item) => {
      const d = new Date(item[dateKey])
      return d >= startDate
    })

  }, [data, timeRange])


  const areaKeys = Object.keys(config)


  return (
    <Card className="@container/card">

      <CardHeader>

        <CardTitle>{title}</CardTitle>

        <CardDescription>
          {description}
        </CardDescription>

        <CardAction>

          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">90d</ToggleGroupItem>
            <ToggleGroupItem value="30d">30d</ToggleGroupItem>
            <ToggleGroupItem value="7d">7d</ToggleGroupItem>
          </ToggleGroup>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger size="sm" className="w-28 @[767px]/card:hidden">
              <SelectValue />
            </SelectTrigger>

            <SelectContent className="rounded-xl">
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
            </SelectContent>

          </Select>

        </CardAction>

      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6">

        <ChartContainer
          config={config}
          className="h-[260px] w-full"
        >

          <AreaChart data={filteredData}>

            <defs>

              {areaKeys.map((key) => (
                <linearGradient
                  key={key}
                  id={`fill-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={config[key].color}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={config[key].color}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}

            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey={dateKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={24}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
              }
            />

            {areaKeys.map((key) => (

              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={`url(#fill-${key})`}
                stroke={config[key].color}
                stackId="a"
              />

            ))}

          </AreaChart>

        </ChartContainer>

      </CardContent>

    </Card>
  )
}