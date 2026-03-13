// src/components/rooms/RoomTypeTable.jsx
"use client"

import * as React from "react"
import PropTypes from "prop-types"
import DataTable from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconBed, IconPencil, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

/** Helpers */
const formatCurrencyINR = (n) =>
  Number(n ?? 0).toLocaleString("en-IN", { style: "currency", currency: "INR" })

const formatDateShort = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "-"

/**
 * RoomTypeTable
 *
 * Props:
 * - roomTypes: array of room type objects
 * - onEdit: (roomType) => void
 * - onDelete: (roomType) => void
 */
export default function RoomTypeTable({ roomTypes = [], onEdit = () => {}, onDelete = () => {} }) {
  const handleDelete = (rt) => {
    // small confirmation before delete
    if (window.confirm(`Delete room type "${rt.name}"? This action cannot be undone.`)) {
      try {
        onDelete(rt)
        toast.success(`${rt.name} deleted`)
      } catch (err) {
        toast.error("Could not delete — try again")
      }
    }
  }

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const rt = row.original
          return (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                <IconBed className="size-4" />
              </div>

              <div>
                <div className="font-medium">{rt.name}</div>

                {/* show either an amenities array as badges or fallback to the text summary */}
                {Array.isArray(rt.amenities) && rt.amenities.length > 0 ? (
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {rt.amenities.map((a) => (
                      <Badge key={a.id ?? a.name} className="px-2 py-0.5 text-xs">
                        {a.name ?? a.id}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  rt.amenitiesSummary && <div className="text-xs text-muted-foreground mt-1">{rt.amenitiesSummary}</div>
                )}
              </div>
            </div>
          )
        },
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
        cell: ({ row }) => (row.original.areaSqFt ? String(row.original.areaSqFt) : "-"),
      },
      {
        accessorKey: "maxOccupancy",
        header: "Max occ.",
        cell: ({ row }) => <div className="text-center font-medium">{row.original.maxOccupancy ?? "-"}</div>,
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
        cell: ({ row }) => {
          const rt = row.original
          return (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(rt)} aria-label={`Edit ${rt.name}`}>
                <IconPencil className="size-4" />
                <span className="sr-only">Edit</span>
              </Button>

              <Button size="sm" variant="destructive" onClick={() => handleDelete(rt)} aria-label={`Delete ${rt.name}`}>
                <IconTrash className="size-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          )
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return <DataTable data={roomTypes} columns={columns} initialPageSize={10} idSeed="roomtypes" />
}

RoomTypeTable.propTypes = {
  roomTypes: PropTypes.array,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
}