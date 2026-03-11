import {
  IconClock,
  IconRefresh,
} from "@tabler/icons-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

export function OperationalStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconClock className="size-4" />
            Avg Check-in Time
          </CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">
          6.4 min
          <p className="text-sm text-muted-foreground font-normal">
            Faster than last week
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconRefresh className="size-4" />
            Room Turnover Rate
          </CardTitle>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">
          92%
          <p className="text-sm text-muted-foreground font-normal">
            Rooms cleaned & ready
          </p>
        </CardContent>
      </Card>
    </div>
  )
}