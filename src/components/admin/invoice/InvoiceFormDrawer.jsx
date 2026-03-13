// src/components/admin/invoice/InvoiceFormDrawer.jsx
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
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { v4 as uuidv4 } from "uuid"

const formatCurrencyINR = (n) => Number(n ?? 0).toLocaleString("en-IN", { style: "currency", currency: "INR" })

function computeTotal(invoice = {}) {
  const total = Number(invoice.totalAmount ?? 0)
  const tax = Number(invoice.taxAmount ?? 0)
  return { total, tax, grand: total + tax }
}

export default function InvoiceFormDrawer({ openInvoice, onSave, onClose }) {
  const isEdit = !!openInvoice
  const [invoiceNumber, setInvoiceNumber] = React.useState("")
  const [issueDate, setIssueDate] = React.useState("")
  const [dueDate, setDueDate] = React.useState("")
  const [totalAmount, setTotalAmount] = React.useState(0)
  const [taxAmount, setTaxAmount] = React.useState(0)
  const [status, setStatus] = React.useState("DRAFT")
  const [currency, setCurrency] = React.useState("INR")
  const [version, setVersion] = React.useState(1)
  const [payments, setPayments] = React.useState([])

  React.useEffect(() => {
    if (openInvoice) {
      setInvoiceNumber(openInvoice.invoiceNumber ?? `INV-${Date.now().toString().slice(-6)}`)
      setIssueDate(openInvoice.issueDate ? new Date(openInvoice.issueDate).toISOString().slice(0, 10) : "")
      setDueDate(openInvoice.dueDate ? new Date(openInvoice.dueDate).toISOString().slice(0, 10) : "")
      setTotalAmount(openInvoice.totalAmount ?? 0)
      setTaxAmount(openInvoice.taxAmount ?? 0)
      setStatus(openInvoice.status ?? "DRAFT")
      setCurrency(openInvoice.currency ?? "INR")
      setVersion(openInvoice.version ?? 1)
      setPayments((openInvoice.payments || []).map((p) => ({ ...p })))
    } else {
      setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`)
      setIssueDate(new Date().toISOString().slice(0, 10))
      setDueDate("")
      setTotalAmount(0)
      setTaxAmount(0)
      setStatus("DRAFT")
      setCurrency("INR")
      setVersion(1)
      setPayments([])
    }
  }, [openInvoice])

  function addPayment() {
    setPayments((prev) => [...prev, { id: uuidv4(), amount: 0, method: "CASH", at: new Date().toISOString() }])
  }

  function updatePayment(id, field, value) {
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  function removePayment(id) {
    setPayments((prev) => prev.filter((p) => p.id !== id))
  }

  function submit() {
    if (!invoiceNumber) return toast.error("Invoice number required")
    if (!issueDate) return toast.error("Issue date required")

    const payload = {
      id: openInvoice?.id ?? uuidv4(),
      invoiceNumber,
      issueDate: new Date(issueDate).toISOString(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      totalAmount: Number(totalAmount ?? 0),
      taxAmount: Number(taxAmount ?? 0),
      status,
      currency,
      version,
      folioId: openInvoice?.folioId ?? null,
      reservationId: openInvoice?.reservationId ?? null,
      payments,
      createdAt: openInvoice?.createdAt ?? new Date().toISOString(),
    }

    onSave(payload)
  }

  const totals = {
    total: Number(totalAmount || 0),
    tax: Number(taxAmount || 0),
    grand: Number(totalAmount || 0) + Number(taxAmount || 0),
    paid: (payments || []).reduce((s, p) => s + Number(p.amount || 0), 0),
    balance: Number(totalAmount || 0) + Number(taxAmount || 0) - (payments || []).reduce((s, p) => s + Number(p.amount || 0), 0),
  }

  return (
    <Drawer open={!!openInvoice} onOpenChange={onClose}>
      <DrawerContent className="max-w-4xl mx-auto">

        <DrawerHeader>
          <DrawerTitle>{isEdit ? "Edit Invoice" : "Create Invoice"}</DrawerTitle>
          <DrawerDescription>{isEdit ? `Editing ${openInvoice.invoiceNumber}` : "Create a new invoice"}</DrawerDescription>
        </DrawerHeader>

        <div className="px-5 pb-2 space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            <div>
              <Label className="pl-2 pb-1">Invoice #</Label>
              <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
            </div>

            <div>
              <Label className="pl-2 pb-1">Issue date</Label>
              <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
            </div>

            <div>
              <Label className="pl-2 pb-1">Due date</Label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            
            <div>
              <Label className="pl-2 pb-1">Total amount</Label>
              <Input type="number" value={totalAmount} onChange={(e) => setTotalAmount(Number(e.target.value))} />
            </div>

            <div>
              <Label className="pl-2 pb-1">Tax amount</Label>
              <Input type="number" value={taxAmount} onChange={(e) => setTaxAmount(Number(e.target.value))} />
            </div>

            <div>
              <Label className="pl-2 pb-1">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ISSUED">Issued</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Payments area (scrollable when many payments) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Payments</Label>
              <Button size="sm" onClick={addPayment}><IconPlus className="size-4 mr-2" /> Add payment</Button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1 p-1">
              {payments.length === 0 && <div className="text-muted-foreground text-sm">No payments yet</div>}

              {payments.map((p) => (
                <Card key={p.id} className="p-3 grid grid-cols-12 gap-2 items-center">
                  <Input className="col-span-5" value={p.method} onChange={(e) => updatePayment(p.id, "method", e.target.value)} />
                  <Input className="col-span-4" type="number" value={p.amount} onChange={(e) => updatePayment(p.id, "amount", Number(e.target.value))} />
                  <Input className="col-span-2" type="datetime-local" value={p.at ? new Date(p.at).toISOString().slice(0, 16) : ""} onChange={(e) => updatePayment(p.id, "at", new Date(e.target.value).toISOString())} />
                  <Button size="sm" variant="destructive" className="col-span-1" onClick={() => removePayment(p.id)}><IconTrash className="size-4" /></Button>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Sticky-ish totals row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Grand total</div>
              <div className="text-xl font-semibold">{formatCurrencyINR(totals.grand)}</div>
              <div className="text-xs text-muted-foreground">Paid: {formatCurrencyINR(totals.paid)} • Balance: {formatCurrencyINR(totals.balance)}</div>
            </div>

            <div className="flex gap-2">
              <Button onClick={submit}>{isEdit ? "Save Invoice" : "Create Invoice"}</Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </div>
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild><Button variant="outline">Close</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}