import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconBed, IconEdit, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

const formatDateShort = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-"

export function getRoomColumns({ setOpenRoom, setRooms }) {
  return [
    {
      accessorKey: "roomNumber",
      header: "Room",
      cell: ({ row }) => {
        const room = row.original

        return (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
              <IconBed className="size-4" />
            </div>

            <div>
              <div className="font-medium">
                {room.roomNumber}
              </div>

              <div className="text-xs text-muted-foreground">
                {room.roomTypeName} • Floor {room.floor}
              </div>
            </div>
          </div>
        )
      },
      enableHiding: false,
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status

        const variant =
          status === "AVAILABLE"
            ? "default"
            : status === "OCCUPIED"
            ? "destructive"
            : "secondary"

        return <Badge variant={variant}>{status}</Badge>
      },
    },

    {
      accessorKey: "maxOccupancy",
      header: "Max occ.",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.original.maxOccupancy}
        </div>
      ),
    },

    {
      accessorKey: "roomTypeName",
      header: "Type",
    },

    {
      id: "amenities",
      header: "Amenities",
      cell: ({ row }) => {
        const list = row.original.roomAmenities || []
        const visible = list.slice(0, 3)

        return (
          <div className="flex items-center gap-2 flex-wrap">
            {visible.map((a) => (
              <Badge key={a.id} className="px-2">
                {a.name ?? a.id}
              </Badge>
            ))}

            {list.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{list.length - 3}
              </span>
            )}
          </div>
        )
      },
    },

    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => formatDateShort(row.original.createdAt),
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const room = row.original

        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setOpenRoom(room)}
            >
              <IconEdit className="size-4" />
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                setRooms((prev) =>
                  prev.filter((r) => r.id !== room.id)
                )

                toast.success(`Deleted room ${room.roomNumber}`)
              }}
            >
              <IconTrash className="size-4" />
            </Button>
          </div>
        )
      },
    },
  ]
}