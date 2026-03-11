import * as React from "react";
import {
  IconTrendingDown,
  IconTrendingUp,
  IconUsers,
  IconCalendarEvent,
  IconBuildingSkyscraper,
  IconReceipt,
  IconEye,
  IconCash,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type SectionCardItem = {
  id: string | number;
  description: string; // shown as CardDescription
  title: React.ReactNode; // CardTitle (supports numbers / nodes)
  badgeText?: React.ReactNode; // badge content (e.g. "+9.2%")
  badgeIcon?: React.ReactNode; // icon inside badge
  badgeVariant?: "outline" | "destructive" | "default" | "secondary";
  footerMain: React.ReactNode; // main footer text (with inline icon allowed)
  footerIcon?: React.ReactNode; // small icon shown next to main text
  footerSub?: string; // small sub text under main footer
  className?: string; // optional override for the Card wrapper
};

/**
 * SectionCards
 * Reusable: accepts `items` (array of SectionCardItem). If no items passed,
 * the component falls back to the original default set (keeps UI identical).
 */
export function SectionCards({ items }: { items?: SectionCardItem[] }) {
  const defaultItems: SectionCardItem[] = [
    {
      id: "page-views",
      description: "Page Views",
      title: "124,530",
      badgeText: "+9.2%",
      badgeIcon: <IconTrendingUp className="size-4" />,
      badgeVariant: "outline",
      footerMain: <>Increased visibility</>,
      footerIcon: <IconEye className="size-4" />,
      footerSub: "Compared to yesterday",
    },
    {
      id: "revenue-today",
      description: "Revenue Today",
      title: "₹1,24,500",
      badgeText: "+14%",
      badgeIcon: <IconTrendingUp className="size-4" />,
      badgeVariant: "default",
      footerMain: <>Strong daily sales</>,
      footerIcon: <IconCash className="size-4" />,
      footerSub: "Includes rooms & F&B",
    },
    {
      id: "active-reservations",
      description: "Active Reservations",
      title: "86",
      badgeText: "+6%",
      badgeIcon: <IconTrendingUp className="size-4" />,
      badgeVariant: "outline",
      footerMain: <>High booking activity</>,
      footerIcon: <IconCalendarEvent className="size-4" />,
      footerSub: "Currently checked-in",
    },
    {
      id: "occupancy",
      description: "Occupancy Rate",
      title: "78%",
      badgeText: "+4%",
      badgeIcon: <IconTrendingUp className="size-4" />,
      badgeVariant: "outline",
      footerMain: <>Rooms filling fast</>,
      footerIcon: <IconBuildingSkyscraper className="size-4" />,
      footerSub: "Out of total inventory",
    },
    {
      id: "pending-invoices",
      description: "Pending Invoices",
      title: "14",
      badgeText: "Action",
      badgeIcon: <IconTrendingDown className="size-4" />,
      badgeVariant: "destructive",
      footerMain: <>Requires follow-up</>,
      footerIcon: <IconReceipt className="size-4" />,
      footerSub: "Payments overdue",
    },
    {
      id: "total-customers",
      description: "Total Customers Signed In",
      title: "1,284",
      badgeText: "+11%",
      badgeIcon: <IconTrendingUp className="size-4" />,
      badgeVariant: "outline",
      footerMain: <>Growing guest base</>,
      footerIcon: <IconUsers className="size-4" />,
      footerSub: "All-time count",
    },
    {
      id: "adr",
      description: "Average Daily Rate (ADR)",
      title: "₹6,850",
      badgeText: "+5%",
      badgeIcon: <IconTrendingUp className="size-4" />,
      badgeVariant: "outline",
      footerMain: <>Improved pricing efficiency</>,
      footerSub: "Revenue per room",
    },
    {
      id: "cancellation-rate",
      description: "Cancellation Rate",
      title: "3.2%",
      badgeText: "-1.1%",
      badgeIcon: <IconTrendingDown className="size-4" />,
      badgeVariant: "outline",
      footerMain: <>Better booking stability</>,
      footerSub: "Compared to last month",
    },
  ];

  const renderItems = items && items.length ? items : defaultItems;

  return (
    <div
      className="
      *:data-[slot=card]:from-primary/5
      *:data-[slot=card]:to-card
      dark:*:data-[slot=card]:bg-card
      grid grid-cols-1 gap-4 px-2
      *:data-[slot=card]:bg-linear-to-t
      *:data-[slot=card]:shadow-xs
      lg:px-6
      @xl/main:grid-cols-2
      @5xl/main:grid-cols-4
    "
    >
      {renderItems.map((it) => (
        <Card key={it.id} className={`@container/card py-2.5 ${it.className ?? ""}`}>
          <CardHeader>
            <CardDescription>{it.description}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {it.title}
            </CardTitle>
            <CardAction>
              <Badge variant={it.badgeVariant as any}>
                {it.badgeIcon}
                {it.badgeText}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex gap-2 font-medium">
              {it.footerMain} {it.footerIcon}
            </div>
            <div className="text-muted-foreground">{it.footerSub}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default SectionCards;