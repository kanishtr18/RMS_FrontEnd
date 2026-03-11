// app/guests/page.jsx
"use client"

import { SiteHeader } from "@/components/admin/site-header"
import { SectionCards } from "@/components/admin/section-cards"
import { AreaAnalyticsChart } from "@/components/admin/chart-area-interactive"
import { QuickActions } from "@/components/admin/QuickActions"
import { AlertsPanel } from "@/components/admin/alerts-panel"
import GuestListTable from "@/components/admin/GuestListTable"

import {
  IconUsers,
  IconTrendingUp,
  IconTrendingDown,
  IconStar,
  IconUserPlus,
  IconUserCheck,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// ---------- Sample guest data (self-contained) ----------
const sampleGuests = [
  {
    id: 1,
    name: "Anisha Kumar",
    email: "anisha.kumar@example.com",
    phone: "+91 98765 43210",
    status: "Active", // Active | Inactive | Blacklisted
    vip: true,
    totalStays: 12,
    lastStay: "2025-02-10T15:00:00.000Z",
    source: "Direct",
    notes: "Prefers high-floor rooms. Vegan meals.",
  },
  {
    id: 2,
    name: "Ravi Patel",
    email: "ravi.patel@example.com",
    phone: "+91 91234 56789",
    status: "Active",
    vip: false,
    totalStays: 3,
    lastStay: "2025-03-01T11:30:00.000Z",
    source: "OTA",
    notes: "",
  },
  {
    id: 3,
    name: "Maya Iyer",
    email: "maya.iyer@example.com",
    phone: "+91 99887 66554",
    status: "Inactive",
    vip: false,
    totalStays: 1,
    lastStay: "2024-12-22T10:00:00.000Z",
    source: "Website",
    notes: "Requested early check-in last visit.",
  },
  {
    id: 4,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 90000 11111",
    status: "Blacklisted",
    vip: false,
    totalStays: 0,
    lastStay: null,
    source: "Phone",
    notes: "Payment dispute — blocked.",
  },
]

// ---------- Page component ----------
export default function GuestManagement() {
  // small chart data + config - reuseable AreaAnalyticsChart expects {dateKey, data, config}
  const chartData = [
    { date: "2024-12-01", guests: 40, returning: 12 },
    { date: "2024-12-08", guests: 55, returning: 15 },
    { date: "2025-01-05", guests: 72, returning: 25 },
    { date: "2025-01-20", guests: 64, returning: 18 },
    { date: "2025-02-05", guests: 88, returning: 36 },
    { date: "2025-02-20", guests: 95, returning: 40 },
    { date: "2025-03-01", guests: 102, returning: 45 },
  ]

  const config = {
    guests: { label: "New Guests", color: "var(--color-chart-2)" },
    returning: { label: "Returning Guests", color: "var(--color-chart-1)" },
  }

  const guestCards = [
    {
      id: "total-guests",
      description: "Total Guests",
      title: "1,284",
      badgeText: "+11%",
      badgeIcon: <IconTrendingUp className="size-4" />,
      badgeVariant: "outline",
      footerMain: <>Growing guest base</>,
      footerIcon: <IconUsers className="size-4" />,
      footerSub: "All-time registrations",
    },
    {
      id: "new-guests",
      description: "New Guests This Month",
      title: "102",
      badgeText: "+8%",
      badgeIcon: <IconUserPlus className="size-4" />,
      badgeVariant: "default",
      footerMain: <>Strong guest acquisition</>,
      footerSub: "Compared to last month",
    },
    {
      id: "returning-guests",
      description: "Returning Guests",
      title: "45",
      badgeText: "+6%",
      badgeIcon: <IconUserCheck className="size-4" />,
      badgeVariant: "outline",
      footerMain: <>High guest loyalty</>,
      footerSub: "Repeat bookings",
    },
    {
      id: "vip-guests",
      description: "VIP Guests",
      title: "28",
      badgeText: "+3%",
      badgeIcon: <IconStar className="size-4" />,
      badgeVariant: "outline",
      footerMain: <>Premium customers</>,
      footerSub: "Special services enabled",
    },
    {
      id: "inactive-guests",
      description: "Inactive Guests",
      title: "190",
      badgeText: "-2%",
      badgeIcon: <IconTrendingDown className="size-4" />,
      badgeVariant: "secondary",
      footerMain: <>Opportunity for remarketing</>,
      footerSub: "No stay in last 12 months",
    },
    {
      id: "blacklisted",
      description: "Blacklisted Guests",
      title: "4",
      badgeText: "Alert",
      badgeIcon: <IconTrendingDown className="size-4" />,
      badgeVariant: "destructive",
      footerMain: <>Security flagged accounts</>,
      footerSub: "Restricted bookings",
    },
  ]

  const guestColumns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <GuestViewer guest={row.original} />,
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "totalStays",
      header: "Total stays",
      cell: ({ row }) => (
        <div className="text-center font-medium">{row.original.totalStays}</div>
      ),
    },
    {
      accessorKey: "lastStay",
      header: "Last stay",
      cell: ({ row }) => formatDateShort(row.original.lastStay),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <>
          <Badge
            variant={
              row.original.status === "Active"
                ? "default"
                : row.original.status === "Inactive"
                ? "secondary"
                : "destructive"
            }
          >
            {row.original.status}
          </Badge>
          {row.original.vip && <Badge className="ml-2">VIP</Badge>}
        </>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => alert("Open guest history (demo)")}
          >
            History
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => alert("More actions (demo)")}
          >
            More
          </Button>
        </div>
      ),
    },
  ]
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <SiteHeader title="Guests"/>

        <div className="flex flex-col gap-6 py-4">
          {/* Quick actions */}
          <div className="px-4 lg:px-6">
            <QuickActions />
          </div>

          {/* KPI cards */}
          <SectionCards items={guestCards}/>

          {/* Chart + alerts */}
          <div className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-3 lg:px-6">
            <div className="lg:col-span-2">
              <AreaAnalyticsChart
                title="Guest Registrations"
                description="New vs returning guest registrations"
                data={chartData}
                config={config}
                dateKey="date"
              />
            </div>

            <AlertsPanel />
          </div>

          {/* Guest table */}
          <div className="px-4 lg:px-6">
            <GuestListTable data  ={sampleGuests} />
          </div>
        </div>
      </div>
    </div>
  )
}