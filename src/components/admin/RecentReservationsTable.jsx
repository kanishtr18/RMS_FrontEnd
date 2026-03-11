// components/RecentReservationsTable.tsx
"use client";

import { z } from "zod";
import { IconGripVertical, IconDotsVertical, IconCurrencyRupee, IconChevronDown, IconPlus, IconLayoutColumns, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react";
import  DataTable from "./data-table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns"; // optional: if you have date-fns, otherwise Date.toLocaleString() used

// reservation schema (keeps same as your original)
export const reservationSchema = z.object({
  id: z.number(),
  guestName: z.string(),
  contact: z.string().optional(),
  room: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  nights: z.number(),
  amount: z.number(),
  currency: z.string().optional().default("INR"),
  paymentStatus: z.enum(["Paid", "Pending", "Failed"]),
  reservationStatus: z.enum(["Confirmed", "Checked-In", "Checked-Out", "Cancelled"]),
  source: z.string().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
  totalAmount: z.number().optional(),
});

const formatCurrency = (value) =>
  Number(value ?? 0).toLocaleString("en-IN", { style: "currency", currency: "INR" });

// small chart used inside drawer (keeps same sample data)
const drawerChartData = [
  { month: "Jan", rooms: 120000, fnb: 42000 },
  { month: "Feb", rooms: 135000, fnb: 50000 },
  { month: "Mar", rooms: 148000, fnb: 59000 },
  { month: "Apr", rooms: 160000, fnb: 62000 },
  { month: "May", rooms: 170000, fnb: 70000 },
  { month: "Jun", rooms: 190000, fnb: 82000 },
];
const drawerChartConfig = {
  rooms: { label: "Rooms", color: "var(--color-chart-2)" },
  fnb: { label: "F&B", color: "var(--color-chart-1)" },
};

// Reservation Drawer viewer (keeps exact UI)
function ReservationViewer({ item }) {
  const isMobile = useIsMobile();
  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.guestName}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-start justify-between gap-4 w-full">
            <div>
              <DrawerTitle className="text-lg">{item.guestName}</DrawerTitle>
              <DrawerDescription>{item.room} • {item.nights} night(s)</DrawerDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="font-semibold text-lg flex items-center gap-1">
                <IconCurrencyRupee className="size-4" />
                {formatCurrency(item.amount)}
              </div>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={drawerChartConfig}>
                <AreaChart data={drawerChartData} margin={{ left: 0, right: 10 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Area dataKey="fnb" type="natural" fill="var(--color-chart-1)" stroke="var(--color-chart-1)" fillOpacity={0.15} />
                  <Area dataKey="rooms" type="natural" fill="var(--color-chart-2)" stroke="var(--color-chart-2)" fillOpacity={0.12} />
                </AreaChart>
              </ChartContainer>
              <Separator />
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Check-in</Label>
              <div>{new Date(item.checkIn).toLocaleString()}</div>
            </div>
            <div>
              <Label>Check-out</Label>
              <div>{new Date(item.checkOut).toLocaleString()}</div>
            </div>
            <div>
              <Label>Payment</Label>
              <div className="flex items-center gap-2">
                <Badge variant={item.paymentStatus === "Paid" ? "default" : item.paymentStatus === "Pending" ? "secondary" : "destructive"}>
                  {item.paymentStatus}
                </Badge>
                <div className="text-xs text-muted-foreground">{item.paymentMethod ?? "—"}</div>
              </div>
            </div>
            <div>
              <Label>Booking source</Label>
              <div>{item.source ?? "Website"}</div>
            </div>
          </div>

          {item.notes && (
            <>
              <Separator />
              <div>
                <Label>Notes</Label>
                <div className="text-sm text-muted-foreground">{item.notes}</div>
              </div>
            </>
          )}

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button onClick={() => toast.success("Checked in (demo)")}>Check-in</Button>
            <Button variant="outline" onClick={() => toast("Invoice created (demo)")}>Create Invoice</Button>
            <Button variant="ghost" onClick={() => toast("Message sent to guest (demo)")}>Message Guest</Button>
          </div>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// Drag handle used in column — identical to your original
function DragHandle({ id }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button {...attributes} {...listeners} variant="ghost" size="icon" className="text-muted-foreground size-7 hover:bg-transparent">
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

// reservation columns exactly as before (preserve all renderers)
const reservationColumns = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "guestName",
    header: "Guest",
    cell: ({ row }) => <ReservationViewer item={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "room",
    header: "Room",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="secondary" className="px-2">
          {row.original.room}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "checkIn",
    header: "Check-In",
    cell: ({ row }) =>
      new Date(row.original.checkIn).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
  },
  {
    accessorKey: "checkOut",
    header: "Check-Out",
    cell: ({ row }) =>
      new Date(row.original.checkOut).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
  },
  {
    accessorKey: "nights",
    header: "Nights",
    cell: ({ row }) => <div className="text-center font-medium">{row.original.nights}</div>,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="font-semibold flex items-center gap-1">
        <IconCurrencyRupee className="size-4" />
        <span>{formatCurrency(row.original.amount)}</span>
      </div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      const variant = status === "Paid" ? "default" : status === "Pending" ? "secondary" : "destructive";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    accessorKey: "reservationStatus",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.reservationStatus;
      return <Badge variant="outline">{s}</Badge>;
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => row.original.source ?? "-",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" size="icon">
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onSelect={() =>
              toast.promise(
                new Promise((res) => setTimeout(res, 700)),
                { loading: "Checking in...", success: "Checked in", error: "Error" }
              )
            }
          >
            Check-In
          </DropdownMenuItem>
          <DropdownMenuItem>Create Invoice</DropdownMenuItem>
          <DropdownMenuItem>Send Receipt</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Cancel Reservation</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function RecentReservationsTable({ data }) {
  // Use the generic DataTable and pass the reservationColumns
  return <DataTable data={data} columns={reservationColumns} initialPageSize={10} idSeed="reservations" />;
}