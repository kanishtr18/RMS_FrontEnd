"use client";

import { IconDotsVertical } from "@tabler/icons-react";
import DataTable from "./data-table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

function EmployeeViewer({ item }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="link" className="px-0 text-left">
          {item.firstName} {item.lastName}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {item.firstName} {item.lastName}
          </DrawerTitle>

          <DrawerDescription>{item.email}</DrawerDescription>
        </DrawerHeader>

        <div className="px-4 text-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <div>{item.phone ?? "—"}</div>
            </div>

            <div>
              <Label>Hire Date</Label>
              <div>{formatDate(item.hireDate)}</div>
            </div>

            <div>
              <Label>Status</Label>
              <Badge
                variant={
                  item.status === "ACTIVE"
                    ? "default"
                    : item.status === "INACTIVE"
                    ? "secondary"
                    : "destructive"
                }
              >
                {item.status}
              </Badge>
            </div>
          </div>

          <Separator />

          <div>
            <Label>Roles</Label>

            <div className="mt-2 flex flex-wrap gap-2">
              {item.roles?.length
                ? item.roles.map((r) => (
                    <Badge key={r.id} variant="outline">
                      {r.role?.name}
                    </Badge>
                  ))
                : "No roles"}
            </div>
          </div>

          <div>
            <Label>Shift Count</Label>
            <div>{item.shiftSchedules?.length ?? 0}</div>
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

const employeeColumns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
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
    accessorKey: "firstName",
    header: "Employee",

    cell: ({ row }) => <EmployeeViewer item={row.original} />,
  },

  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "phone",
    header: "Phone",
  },

  {
    accessorKey: "hireDate",
    header: "Hire Date",

    cell: ({ row }) => formatDate(row.original.hireDate),
  },

  {
    accessorKey: "status",
    header: "Status",

    cell: ({ row }) => {
      const s = row.original.status;

      const variant =
        s === "ACTIVE"
          ? "default"
          : s === "INACTIVE"
          ? "secondary"
          : "destructive";

      return <Badge variant={variant}>{s}</Badge>;
    },
  },

  {
    id: "roles",

    header: "Roles",

    cell: ({ row }) => {
      const roles = row.original.roles ?? [];

      return roles.length
        ? roles.map((r) => r.role?.name).join(", ")
        : "—";
    },
  },

  {
    id: "shifts",
    header: "Shifts",

    cell: ({ row }) => row.original.shiftSchedules?.length ?? 0,
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
            onSelect={() =>
              toast("Edit employee (demo)")
            }
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() =>
              toast("Assign role (demo)")
            }
          >
            Assign Role
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() =>
              toast("Create shift (demo)")
            }
          >
            Create Shift
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            onSelect={() =>
              toast("Employee terminated (demo)")
            }
          >
            Terminate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function EmployeeListTable({ data }) {
  return (
    <DataTable
      data={data}
      columns={employeeColumns}
      initialPageSize={10}
      idSeed="employees"
    />
  );
}