// components/GuestListTable.tsx
"use client";

import { z } from "zod";
import {
  IconGripVertical,
  IconDotsVertical,
  IconPhone,
  IconMail,
  IconStar,
  IconUserX,
  IconUserCheck,
} from "@tabler/icons-react";
import DataTable from "./data-table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { useIsMobile } from "@/hooks/use-mobile";
import { useSortable } from "@dnd-kit/sortable";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// --- guest schema (keeps validation parity) ---
export const guestSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(["Active", "Inactive", "Blacklisted"]),
  vip: z.boolean().optional().default(false),
  totalStays: z.number().optional().default(0),
  lastStay: z.string().nullable().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
});

// small helper (same formatting)
const formatDateShort = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })
    : "—";

// --- Guest Drawer Viewer (matches ReservationViewer pattern) ---
function GuestViewer({ guest }) {
  const isMobile = useIsMobile();
  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {guest.name}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <div className="flex items-start justify-between gap-4 w-full">
            <div>
              <DrawerTitle className="text-lg">{guest.name}</DrawerTitle>
              <DrawerDescription>
                {guest.vip ? "VIP guest" : "Guest profile"}
              </DrawerDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="font-semibold text-lg">
                <Badge
                  variant={
                    guest.status === "Active"
                      ? "default"
                      : guest.status === "Inactive"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {guest.status}
                </Badge>
                {guest.vip && <Badge className="ml-2">VIP</Badge>}
              </div>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <div className="font-medium flex items-center gap-2">
                <IconMail className="size-4" />
                <span>{guest.email ?? "—"}</span>
              </div>
            </div>

            <div>
              <Label>Phone</Label>
              <div className="font-medium flex items-center gap-2">
                <IconPhone className="size-4" />
                <span>{guest.phone ?? "—"}</span>
              </div>
            </div>

            <div>
              <Label>Total stays</Label>
              <div className="font-medium">{guest.totalStays ?? 0}</div>
            </div>

            <div>
              <Label>Last stay</Label>
              <div>{formatDateShort(guest.lastStay)}</div>
            </div>

            <div>
              <Label>Source</Label>
              <div className="text-muted-foreground">{guest.source ?? "—"}</div>
            </div>
          </div>

          {guest.notes && (
            <>
              <Separator />
              <div>
                <Label>Notes</Label>
                <div className="text-sm text-muted-foreground">{guest.notes}</div>
              </div>
            </>
          )}

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button onClick={() => toast("Message sent (demo)")}>Message</Button>
            <Button variant="outline" onClick={() => toast("Edit guest (demo)")}>
              Edit
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                toast.promise(
                  new Promise((res) => setTimeout(res, 700)),
                  { loading: "Updating...", success: "Done", error: "Error" }
                )
              }
            >
              More
            </Button>
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

// --- Drag handle (same as reservations) ---
function DragHandle({ id }) {
  const { attributes, listeners } = useSortable({ id });
  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

// --- guest table columns (mirrors reservationColumns structure) ---
const guestColumns = [
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
    accessorKey: "firstName",
    header: "FirstName",
    cell: ({ row }) => <GuestViewer guest={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "lastName",
    header: "FirstName",
    cell: ({ row }) => <GuestViewer guest={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <IconMail className="size-4 text-muted-foreground" />
        <span className="truncate">{row.original.email ?? "-"}</span>
      </div>
    ),
  },
  {
    accessorKey: "guestType",
    header: "Guest Type",
    cell: ({ row }) => <GuestViewer guest={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <IconPhone className="size-4 text-muted-foreground" />
        <span>{row.original.phone ?? "-"}</span>
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => <GuestViewer guest={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "dob",
    header: "DOB",
    cell: ({ row }) => <GuestViewer guest={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "age",
    header: "Age",
    cell: ({ row }) => <GuestViewer guest={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "loyaltyMember",
    header: "Loyalty Member Id",
    cell: ({ row }) => <GuestViewer guest={row.original} />,
    enableHiding: false,
  },
  {
    accessorKey: "totalStays",
    header: "Total stays",
    cell: ({ row }) => <div className="text-center font-medium">{row.original.totalStays ?? 0}</div>,
  },
  {
    accessorKey: "lastStay",
    header: "Last stay",
    cell: ({ row }) =>
      row.original.lastStay ? (
        new Date(row.original.lastStay).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
      ) : (
        "—"
      ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      const variant = s === "Active" ? "default" : s === "Inactive" ? "secondary" : "destructive";
      return (
        <div className="flex items-center gap-2">
          <Badge variant={variant}>{s}</Badge>
          {row.original.vip && <Badge className="ml-2">VIP</Badge>}
        </div>
      );
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
          <DropdownMenuItem onSelect={() => toast("Message sent (demo)")}>Message</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => toast("Edit (demo)")}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() =>
              toast.promise(
                new Promise((res) => setTimeout(res, 700)),
                { loading: "Updating...", success: "Updated", error: "Error" }
              )
            }
            variant="destructive"
          >
            {row.original.status === "Blacklisted" ? "Remove blacklist" : "Add to blacklist"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function GuestListTable({ data }) {
  // data expected to match guestSchema array
  return <DataTable data={data} columns={guestColumns} initialPageSize={10} idSeed="guests" />;
}