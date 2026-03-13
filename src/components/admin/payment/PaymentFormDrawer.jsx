// src/components/admin/payment/PaymentFormDrawer.jsx
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
import { toast } from "sonner"
import { PAYMENT_METHOD, PAYMENT_STATUS } from "./sampleData"
import { v4 as uuidv4 } from "uuid"

const formatCurrencyINR = (n) => Number(n ?? 0).toLocaleString("en-IN", { style: "currency", currency: "INR" })

export default function PaymentFormDrawer({ openPayment, onSave, onClose }) {
  const isEdit = !!openPayment
  const [amount, setAmount] = React.useState(0)
  const [paymentMethod, setPaymentMethod] = React.useState("CARD")
  const [transactionRef, setTransactionRef] = React.useState("")
  const [currency, setCurrency] = React.useState("INR")
  const [status, setStatus] = React.useState("PENDING")
  const [providerResponse, setProviderResponse] = React.useState("")
  const [processedAt, setProcessedAt] = React.useState("")

  React.useEffect(() => {
    if (openPayment) {
      setAmount(openPayment.amount ?? 0)
      setPaymentMethod(openPayment.paymentMethod ?? "CARD")
      setTransactionRef(openPayment.transactionRef ?? "")
      setCurrency(openPayment.currency ?? "INR")
      setStatus(openPayment.status ?? "PENDING")
      setProviderResponse(openPayment.providerResponse ?? "")
      setProcessedAt(openPayment.processedAt ? new Date(openPayment.processedAt).toISOString().slice(0, 16) : "")
    } else {
      setAmount(0)
      setPaymentMethod("CARD")
      setTransactionRef(`TXN-${Date.now().toString().slice(-6)}`)
      setCurrency("INR")
      setStatus("PENDING")
      setProviderResponse("")
      setProcessedAt("")
    }
  }, [openPayment])

  function submit() {
    if (!amount || amount <= 0) return toast.error("Amount must be greater than 0")
    if (!paymentMethod) return toast.error("Payment method required")

    const payload = {
      id: openPayment?.id ?? uuidv4(),
      amount: Number(amount),
      paymentMethod,
      transactionRef,
      currency,
      status,
      providerResponse: providerResponse || null,
      processedAt: processedAt ? new Date(processedAt).toISOString() : null,
      invoiceId: openPayment?.invoiceId ?? null,
      version: openPayment?.version ?? 1,
      createdAt: openPayment?.createdAt ?? new Date().toISOString(),
      refunds: openPayment?.refunds ?? [],
    }

    onSave(payload)
  }

  return (
    <Drawer open={!!openPayment} onOpenChange={onClose}>
      <DrawerContent className="max-w-xl mx-auto">
        <DrawerHeader>
          <DrawerTitle>{isEdit ? "Edit Payment" : "Create Payment"}</DrawerTitle>
          <DrawerDescription>{isEdit ? `Editing ${openPayment?.transactionRef ?? openPayment?.id}` : "Record a new payment"}</DrawerDescription>
        </DrawerHeader>

        <div className="px-6 pb-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label>Amount</Label>
              <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            </div>

            <div>
              <Label>Method</Label>
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v)}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">Cash</SelectItem>
                  <SelectItem value="CARD">Card</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="WALLET">Wallet</SelectItem>
                  <SelectItem value="BANK_TRANSFER">Bank transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Currency</Label>
              <Input value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Transaction reference</Label>
              <Input value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} />
            </div>

            <div>
              <Label>Processed at</Label>
              <Input type="datetime-local" value={processedAt} onChange={(e) => setProcessedAt(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Provider response (optional)</Label>
            <Input value={providerResponse} onChange={(e) => setProviderResponse(e.target.value)} />
            <div className="text-xs text-muted-foreground mt-1">You can paste a JSON response or plain text.</div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Preview</div>
              <div className="text-lg font-medium">{formatCurrencyINR(amount)} • {paymentMethod}</div>
            </div>

            <div className="flex gap-2">
              <Button onClick={submit}>{isEdit ? "Save payment" : "Create payment"}</Button>
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