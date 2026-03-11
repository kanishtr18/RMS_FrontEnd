// app/employees/page.jsx
"use client"

import { SiteHeader } from "@/components/admin/site-header"
import { SectionCards } from "@/components/admin/section-cards"
import { AreaAnalyticsChart } from "@/components/admin/chart-area-interactive"
import { QuickActions } from "@/components/admin/QuickActions"
import { AlertsPanel } from "@/components/admin/alerts-panel"
import EmployeeListTable from "@/components/admin/EmployeeListTable"

import {
  IconUsers,
  IconCalendarEvent,
  IconUserCheck,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react"

// ---------- Sample employee data shaped like your JPA entities ----------
const sampleEmployees = [
  {
    id: "1",
    firstName: "Asha",
    lastName: "Rao",
    email: "asha.rao@resort.com",
    phone: "+91 98765 11111",
    credentialsHash: "••••••",
    hireDate: "2022-08-15",
    status: "ACTIVE",
    roles: [
      { id: "r1", role: { id: "role1", name: "Front Desk", description: "Reception and check-in" }, assignedDate: "2022-08-15", endDate: null },
    ],
    shiftSchedules: [
      { id: "s1", startTime: "2026-03-09T09:00:00.000Z", endTime: "2026-03-09T17:00:00.000Z", position: "Receptionist", location: "Main Lobby" },
    ],
  },
  {
    id: "2",
    firstName: "Vikram",
    lastName: "Shah",
    email: "vikram.shah@resort.com",
    phone: "+91 91234 22222",
    credentialsHash: "••••••",
    hireDate: "2023-02-01",
    status: "ON_LEAVE",
    roles: [
      { id: "r2", role: { id: "role2", name: "Housekeeping", description: "Rooms & cleaning" }, assignedDate: "2023-02-01", endDate: null },
    ],
    shiftSchedules: [],
  },
  {
    id: "3",
    firstName: "Meera",
    lastName: "Iyer",
    email: "meera.iyer@resort.com",
    phone: null,
    credentialsHash: "••••••",
    hireDate: "2020-11-10",
    status: "INACTIVE",
    roles: [
      { id: "r3", role: { id: "role3", name: "F&B Lead", description: "Food and beverage" }, assignedDate: "2021-01-01", endDate: null },
    ],
    shiftSchedules: [
      { id: "s2", startTime: "2026-03-10T07:00:00.000Z", endTime: "2026-03-10T15:00:00.000Z", position: "F&B Lead", location: "Kitchen" },
    ],
  },
  {
    id: "4",
    firstName: "Ramesh",
    lastName: "Kumar",
    email: "ramesh.kumar@resort.com",
    phone: "+91 90000 33333",
    credentialsHash: "••••••",
    hireDate: "2019-06-01",
    status: "TERMINATED",
    roles: [],
    shiftSchedules: [],
  },
]

// ---------- small chart (employees added / headcount trend) ----------
const chartData = [
  { date: "2024-10-01", hires: 2, departures: 1 },
  { date: "2024-12-01", hires: 1, departures: 0 },
  { date: "2025-02-01", hires: 3, departures: 1 },
  { date: "2025-04-01", hires: 1, departures: 2 },
]

const config = {
  hires: { label: "Hires", color: "var(--color-chart-2)" },
  departures: { label: "Departures", color: "var(--color-chart-1)" },
}

// KPI cards tailored for employees
const employeeCards = [
  {
    id: "total-employees",
    description: "Total Employees",
    title: "42",
    badgeText: "+2.4%",
    badgeIcon: <IconUsers className="size-4" />,
    badgeVariant: "outline",
    footerMain: <>Current headcount</>,
    footerSub: "Active staff",
  },
  {
    id: "on-leave",
    description: "On Leave",
    title: "3",
    badgeText: "Today",
    badgeIcon: <IconCalendarEvent className="size-4" />,
    badgeVariant: "secondary",
    footerMain: <>Planned leaves</>,
    footerSub: "Short-term absence",
  },
  {
    id: "active-staff",
    description: "Available Today",
    title: "37",
    badgeText: "+1",
    badgeIcon: <IconUserCheck className="size-4" />,
    badgeVariant: "default",
    footerMain: <>Staff present</>,
    footerSub: "Shift check-ins",
  },
  {
    id: "turnover",
    description: "Turnover (monthly)",
    title: "1.8%",
    badgeText: "-0.2%",
    badgeIcon: <IconTrendingDown className="size-4" />,
    badgeVariant: "outline",
    footerMain: <>Stability metric</>,
    footerSub: "Lower is better",
  },
]

export default function EmployeeManagement() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <SiteHeader title="Employees" />

        <div className="flex flex-col gap-6 py-4">
          {/* Quick actions */}
          <div className="px-4 lg:px-6">
            <QuickActions />
          </div>
          
          {/* KPI cards */}
          <SectionCards items={employeeCards} />

          {/* Chart + alerts */}
          <div className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-3 lg:px-6">
            <div className="lg:col-span-2">
              <AreaAnalyticsChart
                title="Headcount Trend"
                description="Hires vs departures over time"
                data={chartData}
                config={config}
                dateKey="date"
              />
            </div>

            <AlertsPanel />
          </div>

          {/* Employee table */}
          <div className="px-4 lg:px-6">
            <EmployeeListTable data={sampleEmployees} />
          </div>
        </div>
      </div>
    </div>
  )
}