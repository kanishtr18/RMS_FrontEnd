// src/components/rooms/RoomFormDrawer.jsx
"use client"
import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function RoomFormDrawer({ openRoom, roomTypes = [], amenities = [], onSave, onClose }) {
  const isEdit = !!openRoom
  const [roomNumber, setRoomNumber] = React.useState("")
  const [floor, setFloor] = React.useState("")
  const [status, setStatus] = React.useState("AVAILABLE")
  const [roomTypeId, setRoomTypeId] = React.useState(roomTypes[0]?.id ?? "")
  const [description, setDescription] = React.useState("")
  const [maxOccupancy, setMaxOccupancy] = React.useState(2)
  const [selectedAmenities, setSelectedAmenities] = React.useState([])

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

  function toggleAmenity(id) {
    setSelectedAmenities((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function submit() {
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
      roomAmenities: selectedAmenities.map((id) => ({ id, name: amenities.find((a) => a.id === id)?.name ?? id })),
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
              <Label className="pb-1 pl-2">Room number</Label>
              <Input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="e.g. 203" />
            </div>

            <div>
              <Label className="pb-1 pl-2">Floor</Label>
              <Input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="e.g. 2" />
            </div>

            <div>
              <Label className="pb-1 pl-2">Room type</Label>
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
              <Label className="pb-1 pl-2">Status</Label>
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
              <Label className="pb-1 pl-2">Max occupancy</Label>
              <Input type="number" value={maxOccupancy} onChange={(e) => setMaxOccupancy(+e.target.value)} />
            </div>

            <div>
              <Label className="pb-1 pl-2">Amenities</Label>

              {/* Selected summary (small) */}
              <div className="flex gap-2 flex-wrap mt-2">
                {selectedAmenities.length === 0 ? (
                  <div className="text-muted-foreground text-sm">No amenities selected</div>
                ) : (
                  selectedAmenities.map((id) => {
                    const a = amenities.find((x) => x.id === id)
                    return (
                      <Badge key={id} className="px-2">
                        {a?.name ?? id}
                      </Badge>
                    )
                  })
                )}
              </div>

              {/* Full selection list (badges as toggles) */}
              <div className="flex flex-wrap gap-2 mt-3">
                {amenities.map((a) => {
                  const active = selectedAmenities.includes(a.id)
                  return (
                    <Button
                      key={a.id}
                      size="sm"
                      variant={active ? "default" : "outline"}
                      onClick={() => toggleAmenity(a.id)}
                    >
                      {a.name}
                    </Button>
                  )
                })}
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label className="pb-1 pl-2">Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex gap-2">
            <Button onClick={submit}>{isEdit ? "Save changes" : "Create room"}</Button>
            <Button variant="ghost" onClick={() => onClose()}>
              Cancel
            </Button>
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