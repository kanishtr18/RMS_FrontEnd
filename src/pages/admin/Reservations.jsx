import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"

import { SiteHeader } from "@/components/admin/site-header"
import { SectionCards } from "@/components/admin/section-cards"
import RecentReservationsTable from "@/components/admin/RecentReservationsTable"

import {
  IconTrendingUp,
  IconCalendarEvent,
  IconLogin,
  IconLogout,
} from "@tabler/icons-react"

import reservations from "./data.json"

export default function Reservations() {

  /* =========================
     Reservation Section Cards
     ========================= */

  const reservationStats = [
    {
      id: "today-reservations",
      description: "Today's Reservations",
      title: "24",
      badgeText: "+4%",
      badgeIcon: <IconTrendingUp className="size-4" />,
      badgeVariant: "outline",
      footerMain: <>New bookings today</>,
      footerIcon: <IconCalendarEvent className="size-4" />,
      footerSub: "Compared to yesterday",
    },

    {
      id: "active-reservations",
      description: "Active Reservations",
      title: "86",
      badgeText: "+6%",
      badgeIcon: <IconTrendingUp className="size-4" />,
      badgeVariant: "outline",
      footerMain: <>Currently staying</>,
      footerSub: "Checked-in guests",
    },

    {
      id: "checkins",
      description: "Today's Check-ins",
      title: "12",
      badgeText: "+2%",
      badgeIcon: <IconLogin className="size-4" />,
      badgeVariant: "outline",
      footerMain: <>Guests arriving</>,
      footerSub: "Scheduled today",
    },

    {
      id: "checkouts",
      description: "Today's Check-outs",
      title: "9",
      badgeText: "-1",
      badgeIcon: <IconLogout className="size-4" />,
      badgeVariant: "outline",
      footerMain: <>Guests departing</>,
      footerSub: "Rooms becoming available",
    },
  ]


  return (
    <div className="flex flex-1 flex-col">

      <div className="@container/main flex flex-1 flex-col gap-2">

        {/* ========================= */}
        {/* Page Header */}
        {/* ========================= */}
        <SiteHeader
          title="Reservations"
          statusLabel="Live Bookings"
          roleLabel="Front Desk"
        />

        <div className="flex flex-col gap-6 py-4">

          {/* ========================= */}
          {/* Section Cards (Stats) */}
          {/* ========================= */}
          <SectionCards items={reservationStats} />

          {/* ========================= */}
          {/* Reservation Table */}
          {/* ========================= */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">

                <CardTitle>Recent Reservations</CardTitle>

                <Button>Create Reservation</Button>

              </CardHeader>

              <RecentReservationsTable data={reservations} />

            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}