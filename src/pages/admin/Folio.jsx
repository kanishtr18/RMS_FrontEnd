// app/folio/page.jsx
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

import FolioTable from "@/components/admin/folio/FolioTable"
import FolioViewer from "@/components/admin/folio/FolioViewer"
import FolioFormDrawer from "@/components/admin/folio/FolioFormDrawer"
import { sampleFolios } from "@/components/admin/folio/sampleData"

export default function FolioManagementPage() {
  const [folios, setFolios] = React.useState(() => sampleFolios)
  const [openFolio, setOpenFolio] = React.useState(null) // editing object or { ...obj, _view: true }

  const totalOutstanding = folios.reduce((s, f) => s + (f.totalAmount || 0) - (f.invoices || []).reduce((ps, inv) => ps + (inv.payments || []).reduce((pp, p) => pp + (p.amount || 0), 0), 0), 0)
  const cards = [
    { id: "total-folios", description: "Total Folios", title: String(folios.length), footerMain: <>Folios</>, footerIcon: <IconFileInvoice className="size-4" />, footerSub: "All guest folios" },
    { id: "outstanding", description: "Outstanding", title: (totalOutstanding).toLocaleString("en-IN", { style: "currency", currency: "INR" }), footerMain: <>Outstanding balance</>, footerIcon: <IconCurrencyRupee className="size-4" />, footerSub: "Amount due" },
    { id: "paid-count", description: "Paid", title: String(folios.filter((f) => f.status === "PAID").length), footerMain: <>Paid folios</>, footerIcon: <IconUsers className="size-4" />, footerSub: "Settled" },
  ]

  function handleSaveFolio(payload) {
    setFolios((prev) => {
      const exists = prev.find((p) => p.id === payload.id)
      if (exists) return prev.map((p) => (p.id === payload.id ? { ...payload } : p))
      return [{ ...payload }, ...prev]
    })
    toast.success(openFolio && openFolio.id ? "Folio updated" : "Folio created")
    setOpenFolio(null)
  }

  function handleDeleteFolio(payload) {
    setFolios((prev) => prev.filter((p) => p.id !== payload.id))
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <SiteHeader title="Folio" />

        <div className="flex flex-col gap-6 py-4">
          <SectionCards items={cards} />

          <div className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-3 lg:px-6">
            <div className="lg:col-span-2">
              <AreaAnalyticsChart
                title="Revenue"
                description="Weekly revenue"
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
              <Button onClick={() => setOpenFolio({})} size="sm">
                <IconPlus className="size-4 mr-2" /> New Folio
              </Button>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Folios</CardTitle>
                  <CardDescription>Guest folios and billing actions</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="px-4">
                <FolioTable
                  folios={folios}
                  onEdit={(f) => setOpenFolio(f)}
                  onView={(f) => setOpenFolio({ ...f, _view: true })}
                  onDelete={(f) => handleDeleteFolio(f)}
                />
              </CardContent>

              <CardFooter>
                <div className="text-sm text-muted-foreground">Manage guest billing, payments and folios.</div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Viewer (when openFolio._view is true) */}
      {openFolio && openFolio._view && <FolioViewer folio={openFolio} onEdit={(f) => setOpenFolio(f)} />}

      {/* Form Drawer (create/edit) */}
      {openFolio && !openFolio._view && (
        <FolioFormDrawer
          openFolio={openFolio && Object.keys(openFolio).length ? openFolio : null}
          onSave={handleSaveFolio}
          onClose={() => setOpenFolio(null)}
        />
      )}
    </div>
  )
}