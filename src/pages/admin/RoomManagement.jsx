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
import { toast } from "sonner"
import { IconBed, IconBuildingSkyscraper, IconTool as IconWrench, IconPlus } from "@tabler/icons-react"

import RoomFormDrawer from "@/components/admin/room/RoomFormDrawer"
import { getRoomColumns } from "@/components/admin/room/RoomColumns"
import { sampleRoomTypes, sampleAmenities, sampleEmployees, sampleRooms } from "@/components/admin/room/sampleData"

export default function RoomManagement() {
  const [roomTypes] = React.useState(sampleRoomTypes)
  const [amenities] = React.useState(sampleAmenities)
  const [employees] = React.useState(sampleEmployees)

  const [rooms, setRooms] = React.useState(() =>
    sampleRooms.map((r) => ({ ...r, roomTypeName: sampleRoomTypes.find((t) => t.id === r.roomTypeId)?.name }))
  )

  // Drawer state: openRoom = object when edit/create triggered
  const [openRoom, setOpenRoom] = React.useState(null)

  const cards = [
    {
      id: "total-rooms",
      description: "Total Rooms",
      title: String(rooms.length),
      footerMain: <>Rooms in inventory</>,
      footerIcon: <IconBuildingSkyscraper className="size-4" />,
      footerSub: "All keys & types",
    },
    {
      id: "occupied",
      description: "Occupied",
      title: String(rooms.filter((r) => r.status === "OCCUPIED").length),
      footerMain: <>Currently occupied</>,
      footerIcon: <IconBed className="size-4" />,
      footerSub: "Live stays",
    },
    {
      id: "under-maintenance",
      description: "Maintenance",
      title: String(rooms.filter((r) => r.status === "MAINTENANCE").length),
      footerMain: <>Needs attention</>,
      footerIcon: <IconWrench className="size-4" />,
      footerSub: "Open tickets",
    },
  ]

  const columns = React.useMemo(() => getRoomColumns({ setOpenRoom, setRooms }), [/* stable */])

  function handleSaveRoom(payload) {
    setRooms((prev) => {
      const exists = prev.find((p) => p.id === payload.id)
      if (exists) {
        return prev.map((p) => (p.id === payload.id ? { ...payload } : p))
      }
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
          <SectionCards items={cards} />

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

          <div className="px-4 lg:px-6 flex items-center justify-between gap-4">
            <QuickActions />
            <div>
              <Button onClick={() => setOpenRoom({})} size="sm">
                <IconPlus className="size-4 mr-2" /> New Room
              </Button>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Rooms</CardTitle>
                  <CardDescription>All rooms and quick management actions</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="m-0.5">
                <DataTable data={rooms} columns={columns} initialPageSize={10} idSeed="rooms" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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