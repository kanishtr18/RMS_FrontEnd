// src/components/admin/payment/PaymentViewer.jsx
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
import { IconCurrencyRupee, IconExternalLink } from "@tabler/icons-react"

const formatCurrencyINR = (n) => Number(n ?? 0).toLocaleString("en-IN", { style: "currency", currency: "INR" })
const formatDateTime = (iso) => (iso ? new Date(iso).toLocaleString("en-IN") : "-")

export default function PaymentViewer({ payment, onEdit, onRefund }) {
  if (!payment) return null

  const statusVariant = payment.status === "COMPLETED" ? "default" : payment.status === "PENDING" ? "secondary" : "destructive"

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="link" className="px-0 text-left">
          <div className="font-medium">{payment.transactionRef ?? payment.id}</div>
          <div className="text-xs text-muted-foreground">{payment.paymentMethod} • {formatCurrencyINR(payment.amount)}</div>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-w-2xl">
        <DrawerHeader>
          <div className="flex items-start justify-between gap-4 w-full">
            <div>
              <DrawerTitle className="text-lg">{payment.transactionRef ?? payment.id}</DrawerTitle>
              <DrawerDescription>{payment.invoiceId ? `Invoice ${payment.invoiceId}` : ""}</DrawerDescription>
              <div className="mt-2 text-sm text-muted-foreground">Processed: {formatDateTime(payment.processedAt)}</div>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="mt-1">
                <Badge variant={statusVariant}>{payment.status}</Badge>
              </div>
            </div>
          </div>
        </DrawerHeader>

        <div className="px-4 pb-6">
          <Separator />

          <div className="mt-4 grid grid-cols-1 gap-3">
            <div>
              <Label>Amount</Label>
              <div className="text-lg font-medium">{formatCurrencyINR(payment.amount)}</div>
            </div>

            <div>
              <Label>Method</Label>
              <div className="text-sm">{payment.paymentMethod}</div>
            </div>

            <div>
              <Label>Transaction reference</Label>
              <div className="text-sm">{payment.transactionRef ?? "-"}</div>
            </div>

            <div>
              <Label>Provider response</Label>
              <div className="mt-2 max-h-40 overflow-auto rounded-md border p-2 text-xs">
                {payment.providerResponse ? (
                  <pre className="whitespace-pre-wrap break-words text-xs">{String(payment.providerResponse)}</pre>
                ) : (
                  <div className="text-muted-foreground">No provider response recorded</div>
                )}
              </div>
            </div>

            <div>
              <Label>Refunds</Label>
              <div className="mt-2 max-h-48 overflow-y-auto divide-y rounded-md border">
                {(payment.refunds || []).length === 0 ? (
                  <div className="p-3 text-sm text-muted-foreground">No refunds</div>
                ) : (
                  (payment.refunds || []).map((r) => (
                    <div key={r.id} className="p-3 grid grid-cols-3 gap-2">
                      <div>
                        <div className="font-medium">{formatCurrencyINR(r.amount)}</div>
                        <div className="text-xs text-muted-foreground">{r.reason ?? "-"}</div>
                      </div>

                      <div className="text-sm text-muted-foreground">Refunded: {new Date(r.createdAt).toLocaleString()}</div>

                      <div className="text-right">
                        {/* optional refund actions */}
                        <Button size="sm" variant="ghost" onClick={() => navigator.clipboard?.writeText(r.id)}>Copy ID</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex gap-2">
            <Button onClick={() => onEdit(payment)}>Edit</Button>
            <Button variant="outline" onClick={() => navigator.clipboard?.writeText(payment.id)}><IconExternalLink className="size-4 mr-2" />Copy ID</Button>
            <Button variant="ghost" onClick={() => alert("Download receipt demo")}>Download receipt</Button>
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild><Button variant="outline">Close</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}