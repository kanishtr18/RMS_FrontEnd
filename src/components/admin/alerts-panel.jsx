import {
  IconAlertTriangle,
  IconCreditCard,
  IconTool,
} from "@tabler/icons-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AlertsPanel() {
  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconAlertTriangle className="size-5 text-destructive" />
          Critical Alerts
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium">Payment Failed</p>
            <p className="text-muted-foreground">
              Invoice #INV-1024 failed
            </p>
          </div>
          <Badge variant="destructive">Urgent</Badge>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium">Room Maintenance Required</p>
            <p className="text-muted-foreground">
              Room 204 – AC malfunction
            </p>
          </div>
          <Badge variant="secondary">Maintenance</Badge>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium">Low Inventory</p>
            <p className="text-muted-foreground">
              Towels below threshold
            </p>
          </div>
          <Badge variant="outline">Inventory</Badge>
        </div>
      </CardContent>
    </Card>
  )
}