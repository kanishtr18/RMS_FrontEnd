import * as React from "react"
import { SiteHeader } from "@/components/admin/site-header"
import { SectionCards } from "@/components/admin/section-cards"
import { AreaAnalyticsChart } from "@/components/admin/chart-area-interactive"
import { QuickActions } from "@/components/admin/QuickActions"
import { AlertsPanel } from "@/components/admin/alerts-panel"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconCurrencyRupee, IconPlus, IconReceipt } from "@tabler/icons-react"
import { toast } from "sonner"

import PaymentTable from "@/components/admin/payment/PaymentTable"
import PaymentViewer from "@/components/admin/payment/PaymentViewer"
import PaymentFormDrawer from "@/components/admin/payment/PaymentFormDrawer"
import { usePayments } from "@/components/admin/payment/usePayments"
import { samplePayments } from "@/components/admin/payment/sampleData"

export default function PaymentsPage() {
  const { payments, createPayment, updatePayment, deletePayment, addRefund } = usePayments(samplePayments)
  const [openPayment, setOpenPayment] = React.useState(null) // object or { ... , _view: true }

  const totalProcessed = payments.reduce((s, p) => s + Number(p.amount || 0), 0)

  const cards = [
    { id: "total", description: "Total payments", title: String(payments.length), footerMain: <>Payments</>, footerIcon: <IconReceipt className="size-4" />, footerSub: "All payments" },
    { id: "amount", description: "Processed", title: totalProcessed.toLocaleString("en-IN", { style: "currency", currency: "INR" }), footerMain: <>Processed</>, footerIcon: <IconCurrencyRupee className="size-4" />, footerSub: "Total amount" },
    { id: "pending", description: "Pending", title: String(payments.filter(p => p.status === "PENDING").length), footerMain: <>Pending</>, footerIcon: <IconReceipt className="size-4" />, footerSub: "Awaiting processing" },
  ]

  async function handleSavePayment(payload) {
    const exists = payments.find(p => p.id === payload.id)
    if (exists) {
      await updatePayment(payload)
      toast.success("Payment updated")
    } else {
      await createPayment(payload)
      toast.success("Payment created")
    }
    setOpenPayment(null)
  }

  async function handleDeletePayment(p) {
    await deletePayment(p.id)
    toast.success("Payment deleted")
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <SiteHeader title="Payments" />

        <div className="flex flex-col gap-6 py-4">
          <SectionCards items={cards} />

          <div className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-3 lg:px-6">
            <div className="lg:col-span-2">
              <AreaAnalyticsChart
                title="Payments"
                description="Weekly payments processed"
                data={[
                  { date: "2025-01-01", amount: 120000 },
                  { date: "2025-01-08", amount: 98000 },
                  { date: "2025-01-15", amount: 134000 },
                  { date: "2025-01-22", amount: 150000 },
                  { date: "2025-01-29", amount: 123000 },
                  { date: "2025-02-05", amount: 160000 },
                ]}
                config={{ amount: { label: "Amount", color: "var(--color-chart-2)" } }}
                dateKey="date"
              />
            </div>

            <AlertsPanel />
          </div>

          <div className="px-4 lg:px-6 flex items-center justify-between gap-4">
            <QuickActions />
            <div>
              <Button onClick={() => setOpenPayment({})} size="sm"><IconPlus className="size-4 mr-2" /> New Payment</Button>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Payments</CardTitle>
                  <CardDescription>Manage all payments and refunds</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <PaymentTable
                  payments={payments}
                  onEdit={(p) => setOpenPayment(p)}
                  onView={(p) => setOpenPayment({ ...p, _view: true })}
                  onDelete={(p) => handleDeletePayment(p)}
                />
              </CardContent>

              <CardFooter>
                <div className="text-sm text-muted-foreground">Financial record chain: Folio → Invoice → Payment → Refund</div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Viewer */}
      {openPayment && openPayment._view && <PaymentViewer payment={openPayment} onEdit={(p) => setOpenPayment(p)} />}

      {/* Form */}
      {openPayment && !openPayment._view && (
        <PaymentFormDrawer
          openPayment={openPayment && Object.keys(openPayment).length ? openPayment : null}
          onSave={handleSavePayment}
          onClose={() => setOpenPayment(null)}
        />
      )}
    </div>
  )
}