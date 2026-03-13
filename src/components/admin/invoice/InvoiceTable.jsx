// src/components/admin/invoice/InvoiceTable.jsx
"use client"
import * as React from "react"
import DataTable from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconFileInvoice, IconEdit, IconTrash, IconEye } from "@tabler/icons-react"
import { toast } from "sonner"

const formatCurrencyINR = (n) =>
  Number(n ?? 0).toLocaleString("en-IN", { style: "currency", currency: "INR" })

const formatDateShort = (iso) => (iso ? new Date(iso).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "-")

export default function InvoiceTable({ invoices = [], onEdit = () => {}, onDelete = () => {}, onView = () => {} }) {
  const handleDelete = (inv) => {
    if (window.confirm(`Delete invoice ${inv.invoiceNumber}?`)) {
      onDelete(inv)
      toast.success(`Deleted ${inv.invoiceNumber}`)
    }
  }

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "invoiceNumber",
        header: "Invoice",
        cell: ({ row }) => {
          const inv = row.original
          return (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                <IconFileInvoice className="size-4" />
              </div>
              <div>
                <div className="font-medium">{inv.invoiceNumber}</div>
                <div className="text-xs text-muted-foreground">
                  Issued: {formatDateShort(inv.issueDate)} • Due: {formatDateShort(inv.dueDate)}
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
          const s = row.original.status
          const variant = s === "PAID" ? "default" : s === "ISSUED" ? "secondary" : s === "DRAFT" ? "outline" : "destructive"
          return <Badge variant={variant}>{s}</Badge>
        },
      },
      {
        accessorKey: "totalAmount",
        header: "Total",
        cell: ({ row }) => <div className="font-medium">{formatCurrencyINR(row.original.totalAmount)}</div>,
      },
      {
        accessorKey: "currency",
        header: "Currency",
      },
      {
        accessorKey: "version",
        header: "Ver.",
        cell: ({ row }) => <div className="text-center">{row.original.version ?? "-"}</div>,
      },
      {
        accessorKey: "payments",
        header: "Payments",
        cell: ({ row }) => {
          const payments = row.original.payments || []
          return <div className="text-sm text-muted-foreground">{payments.length} payment(s)</div>
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const inv = row.original
          return (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(inv)} aria-label={`Edit ${inv.invoiceNumber}`}>
                <IconEdit className="size-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onView(inv)} aria-label={`View ${inv.invoiceNumber}`}>
                <IconEye className="size-4" />
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(inv)} aria-label={`Delete ${inv.invoiceNumber}`}>
                <IconTrash className="size-4" />
              </Button>
            </div>
          )
        },
      },
    ],
    [onEdit, onDelete, onView]
  )

  return <DataTable data={invoices} columns={columns} initialPageSize={10} idSeed="invoices" />
}