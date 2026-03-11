import {
  IconCalendarPlus,
  IconFileInvoice,
  IconBed,
  IconUserPlus,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

export function QuickActions() {
  return (
    <Card className="p-2">
      <CardContent className="flex gap-2">
        <Button variant="secondary" className="justify-start gap-2">
          <IconCalendarPlus className="size-4" />
          New Reservation
        </Button>

        <Button variant="secondary" className="justify-start gap-2">
          <IconFileInvoice className="size-4" />
          Create Invoice
        </Button>

        <Button variant="secondary" className="justify-start gap-2">
          <IconBed className="size-4" />
          Add Room
        </Button>

        <Button variant="secondary" className="justify-start gap-2">
          <IconUserPlus className="size-4" />
          Add Guest
        </Button>
      </CardContent>
    </Card>
  )
}