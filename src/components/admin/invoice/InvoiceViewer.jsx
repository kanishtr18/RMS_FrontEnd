// src/components/admin/invoice/InvoiceViewer.jsx
"use client"
import * as React from "react"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { IconFileInvoice } from "@tabler/icons-react"

const formatCurrencyINR = (n) => Number(n ?? 0).toLocaleString("en-IN", { style: "currency", currency: "INR" })
const formatDateShort = (iso) => (iso ? new Date(iso).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "-")

function computeTotals(inv = {}) {
  const total = Number(inv.totalAmount ?? 0)
  const tax = Number(inv.taxAmount ?? 0)
  const paid = (inv.payments || []).reduce((s, p) => s + Number(p.amount ?? 0), 0)
  const balance = total + tax - paid
  return { total, tax, paid, balance }
}

export default function InvoiceViewer({ invoice, onEdit }) {
  if (!invoice) return null
  const { total, tax, paid, balance } = computeTotals(invoice)

  const statusVariant = invoice.status === "PAID" ? "default" : invoice.status === "ISSUED" ? "secondary" : invoice.status === "DRAFT" ? "outline" : "destructive"

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="link" className="px-0 text-left">
          <div className="font-medium">{invoice.invoiceNumber}</div>
          <div className="text-xs text-muted-foreground">{invoice.folioId ?? invoice.reservationId}</div>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-w-3xl">
        <DrawerHeader>
          <div className="flex items-start justify-between w-full gap-4">
            <div>
              <DrawerTitle className="text-lg">{invoice.invoiceNumber}</DrawerTitle>
              <DrawerDescription>{invoice.folioId ? `Folio ${invoice.folioId}` : invoice.reservationId ? `Reservation ${invoice.reservationId}` : ""}</DrawerDescription>
              <div className="mt-2 text-sm text-muted-foreground">Issued: {formatDateShort(invoice.issueDate)} • Due: {formatDateShort(invoice.dueDate)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="mt-1">
                <Badge variant={statusVariant}>{invoice.status}</Badge>
              </div>
            </div>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-6">
          <Separator />

          <div className="mt-4">
            <h4 className="flex items-center gap-2 text-sm font-medium">
              <IconFileInvoice className="size-4" /> Payments
            </h4>

            <div className="mt-2 max-h-64 overflow-y-auto divide-y rounded-md border">
              {(invoice.payments || []).length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground">No payments</div>
              ) : (
                (invoice.payments || []).map((p) => (
                  <div key={p.id} className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <div className="font-medium">{p.method}</div>
                      <div className="text-xs text-muted-foreground">{new Date(p.at).toLocaleString()}</div>
                    </div>

                    <div className="text-sm text-muted-foreground">Reference: {p.id}</div>

                    <div className="text-right font-medium">{formatCurrencyINR(p.amount)}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Total amount</Label>
              <div className="mt-2 text-lg font-medium">{formatCurrencyINR(total)}</div>
            </div>

            <div>
              <Label>Tax & Paid</Label>
              <div className="mt-2 text-sm text-muted-foreground">Tax: {formatCurrencyINR(tax)}</div>
              <div className="mt-1 text-lg font-medium">Paid: {formatCurrencyINR(paid)}</div>
              <div className="mt-2 text-sm text-muted-foreground">Balance: {formatCurrencyINR(balance)}</div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex gap-2">
            <Button onClick={() => onEdit(invoice)}>Edit</Button>
            <Button variant="outline" onClick={() => navigator.clipboard?.writeText(invoice.id) ?? null}>Copy ID</Button>
            <Button variant="ghost" onClick={() => alert("Send invoice demo")}>Send Invoice</Button>
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