import { SectionCards } from "@/components/admin/section-cards";
import { AreaAnalyticsChart } from "@/components/admin/chart-area-interactive"
import { AlertsPanel } from "@/components/admin/alerts-panel"
import { QuickActions } from "@/components/admin/QuickActions"
import { SiteHeader } from "@/components/admin/site-header"
import RecentReservationsTable  from "@/components/admin/RecentReservationsTable"

import data from "./data.json"

export default function Dashboard() {
  const chartData = [ { date: "2024-04-01", rooms: 82000, fnb: 24000 }, { date: "2024-04-05", rooms: 96000, fnb: 31000 }, { date: "2024-04-10", rooms: 88000, fnb: 27000 }, { date: "2024-04-15", rooms: 112000, fnb: 42000 }, { date: "2024-04-20", rooms: 105000, fnb: 39000 }, { date: "2024-04-25", rooms: 124000, fnb: 47000 }, { date: "2024-04-30", rooms: 118000, fnb: 44000 }, { date: "2024-05-05", rooms: 132000, fnb: 52000 }, { date: "2024-05-10", rooms: 125000, fnb: 48000 }, { date: "2024-05-15", rooms: 140000, fnb: 61000 }, { date: "2024-05-20", rooms: 136000, fnb: 58000 }, { date: "2024-05-25", rooms: 148000, fnb: 67000 }, { date: "2024-05-30", rooms: 155000, fnb: 72000 }, { date: "2024-06-05", rooms: 168000, fnb: 76000 }, { date: "2024-06-10", rooms: 162000, fnb: 73000 }, { date: "2024-06-15", rooms: 175000, fnb: 82000 }, { date: "2024-06-20", rooms: 171000, fnb: 79000 }, { date: "2024-06-25", rooms: 184000, fnb: 86000 }, { date: "2024-06-30", rooms: 192000, fnb: 91000 }, ]
  const config = {
    rooms: {
      label: "Room Revenue",
      color: "var(--color-chart-2)",
    },
    fnb: {
      label: "F&B Revenue",
      color: "var(--color-chart-1)",
    },
  }

  
  return (
        <div className="flex flex-1 flex-col">
            
          <div className="@container/main flex flex-1 flex-col gap-2">
            <SiteHeader />
            <div className="flex flex-col gap-6 py-4">

              <div className="px-4 lg:px-6">
                <QuickActions />
              </div>

              <SectionCards />

              <div className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-3 lg:px-6">
                {/* Chart gets more visual weight */}
                <div className="lg:col-span-2">
                  <AreaAnalyticsChart title="Monthly Sales Overview" data={chartData} description="Rooms & F&B revenue performance" config={config}/>
                </div>

                {/* Critical alerts */}
                <AlertsPanel />
              </div>

                <div className="px-4 lg:px-6">
                  <RecentReservationsTable data={data} />
                </div>

            </div>
          </div>
        </div>
  )
}