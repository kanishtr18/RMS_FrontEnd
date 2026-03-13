// src/components/admin/folio/FolioViewer.jsx
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

function computeTotalsFromInvoices(invoices = []) {
  const total = (invoices || []).reduce((s, inv) => s + Number(inv.amount ?? 0), 0)
  const paid = (invoices || []).reduce((s, inv) => s + (inv.payments || []).reduce((ps, p) => ps + Number(p.amount ?? 0), 0), 0)
  const balance = total - paid
  return { total, paid, balance }
}

export default function FolioViewer({ folio, onEdit }) {
  if (!folio) return null
  const { total, paid, balance } = computeTotalsFromInvoices(folio.invoices)

  const statusVariant = folio.status === "PAID" ? "default" : folio.status === "OPEN" ? "secondary" : "destructive"

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="link" className="px-0 text-left">
          <div className="font-medium">{folio.folioNumber}</div>
          <div className="text-xs text-muted-foreground">{folio.name}</div>
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-start justify-between w-full gap-4">
            <div>
              <DrawerTitle className="text-lg">{folio.folioNumber}</DrawerTitle>
              <DrawerDescription>{folio.name}</DrawerDescription>
              <div className="mt-2 text-sm text-muted-foreground">Created: {formatDateShort(folio.createdAt)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="mt-1">
                <Badge variant={statusVariant}>{folio.status}</Badge>
              </div>
            </div>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-6">
          <Separator />

          <div className="mt-4">
            <h4 className="flex items-center gap-2 text-sm font-medium">
              <IconFileInvoice className="size-4" /> Invoices
            </h4>

            <div className="mt-2 divide-y rounded-md border">
              {(folio.invoices || []).map((inv) => (
                <div key={inv.id} className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <div className="font-medium">{inv.invoiceNumber}</div>
                    <div className="text-xs text-muted-foreground">Issued: {formatDateShort(inv.createdAt)}</div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Payments:
                    <div className="mt-1">
                      {(inv.payments || []).length === 0 ? (
                        <div className="text-xs text-muted-foreground">No payments</div>
                      ) : (
                        <ul className="list-disc pl-4 text-sm">
                          {inv.payments.map((p) => (
                            <li key={p.id}>
                              {formatCurrencyINR(p.amount)} — {p.method} • {formatDateShort(p.at)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-medium">{formatCurrencyINR(inv.amount)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Total (invoices)</Label>
              <div className="mt-2 text-lg font-medium">{formatCurrencyINR(total)}</div>
            </div>

            <div>
              <Label>Paid</Label>
              <div className="mt-2 text-lg font-medium">{formatCurrencyINR(paid)}</div>
              <div className="mt-2 text-sm text-muted-foreground">Balance: {formatCurrencyINR(balance)}</div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex gap-2">
            <Button onClick={() => onEdit(folio)}>Edit</Button>
            <Button variant="outline" onClick={() => navigator.clipboard?.writeText(folio.id) ?? null}>
              Copy ID
            </Button>
            <Button variant="ghost" onClick={() => alert("Send folio demo")}>
              Send Folio
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