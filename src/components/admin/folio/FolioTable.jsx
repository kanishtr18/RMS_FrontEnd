// src/components/admin/folio/FolioTable.jsx
"use client"
import * as React from "react"
import DataTable from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconFileInvoice, IconEdit, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

const formatCurrencyINR = (n) => Number(n ?? 0).toLocaleString("en-IN", { style: "currency", currency: "INR" })
const formatDateShort = (iso) => (iso ? new Date(iso).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "-")

export default function FolioTable({ folios = [], onEdit = () => {}, onDelete = () => {}, onView = () => {} }) {
  const handleDelete = (f) => {
    if (window.confirm(`Delete folio ${f.folioNumber}? This cannot be undone.`)) {
      onDelete(f)
      toast.success(`Deleted ${f.folioNumber}`)
    }
  }

  const columns = React.useMemo(() => {
    return [
      {
        accessorKey: "folioNumber",
        header: "Folio",
        cell: ({ row }) => {
          const f = row.original
          return (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                <IconFileInvoice className="size-4" />
              </div>
              <div>
                <div className="font-medium">{f.folioNumber}</div>
                <div className="text-xs text-muted-foreground">{f.name}</div>
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
          const s = row.original.status
          const variant = s === "PAID" ? "default" : s === "OPEN" ? "secondary" : "destructive"
          return <Badge variant={variant}>{s}</Badge>
        },
      },
      {
        accessorKey: "totalAmount",
        header: "Total",
        cell: ({ row }) => <div className="font-medium">{formatCurrencyINR(row.original.totalAmount)}</div>,
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
          const f = row.original
          return (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(f)} aria-label={`Edit ${f.folioNumber}`}>
                <IconEdit className="size-4" />
              </Button>

              <Button size="sm" variant="ghost" onClick={() => onView(f)} aria-label={`View ${f.folioNumber}`}>
                <span className="sr-only">View</span>View
              </Button>

              <Button size="sm" variant="destructive" onClick={() => handleDelete(f)} aria-label={`Delete ${f.folioNumber}`}>
                <IconTrash className="size-4" />
              </Button>
            </div>
          )
        },
      },
    ]
  }, [onEdit, onDelete, onView])

  return <DataTable data={folios} columns={columns} initialPageSize={10} idSeed="folios" />
}