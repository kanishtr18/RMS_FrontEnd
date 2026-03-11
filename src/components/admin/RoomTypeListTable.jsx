"use client";

import DataTable from "./data-table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { IconDotsVertical, IconCurrencyRupee } from "@tabler/icons-react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

const formatCurrency = (v) =>
  Number(v ?? 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

function RoomTypeViewer({ item }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="link" className="px-0 text-left">
          {item.name}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{item.name}</DrawerTitle>
          <DrawerDescription>{item.bedType}</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 text-sm space-y-4">

          <div className="grid grid-cols-2 gap-4">

            <div>
              <Label>Base Rate</Label>
              <div className="font-medium flex items-center gap-1">
                <IconCurrencyRupee className="size-4" />
                {formatCurrency(item.baseRate)}
              </div>
            </div>

            <div>
              <Label>Max Occupancy</Label>
              <div>{item.maxOccupancy}</div>
            </div>

            <div>
              <Label>Area</Label>
              <div>{item.areaSqFt} sq ft</div>
            </div>

            <div>
              <Label>Total Keys</Label>
              <div>{item.totalKeys}</div>
            </div>

          </div>

          <Separator />

          <div>
            <Label>Amenities</Label>
            <div className="text-muted-foreground">
              {item.amenitiesSummary ?? "—"}
            </div>
          </div>

          <div>
            <Label>Rooms</Label>
            <div>{item.rooms?.length ?? 0}</div>
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

const roomTypeColumns = [

  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
      />
    ),

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(v) => row.toggleSelected(!!v)}
      />
    ),

  },

  {
    accessorKey: "name",
    header: "Room Type",
    cell: ({ row }) => <RoomTypeViewer item={row.original} />,
  },

  {
    accessorKey: "baseRate",
    header: "Base Rate",

    cell: ({ row }) => (
      <div className="font-medium">
        {formatCurrency(row.original.baseRate)}
      </div>
    ),
  },

  {
    accessorKey: "bedType",
    header: "Bed Type",
  },

  {
    accessorKey: "areaSqFt",
    header: "Area",
    cell: ({ row }) => `${row.original.areaSqFt} sq ft`,
  },

  {
    accessorKey: "maxOccupancy",
    header: "Occupancy",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.maxOccupancy} Guests
      </Badge>
    ),
  },

  {
    accessorKey: "totalKeys",
    header: "Keys",
  },

  {
    id: "rooms",
    header: "Rooms",
    cell: ({ row }) => row.original.rooms?.length ?? 0,
  },

  {
    id: "actions",

    cell: ({ row }) => (

      <DropdownMenu>

        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <IconDotsVertical />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">

          <DropdownMenuItem
            onSelect={() => toast("Edit Room Type (demo)")}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => toast("Add Room (demo)")}
          >
            Add Room
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onSelect={() => toast("Delete Room Type (demo)")}
          >
            Delete
          </DropdownMenuItem>

        </DropdownMenuContent>

      </DropdownMenu>

    ),
  },

];

export default function RoomTypeListTable({ data }) {

  return (
    <DataTable
      data={data}
      columns={roomTypeColumns}
      initialPageSize={10}
      idSeed="room-types"
    />
  );

}