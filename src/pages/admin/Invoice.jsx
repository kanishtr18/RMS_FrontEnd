// app/invoice/page.jsx
"use client"

import * as React from "react"
import { SiteHeader } from "@/components/admin/site-header"
import { SectionCards } from "@/components/admin/section-cards"
import { AreaAnalyticsChart } from "@/components/admin/chart-area-interactive"
import { QuickActions } from "@/components/admin/QuickActions"
import { AlertsPanel } from "@/components/admin/alerts-panel"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconFileInvoice, IconCurrencyRupee, IconUsers, IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"

import InvoiceTable from "@/components/admin/invoice/InvoiceTable"
import InvoiceViewer from "@/components/admin/invoice/InvoiceViewer"
import InvoiceFormDrawer from "@/components/admin/invoice/InvoiceFormDrawer"
import { sampleInvoices } from "@/components/admin/invoice/sampleData"

export default function InvoicePage() {
  const [invoices, setInvoices] = React.useState(() => sampleInvoices)
  const [openInvoice, setOpenInvoice] = React.useState(null) // object or { ... , _view: true }

  const totalOutstanding = invoices.reduce((s, inv) => {
    const paid = (inv.payments || []).reduce((ps, p) => ps + Number(p.amount || 0), 0)
    return s + (Number(inv.totalAmount || 0) + Number(inv.taxAmount || 0) - paid)
  }, 0)

  const cards = [
    { id: "total-invoices", description: "Total Invoices", title: String(invoices.length), footerMain: <>Invoices</>, footerIcon: <IconFileInvoice className="size-4" />, footerSub: "All invoices" },
    { id: "outstanding", description: "Outstanding", title: totalOutstanding.toLocaleString("en-IN", { style: "currency", currency: "INR" }), footerMain: <>Outstanding</>, footerIcon: <IconCurrencyRupee className="size-4" />, footerSub: "Amount due" },
    { id: "paid-count", description: "Paid", title: String(invoices.filter(i => i.status === "PAID").length), footerMain: <>Paid</>, footerIcon: <IconUsers className="size-4" />, footerSub: "Settled" },
  ]

  function handleSaveInvoice(payload) {
    setInvoices(prev => {
      const exists = prev.find(p => p.id === payload.id)
      if (exists) return prev.map(p => p.id === payload.id ? payload : p)
      return [payload, ...prev]
    })
    toast.success(openInvoice && openInvoice.id ? "Invoice updated" : "Invoice created")
    setOpenInvoice(null)
  }

  function handleDeleteInvoice(payload) {
    setInvoices(prev => prev.filter(p => p.id !== payload.id))
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <SiteHeader title="Invoices" />

        <div className="flex flex-col gap-6 py-4">
          <SectionCards items={cards} />

          <div className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-3 lg:px-6">
            <div className="lg:col-span-2">
              <AreaAnalyticsChart
                title="Invoice Revenue"
                description="Weekly invoiced amount"
                data={[
                  { date: "2025-01-01", revenue: 120000 },
                  { date: "2025-01-08", revenue: 98000 },
                  { date: "2025-01-15", revenue: 134000 },
                  { date: "2025-01-22", revenue: 150000 },
                  { date: "2025-01-29", revenue: 123000 },
                  { date: "2025-02-05", revenue: 160000 },
                ]}
                config={{ revenue: { label: "Revenue", color: "var(--color-chart-2)" } }}
                dateKey="date"
              />
            </div>

            <AlertsPanel />
          </div>

          <div className="px-4 lg:px-6 flex items-center justify-between gap-4">
            <QuickActions />
            <div>
              <Button onClick={() => setOpenInvoice({})} size="sm"><IconPlus className="size-4 mr-2" /> New Invoice</Button>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Manage invoices & payments</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="px-3">
                <InvoiceTable
                  invoices={invoices}
                  onEdit={(i) => setOpenInvoice(i)}
                  onView={(i) => setOpenInvoice({ ...i, _view: true })}
                  onDelete={(i) => handleDeleteInvoice(i)}
                />
              </CardContent>

              <CardFooter>
                <div className="text-sm text-muted-foreground">Financial record chain: Folio → Invoice → Payment → Refund</div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {openInvoice && openInvoice._view && <InvoiceViewer invoice={openInvoice} onEdit={(i) => setOpenInvoice(i)} />}

      {openInvoice && !openInvoice._view && <InvoiceFormDrawer openInvoice={openInvoice && Object.keys(openInvoice).length ? openInvoice : null} onSave={handleSaveInvoice} onClose={() => setOpenInvoice(null)} />}
    </div>
  )
}