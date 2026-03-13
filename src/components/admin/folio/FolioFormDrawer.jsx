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
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { IconPlus, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

const formatCurrencyINR = (n) =>
  Number(n ?? 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  })

function computeTotal(invoices = []) {
  return invoices.reduce((sum, i) => sum + Number(i.amount ?? 0), 0)
}

export default function FolioFormDrawer({ openFolio, onSave, onClose }) {
  const isEdit = !!openFolio

  const [folioNumber, setFolioNumber] = React.useState("")
  const [name, setName] = React.useState("")
  const [status, setStatus] = React.useState("OPEN")
  const [invoices, setInvoices] = React.useState([])

  React.useEffect(() => {
    if (openFolio) {
      setFolioNumber(openFolio.folioNumber ?? "")
      setName(openFolio.name ?? "")
      setStatus(openFolio.status ?? "OPEN")
      setInvoices(openFolio.invoices ?? [])
    } else {
      setFolioNumber(`F-${Date.now().toString().slice(-6)}`)
      setName("")
      setStatus("OPEN")
      setInvoices([])
    }
  }, [openFolio])

  function addInvoice() {
    setInvoices((prev) => [
      ...prev,
      {
        id: uuidv4(),
        invoiceNumber: `INV-${Date.now().toString().slice(-4)}`,
        amount: 0,
      },
    ])
  }

  function updateInvoice(id, field, value) {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, [field]: value } : inv
      )
    )
  }

  function removeInvoice(id) {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id))
  }

  function submit() {
    if (!name) return toast.error("Folio name required")
    if (invoices.length === 0) return toast.error("Add at least one invoice")

    const totalAmount = computeTotal(invoices)

    const payload = {
      id: openFolio?.id ?? uuidv4(),
      folioNumber,
      name,
      status,
      totalAmount,
      invoices,
      createdAt: openFolio?.createdAt ?? new Date().toISOString(),
    }

    onSave(payload)
  }

  const total = computeTotal(invoices)

  return (
    <Drawer open={!!openFolio} onOpenChange={onClose}>
      <DrawerContent className="max-w-4xl mx-auto">

        {/* Header */}
        <DrawerHeader>
          <DrawerTitle>
            {isEdit ? "Edit Folio" : "Create Folio"}
          </DrawerTitle>
          <DrawerDescription>
            Manage folio invoices and totals
          </DrawerDescription>
        </DrawerHeader>

        {/* Main Content */}
        <div className="px-6 pb-4 space-y-5">

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="pl-2 pb-1">Folio Number</Label>
              <Input
                value={folioNumber}
                onChange={(e) => setFolioNumber(e.target.value)}
              />
            </div>

            <div>
              <Label className="pl-2 pb-1">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Label className="pl-2 pb-1">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="PARTIAL">Partial</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Invoices */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Invoices</Label>

              <Button size="sm" onClick={addInvoice}>
                <IconPlus className="size-4 mr-2" />
                Add Invoice
              </Button>
            </div>

            {/* Scrollable Invoice Area */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-2">

              {invoices.length === 0 && (
                <div className="text-muted-foreground text-sm">
                  No invoices yet
                </div>
              )}

              {invoices.map((inv) => (
                <Card
                  key={inv.id}
                  className="p-3 grid grid-cols-12 gap-3 items-center"
                >
                  <Input
                    className="col-span-4"
                    value={inv.invoiceNumber}
                    onChange={(e) =>
                      updateInvoice(inv.id, "invoiceNumber", e.target.value)
                    }
                  />

                  <Input
                    className="col-span-5"
                    type="number"
                    value={inv.amount}
                    onChange={(e) =>
                      updateInvoice(
                        inv.id,
                        "amount",
                        Number(e.target.value)
                      )
                    }
                  />

                  <div className="col-span-2 text-sm font-medium">
                    {formatCurrencyINR(inv.amount)}
                  </div>

                  <Button
                    variant="destructive"
                    size="sm"
                    className="col-span-1"
                    onClick={() => removeInvoice(inv.id)}
                  >
                    <IconTrash className="size-4" />
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">
                Total Amount
              </div>
              <div className="text-xl font-semibold">
                {formatCurrencyINR(total)}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={submit}>
                {isEdit ? "Save Changes" : "Create Folio"}
              </Button>

              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
            </div>
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