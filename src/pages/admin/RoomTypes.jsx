// app/room-types/page.jsx
"use client"

import * as React from "react"
import { z } from "zod"
import { SiteHeader } from "@/components/admin/site-header"
import { SectionCards } from "@/components/admin/section-cards"
import { AreaAnalyticsChart } from "@/components/admin/chart-area-interactive"
import { QuickActions } from "@/components/admin/QuickActions"
import { AlertsPanel } from "@/components/admin/alerts-panel"
import RoomTypeEditor from "@/components/admin/roomtype/editor"
import RoomTypeTable from "@/components/admin/roomtype/table"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

import {
  IconBed,
  IconPlus,
  IconBuildingSkyscraper,
} from "@tabler/icons-react"

// ---------------------------
// Demo/sample room-type data
// ---------------------------
const sampleRoomTypesInitial = [
  {
    id: "rt-1",
    name: "Deluxe King",
    baseRate: 6850,
    bedType: "King",
    areaSqFt: 420,
    amenitiesSummary: "AC • Smart TV • Minibar • Sea view",
    maxOccupancy: 3,
    totalKeys: 10,
    createdAt: "2025-01-10T12:00:00Z",
  },
  {
    id: "rt-2",
    name: "Standard Twin",
    baseRate: 4200,
    bedType: "Twin",
    areaSqFt: 300,
    amenitiesSummary: "AC • TV • Work desk",
    maxOccupancy: 2,
    totalKeys: 18,
    createdAt: "2024-11-02T09:00:00Z",
  },
  {
    id: "rt-3",
    name: "Suite",
    baseRate: 12500,
    bedType: "King + Sofa bed",
    areaSqFt: 720,
    amenitiesSummary: "Living area • Jacuzzi • Kitchenette",
    maxOccupancy: 4,
    totalKeys: 4,
    createdAt: "2024-09-12T09:00:00Z",
  },
]

// ---------------------------
// Zod schema (client-side basic validation)
// ---------------------------
const roomTypeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name required"),
  baseRate: z.number().min(0),
  bedType: z.string().optional(),
  areaSqFt: z.number().int().optional(),
  amenitiesSummary: z.string().optional(),
  maxOccupancy: z.number().int().positive().optional(),
  totalKeys: z.number().int().nonnegative().optional(),
})

// ---------------------------
// Helper
// ---------------------------
const formatCurrencyINR = (n) =>
  Number(n ?? 0).toLocaleString("en-IN", { style: "currency", currency: "INR" })

// ---------------------------
// Page: Room Type Management
// ---------------------------
export default function RoomTypeManagementPage() {
  // Replace these states with API fetches / mutations in real app
  const [roomTypes, setRoomTypes] = React.useState(() => sampleRoomTypesInitial)
  const [editorOpen, setEditorOpen] = React.useState(false)
  const [editing, setEditing] = React.useState(null)

  // KPI cards for the section (small example)
  const cards = [
    {
      id: "rt-count",
      description: "Room Types",
      title: `${roomTypes.length}`,
      badgeText: "+0.8%",
      badgeIcon: <IconBuildingSkyscraper className="size-4" />,
      badgeVariant: "outline",
      footerMain: <>Inventory</>,
      footerSub: "Across property",
    },
    {
      id: "avg-rate",
      description: "Avg. Rate",
      title: roomTypes.length ? formatCurrencyINR(Math.round(roomTypes.reduce((s, r) => s + (r.baseRate || 0), 0) / roomTypes.length)) : "—",
      badgeText: "+2.4%",
      badgeIcon: <IconBed className="size-4" />,
      badgeVariant: "outline",
      footerMain: <>Average base rate</>,
    },
  ]

  const openCreate = () => {
    setEditing(null)
    setEditorOpen(true)
  }

  const handleSave = (payload) => {
    // if id exists in list -> update, else create
    setRoomTypes((prev) => {
      const idx = prev.findIndex((r) => r.id === payload.id)
      const nowIso = new Date().toISOString()
      if (idx === -1) {
        // create
        const newOne = {
          ...payload,
          createdAt: nowIso,
        }
        toast.success("Room type created")
        return [newOne, ...prev]
      } else {
        // update
        const next = [...prev]
        next[idx] = { ...next[idx], ...payload }
        toast.success("Room type updated")
        return next
      }
    })
  }

  const handleEdit = (row) => {
    setEditing(row)
    setEditorOpen(true)
  }

  const handleDelete = (row) => {
    const ok = window.confirm(`Delete room type "${row.name}"? This cannot be undone.`)
    if (!ok) return
    setRoomTypes((prev) => prev.filter((r) => r.id !== row.id))
    toast.success("Room type deleted")
  }

  // chart data placeholder (optional)
  const chartData = [
    { date: "2024-10-01", value: 10 },
    { date: "2024-12-01", value: 12 },
    { date: "2025-02-01", value: 14 },
  ]
  const chartConfig = { value: { label: "Room types", color: "var(--color-chart-1)" } }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <SiteHeader title="Room Types" />

        <div className="flex flex-col gap-6 py-4">
          {/* KPI cards */}
          <SectionCards items={cards} />

          {/* Chart + alerts */}
          <div className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-3 lg:px-6">
            <div className="lg:col-span-2">
              <AreaAnalyticsChart
                title="Room Type Count"
                description="Room type changes over time"
                data={chartData}
                config={chartConfig}
                dateKey="date"
              />
            </div>

            <AlertsPanel />
          </div>

          {/* Quick actions + create */}
          <div className="px-4 lg:px-6 flex items-center justify-between gap-4">
            <QuickActions />
            <div className="ml-auto">
              <Button onClick={openCreate}>
                <IconPlus className="size-4 mr-2" />
                New Room Type
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Room types</CardTitle>
                  <CardDescription>Manage room type rate, occupancy and amenities</CardDescription>
                </div>
                <div className="hidden sm:block">
                  <Badge>Local demo</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <RoomTypeTable roomTypes={roomTypes} onEdit={handleEdit} onDelete={handleDelete} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Editor Drawer (create / edit) */}
      <RoomTypeEditor open={editorOpen} setOpen={setEditorOpen} initial={editing} onSave={handleSave} />
    </div>
  )
}