// src/components/admin/payment/PaymentTable.jsx
"use client"
import * as React from "react"
import DataTable from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconCurrencyRupee, IconEdit, IconTrash, IconEye, IconReceipt } from "@tabler/icons-react"
import { toast } from "sonner"

const formatCurrencyINR = (n) => Number(n ?? 0).toLocaleString("en-IN", { style: "currency", currency: "INR" })
const formatDateShort = (iso) => (iso ? new Date(iso).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "-")

export default function PaymentTable({ payments = [], onEdit = () => {}, onDelete = () => {}, onView = () => {} }) {
  const handleDelete = (p) => {
    if (window.confirm(`Delete payment ${p.transactionRef ?? p.id}?`)) {
      onDelete(p)
      toast.success("Payment deleted")
    }
  }

  const columns = React.useMemo(
    () => [
      {
        accessorKey: "transactionRef",
        header: "Transaction",
        cell: ({ row }) => {
          const p = row.original
          return (
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-md bg-muted flex items-center justify-center">
                <IconReceipt className="size-4" />
              </div>
              <div>
                <div className="font-medium">{p.transactionRef ?? p.id}</div>
                <div className="text-xs text-muted-foreground">
                  {p.paymentMethod} • {p.invoiceId ?? "—"}
                </div>
              </div>
            </div>
          )
        },
        enableHiding: false,
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => <div className="font-medium">{formatCurrencyINR(row.original.amount)}</div>,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const s = row.original.status
          const variant = s === "COMPLETED" ? "default" : s === "PENDING" ? "secondary" : "destructive"
          return <Badge variant={variant}>{s}</Badge>
        },
      },
      {
        accessorKey: "currency",
        header: "Currency",
      },
      {
        accessorKey: "processedAt",
        header: "Processed",
        cell: ({ row }) => formatDateShort(row.original.processedAt),
      },
      {
        id: "refunds",
        header: "Refunds",
        cell: ({ row }) => <div className="text-sm text-muted-foreground">{(row.original.refunds || []).length} refund(s)</div>,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const p = row.original
          return (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(p)} aria-label="Edit">
                <IconEdit className="size-4" />
              </Button>

              <Button size="sm" variant="ghost" onClick={() => onView(p)} aria-label="View">
                <IconEye className="size-4" />
              </Button>

              <Button size="sm" variant="destructive" onClick={() => handleDelete(p)} aria-label="Delete">
                <IconTrash className="size-4" />
              </Button>
            </div>
          )
        },
      },
    ],
    [onEdit, onDelete, onView]
  )

  return <DataTable data={payments} columns={columns} initialPageSize={10} idSeed="payments" />
}