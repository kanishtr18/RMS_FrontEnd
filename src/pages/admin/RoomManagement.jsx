// app/rooms/page.jsx
"use client"

import * as React from "react"
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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { IconBed, IconBuildingSkyscraper, IconTool as IconWrench, IconClipboardList, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react"

const formatDateShort = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "—"

// ---------- Sample domain data (replace with API data) ----------
const sampleRoomTypes = [
  { id: "rt-1", name: "Deluxe", baseRate: 6850, bedType: "King", areaSqFt: 320, maxOccupancy: 2, amenitiesSummary: "AC, TV, Mini-bar", totalKeys: 10 },
  { id: "rt-2", name: "Suite", baseRate: 12500, bedType: "King + Sofa", areaSqFt: 520, maxOccupancy: 4, amenitiesSummary: "AC, TV, Mini-bar, Kitchenette", totalKeys: 4 },
  { id: "rt-3", name: "Standard", baseRate: 3500, bedType: "Queen", areaSqFt: 220, maxOccupancy: 2, amenitiesSummary: "AC, TV", totalKeys: 20 },
]

const sampleAmenities = [
  { id: "a-1", name: "WiFi" },
  { id: "a-2", name: "Mini-bar" },
  { id: "a-3", name: "Ocean View" },
  { id: "a-4", name: "Bathtub" },
]

const sampleEmployees = [
  { id: "e-1", name: "Ramesh Kumar" },
  { id: "e-2", name: "Sonia Patel" },
  { id: "e-3", name: "Vikram Shah" },
]

// minimal sample rooms
const sampleRooms = [
  {
    id: "room-101",
    roomNumber: "101",
    floor: "1",
    status: "AVAILABLE", // AVAILABLE | OCCUPIED | MAINTENANCE | BLOCKED
    description: "Sea-facing deluxe room",
    maxOccupancy: 2,
    roomTypeId: "rt-1",
    roomAmenities: [{ id: "a-1" }, { id: "a-2" }],
    roomBlocks: [],
    maintenanceRequests: [{ id: "mr-1", title: "AC not cooling", createdAt: "2025-02-25" }],
    housekeepingTasks: [{ id: "hk-1", staffId: "e-2", scheduledAt: "2025-03-05T09:00:00", priority: "HIGH", status: "SCHEDULED" }],
  },
  {
    id: "room-102",
    roomNumber: "102",
    floor: "1",
    status: "OCCUPIED",
    description: "Standard double",
    maxOccupancy: 2,
    roomTypeId: "rt-3",
    roomAmenities: [{ id: "a-1" }],
    roomBlocks: [],
    maintenanceRequests: [],
    housekeepingTasks: [],
  },
  {
    id: "room-201",
    roomNumber: "201",
    floor: "2",
    status: "MAINTENANCE",
    description: "Suite - under maintenance",
    maxOccupancy: 4,
    roomTypeId: "rt-2",
    roomAmenities: [{ id: "a-1" }, { id: "a-4" }],
    roomBlocks: [],
    maintenanceRequests: [{ id: "mr-2", title: "Carpet replacement", createdAt: "2025-02-20" }],
    housekeepingTasks: [],
  },
]

// ---------- Room Viewer (details drawer) ----------
function RoomViewer({ room, onEdit }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="link" className="px-0 text-left">{room.roomNumber} — {room.description}</Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-start justify-between gap-4 w-full">
            <div>
              <DrawerTitle className="text-lg">Room {room.roomNumber}</DrawerTitle>
              <DrawerDescription>{room.description}</DrawerDescription>
              <div className="mt-2 text-sm text-muted-foreground">
                Type: {room.roomTypeName ?? "-"} • Floor: {room.floor} • Max occupancy: {room.maxOccupancy}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="mt-1">
                <Badge variant={room.status === "AVAILABLE" ? "default" : room.status === "OCCUPIED" ? "destructive" : "secondary"}>
                  {room.status}
                </Badge>
              </div>
            </div>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-6">
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-sm">
            <div>
              <Label>Room Type</Label>
              <div className="font-medium">{room.roomTypeName ?? "-"}</div>
            </div>
            <div>
              <Label>Floor</Label>
              <div className="font-medium">{room.floor}</div>
            </div>
            <div>
              <Label>Amenities</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {(room.roomAmenities || []).map((a) => (
                  <Badge key={a.id} className="px-2">{a.name ?? a.id}</Badge>
                ))}
                {(!room.roomAmenities || room.roomAmenities.length === 0) && <div className="text-muted-foreground">No amenities</div>}
              </div>
            </div>

            <div>
              <Label>Housekeeping tasks</Label>
              <div className="mt-1 text-sm">
                {(room.housekeepingTasks || []).length === 0 ? (
                  <div className="text-muted-foreground">No tasks</div>
                ) : (
                  <ul className="list-disc pl-4">
                    {room.housekeepingTasks.map((t) => (
                      <li key={t.id}>
                        {t.scheduledAt ? new Date(t.scheduledAt).toLocaleString() : "—"} — {t.priority} • {t.status}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <Label>Maintenance</Label>
              <div className="mt-1 text-sm">
                {(room.maintenanceRequests || []).length === 0 ? (
                  <div className="text-muted-foreground">No issues</div>
                ) : (
                  <ul className="list-disc pl-4">
                    {room.maintenanceRequests.map((m) => (
                      <li key={m.id}>{m.title} • reported {formatDateShort(m.createdAt)}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex gap-2">
            <Button onClick={() => onEdit(room)}>Edit</Button>
            <Button variant="outline" onClick={() => toast.success("Open maintenance (demo)")}>Create Maintenance</Button>
            <Button variant="ghost" onClick={() => toast("Open housekeeping (demo)")}>Schedule Housekeeping</Button>
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

// ---------- Room form drawer (create / edit) ----------
function RoomFormDrawer({ openRoom, roomTypes, amenities, onSave, onClose }) {
  const isEdit = !!openRoom
  const [roomNumber, setRoomNumber] = React.useState(openRoom?.roomNumber ?? "")
  const [floor, setFloor] = React.useState(openRoom?.floor ?? "")
  const [status, setStatus] = React.useState(openRoom?.status ?? "AVAILABLE")
  const [roomTypeId, setRoomTypeId] = React.useState(openRoom?.roomTypeId ?? (roomTypes[0]?.id ?? ""))
  const [description, setDescription] = React.useState(openRoom?.description ?? "")
  const [maxOccupancy, setMaxOccupancy] = React.useState(openRoom?.maxOccupancy ?? 2)
  const [selectedAmenities, setSelectedAmenities] = React.useState((openRoom?.roomAmenities || []).map((a) => a.id) || [])

  React.useEffect(() => {
    if (openRoom) {
      setRoomNumber(openRoom.roomNumber ?? "")
      setFloor(openRoom.floor ?? "")
      setStatus(openRoom.status ?? "AVAILABLE")
      setRoomTypeId(openRoom.roomTypeId ?? (roomTypes[0]?.id ?? ""))
      setDescription(openRoom.description ?? "")
      setMaxOccupancy(openRoom.maxOccupancy ?? 2)
      setSelectedAmenities((openRoom.roomAmenities || []).map((a) => a.id))
    } else {
      setRoomNumber("")
      setFloor("")
      setStatus("AVAILABLE")
      setRoomTypeId(roomTypes[0]?.id ?? "")
      setDescription("")
      setMaxOccupancy(2)
      setSelectedAmenities([])
    }
  }, [openRoom, roomTypes])

  function submit() {
    // minimal validation
    if (!roomNumber) return toast.error("Room number required")
    if (!roomTypeId) return toast.error("Room type required")

    const payload = {
      id: openRoom?.id ?? `room-${Date.now()}`,
      roomNumber,
      floor,
      status,
      roomTypeId,
      roomTypeName: roomTypes.find((r) => r.id === roomTypeId)?.name ?? "",
      description,
      maxOccupancy,
      roomAmenities: selectedAmenities.map((id) => ({ id, name: amenities.find((a) => a.id === id)?.name })),
      roomBlocks: openRoom?.roomBlocks ?? [],
      maintenanceRequests: openRoom?.maintenanceRequests ?? [],
      housekeepingTasks: openRoom?.housekeepingTasks ?? [],
    }

    onSave(payload)
  }

  return (
    <Drawer open={!!openRoom} onOpenChange={() => onClose()}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{isEdit ? "Edit Room" : "Create Room"}</DrawerTitle>
          <DrawerDescription>{isEdit ? `Editing ${openRoom.roomNumber}` : "Create a new room"}</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Room number</Label>
              <Input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="e.g. 203" />
            </div>

            <div>
              <Label>Floor</Label>
              <Input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="e.g. 2" />
            </div>

            <div>
              <Label>Room type</Label>
              <Select value={roomTypeId} onValueChange={(v) => setRoomTypeId(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map((rt) => (
                    <SelectItem key={rt.id} value={rt.id}>
                      {rt.name} — ₹{rt.baseRate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AVAILABLE">Available</SelectItem>
                  <SelectItem value="OCCUPIED">Occupied</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Max occupancy</Label>
              <Input type="number" value={maxOccupancy} onChange={(e) => setMaxOccupancy(+e.target.value)} />
            </div>

            <div>
              <Label>Amenities</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {amenities.map((a) => {
                  const active = selectedAmenities.includes(a.id)
                  return (
                    <Button
                      key={a.id}
                      size="sm"
                      variant={active ? "default" : "outline"}
                      onClick={() =>
                        setSelectedAmenities((prev) =>
                          prev.includes(a.id) ? prev.filter((x) => x !== a.id) : [...prev, a.id]
                        )
                      }
                    >
                      {a.name}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex gap-2">
            <Button onClick={submit}>{isEdit ? "Save changes" : "Create room"}</Button>
            <Button variant="ghost" onClick={() => onClose()}>Cancel</Button>
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

// ---------- Page (Room management) ----------
export default function RoomManagement() {
  const [roomTypes] = React.useState(sampleRoomTypes)
  const [amenities] = React.useState(sampleAmenities)
  const [employees] = React.useState(sampleEmployees)

  const [rooms, setRooms] = React.useState(() =>
    sampleRooms.map((r) => ({ ...r, roomTypeName: sampleRoomTypes.find((t) => t.id === r.roomTypeId)?.name }))
  )

  // Drawer state: openRoom = object when edit/create triggered
  const [openRoom, setOpenRoom] = React.useState(null)

  // cards (KPI)
  const cards = [
    {
      id: "total-rooms",
      description: "Total Rooms",
      title: String(rooms.length),
      badgeText: "",
      footerMain: <>Rooms in inventory</>,
      footerIcon: <IconBuildingSkyscraper className="size-4" />,
      footerSub: "All keys & types",
    },
    {
      id: "occupied",
      description: "Occupied",
      title: String(rooms.filter((r) => r.status === "OCCUPIED").length),
      badgeText: "",
      footerMain: <>Currently occupied</>,
      footerIcon: <IconBed className="size-4" />,
      footerSub: "Live stays",
    },
    {
      id: "under-maintenance",
      description: "Maintenance",
      title: String(rooms.filter((r) => r.status === "MAINTENANCE").length),
      badgeText: "",
      footerMain: <>Needs attention</>,
      footerIcon: <IconWrench className="size-4" />,
      footerSub: "Open tickets",
    },
  ]

  // Table columns (DataTable compatible)
  const columns = React.useMemo(
    () => [
      {
        accessorKey: "roomNumber",
        header: "Room",
        cell: ({ row }) => <RoomViewer room={row.original} onEdit={(r) => setOpenRoom(r)} />,
      },
      {
        accessorKey: "roomTypeName",
        header: "Type",
      },
      {
        accessorKey: "floor",
        header: "Floor",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const s = row.original.status
          return <Badge variant={s === "AVAILABLE" ? "default" : s === "OCCUPIED" ? "destructive" : "secondary"}>{s}</Badge>
        },
      },
      {
        accessorKey: "maxOccupancy",
        header: "Max occupancy",
        cell: ({ row }) => <div className="text-center font-medium">{row.original.maxOccupancy}</div>,
      },
      {
        id: "amenities",
        header: "Amenities",
        cell: ({ row }) => <div className="text-sm text-muted-foreground">{(row.original.roomAmenities || []).length} items</div>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const r = row.original
          return (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setOpenRoom(r)}><IconEdit className="size-4" /></Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  // delete
                  setRooms((prev) => prev.filter((p) => p.id !== r.id))
                  toast.success(`Deleted room ${r.roomNumber}`)
                }}
              >
                <IconTrash className="size-4" />
              </Button>
            </div>
          )
        },
      },
    ],
    []
  )

  function handleSaveRoom(payload) {
    setRooms((prev) => {
      const exists = prev.find((p) => p.id === payload.id)
      if (exists) {
        // update
        return prev.map((p) => (p.id === payload.id ? { ...payload } : p))
      }
      // create
      return [{ ...payload }, ...prev]
    })
    toast.success(openRoom ? "Room updated" : "Room created")
    setOpenRoom(null)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <SiteHeader title="Rooms" />

        <div className="flex flex-col gap-6 py-4">
          {/* KPI cards */}
          <SectionCards items={cards} />

          {/* Chart + alerts */}
          <div className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-3 lg:px-6">
            <div className="lg:col-span-2">
              <AreaAnalyticsChart
                title="Room Occupancy"
                description="Weekly occupancy trends"
                data={[
                  { date: "2025-01-01", occupancy: 72 },
                  { date: "2025-01-08", occupancy: 68 },
                  { date: "2025-01-15", occupancy: 75 },
                  { date: "2025-01-22", occupancy: 80 },
                  { date: "2025-01-29", occupancy: 79 },
                  { date: "2025-02-05", occupancy: 82 },
                ]}
                config={{ occupancy: { label: "Occupancy %", color: "var(--color-chart-2)" } }}
                dateKey="date"
              />
            </div>

            <AlertsPanel />
          </div>

          {/* Quick actions */}
          <div className="px-4 lg:px-6 flex items-center justify-between gap-4">
            <QuickActions />
            <div>
              <Button onClick={() => setOpenRoom({})} size="sm"><IconPlus className="size-4 mr-2" /> New Room</Button>
            </div>
          </div>

          {/* Rooms table */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Rooms</CardTitle>
                  <CardDescription>All rooms and quick management actions</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <DataTable data={rooms} columns={columns} initialPageSize={10} idSeed="rooms" />
              </CardContent>

              <CardFooter>
                <div className="text-sm text-muted-foreground">Manage room inventory, housekeeping and maintenance.</div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Room form drawer (openRoom === {} -> create) */}
      {openRoom !== null && (
        <RoomFormDrawer
          openRoom={openRoom && Object.keys(openRoom).length ? openRoom : null}
          roomTypes={roomTypes}
          amenities={amenities}
          onSave={handleSaveRoom}
          onClose={() => setOpenRoom(null)}
        />
      )}
    </div>
  )
}