// app/room-types/page.jsx
"use client"

import * as React from "react"
import { z } from "zod"
import { SiteHeader } from "@/components/admin/site-header"
import { SectionCards } from "@/components/admin/section-cards"
import { AreaAnalyticsChart } from "@/components/admin/chart-area-interactive"
import { QuickActions } from "@/components/admin/QuickActions"
import { AlertsPanel } from "@/components/admin/alerts-panel"
import DataTable from "@/components/admin/data-table"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

import {
  IconBed,
  IconPlus,
  IconPencil,
  IconTrash,
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

const formatDateShort = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "-"

// ---------------------------
// RoomType Editor Drawer (Create / Edit)
// ---------------------------
function RoomTypeEditor({ open, setOpen, initial, onSave }) {
  // initial: object (for edit) or null (create)
  const isEdit = !!initial
  const [form, setForm] = React.useState(() => ({
    id: initial?.id ?? `rt-${Math.random().toString(36).slice(2, 9)}`,
    name: initial?.name ?? "",
    baseRate: initial?.baseRate ?? 0,
    bedType: initial?.bedType ?? "",
    areaSqFt: initial?.areaSqFt ?? "",
    amenitiesSummary: initial?.amenitiesSummary ?? "",
    maxOccupancy: initial?.maxOccupancy ?? 1,
    totalKeys: initial?.totalKeys ?? 0,
  }))

  React.useEffect(() => {
    // when initial changes, re-init form
    setForm({
      id: initial?.id ?? `rt-${Math.random().toString(36).slice(2, 9)}`,
      name: initial?.name ?? "",
      baseRate: initial?.baseRate ?? 0,
      bedType: initial?.bedType ?? "",
      areaSqFt: initial?.areaSqFt ?? "",
      amenitiesSummary: initial?.amenitiesSummary ?? "",
      maxOccupancy: initial?.maxOccupancy ?? 1,
      totalKeys: initial?.totalKeys ?? 0,
    })
  }, [initial, open])

  const submit = () => {
    // basic client validation
    const result = roomTypeSchema.safeParse({
      ...form,
      baseRate: Number(form.baseRate),
      areaSqFt: form.areaSqFt ? Number(form.areaSqFt) : undefined,
      maxOccupancy: form.maxOccupancy ? Number(form.maxOccupancy) : undefined,
      totalKeys: form.totalKeys ? Number(form.totalKeys) : undefined,
    })

    if (!result.success) {
      const first = result.error.errors[0]
      toast.error(first?.message ?? "Validation error")
      return
    }

    onSave(result.data)
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{isEdit ? "Edit Room Type" : "Create Room Type"}</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="e.g. Deluxe King" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Base Rate (INR)</Label>
              <Input type="number" value={form.baseRate} onChange={(e) => setForm((s) => ({ ...s, baseRate: e.target.value }))} />
            </div>
            <div>
              <Label>Bed Type</Label>
              <Input value={form.bedType} onChange={(e) => setForm((s) => ({ ...s, bedType: e.target.value }))} placeholder="King / Twin / Sofa bed" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label>Area (sq ft)</Label>
              <Input type="number" value={form.areaSqFt} onChange={(e) => setForm((s) => ({ ...s, areaSqFt: e.target.value }))} />
            </div>
            <div>
              <Label>Max Occupancy</Label>
              <Input type="number" value={form.maxOccupancy} onChange={(e) => setForm((s) => ({ ...s, maxOccupancy: e.target.value }))} />
            </div>
            <div>
              <Label>Total Keys</Label>
              <Input type="number" value={form.totalKeys} onChange={(e) => setForm((s) => ({ ...s, totalKeys: e.target.value }))} />
            </div>
          </div>

          <div>
            <Label>Amenities summary</Label>
            <Input value={form.amenitiesSummary} onChange={(e) => setForm((s) => ({ ...s, amenitiesSummary: e.target.value }))} placeholder="Comma separated short list" />
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button onClick={submit}>{isEdit ? "Save changes" : "Create room type"}</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </div>
        </div>

        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  )
}

// ---------------------------
// RoomType Table wrapper using DataTable
// ---------------------------
function RoomTypeTable({ roomTypes, onEdit, onDelete }) {
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
            <IconBed className="size-4" />
          </div>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-xs text-muted-foreground">{row.original.amenitiesSummary}</div>
          </div>
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "baseRate",
      header: "Base Rate",
      cell: ({ row }) => <div className="font-semibold">{formatCurrencyINR(row.original.baseRate)}</div>,
    },
    {
      accessorKey: "bedType",
      header: "Bed Type",
    },
    {
      accessorKey: "areaSqFt",
      header: "Area (sq ft)",
    },
    {
      accessorKey: "maxOccupancy",
      header: "Max occ.",
      cell: ({ row }) => <div className="text-center font-medium">{row.original.maxOccupancy}</div>,
    },
    {
      accessorKey: "totalKeys",
      header: "Keys",
      cell: ({ row }) => <div className="text-center">{row.original.totalKeys ?? "-"}</div>,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => formatDateShort(row.original.createdAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(row.original)}>
            <IconPencil className="size-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(row.original)}>
            <IconTrash className="size-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ]

  return <DataTable data={roomTypes} columns={columns} initialPageSize={10} idSeed="roomtypes" />
}

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

              <CardFooter>
                <div className="text-sm text-muted-foreground">Tip: integrate with your API for persistence</div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Editor Drawer (create / edit) */}
      <RoomTypeEditor open={editorOpen} setOpen={setEditorOpen} initial={editing} onSave={handleSave} />
    </div>
  )
}