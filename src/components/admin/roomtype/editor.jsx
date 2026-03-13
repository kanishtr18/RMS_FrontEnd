// ---------------------------
// RoomType Editor Drawer (Create / Edit)
// ---------------------------
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { toast } from "sonner"

export default function RoomTypeEditor({ open, setOpen, initial, onSave }) {
  // initial: object (for edit) or null (create)
  const isEdit = !!initial
  const [form, setForm] = React.useState(() => ({
    id: initial?.id ?? `rt-${Math.random().toString(36).slice(2, 9)}`,
    name: initial?.name ?? "",
    baseRate: initial?.baseRate ?? 0,
    bedType: initial?.bedType ?? "",
    areaSqFt: initial?.areaSqFt ?? "",
    amenitiesSummary: initial?.amenitiesSummary ?? "",
    maxOccupancy: initial?.maxOccupancy ?? 1,
    totalKeys: initial?.totalKeys ?? 0,
  }))

  React.useEffect(() => {
    // when initial changes, re-init form
    setForm({
      id: initial?.id ?? `rt-${Math.random().toString(36).slice(2, 9)}`,
      name: initial?.name ?? "",
      baseRate: initial?.baseRate ?? 0,
      bedType: initial?.bedType ?? "",
      areaSqFt: initial?.areaSqFt ?? "",
      amenitiesSummary: initial?.amenitiesSummary ?? "",
      maxOccupancy: initial?.maxOccupancy ?? 1,
      totalKeys: initial?.totalKeys ?? 0,
    })
  }, [initial, open])

  const submit = () => {
    // basic client validation
    const result = roomTypeSchema.safeParse({
      ...form,
      baseRate: Number(form.baseRate),
      areaSqFt: form.areaSqFt ? Number(form.areaSqFt) : undefined,
      maxOccupancy: form.maxOccupancy ? Number(form.maxOccupancy) : undefined,
      totalKeys: form.totalKeys ? Number(form.totalKeys) : undefined,
    })

    if (!result.success) {
      const first = result.error.errors[0]
      toast.error(first?.message ?? "Validation error")
      return
    }

    onSave(result.data)
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{isEdit ? "Edit Room Type" : "Create Room Type"}</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 pb-6 space-y-4">
          <div>
            <Label className="pb-1">Name</Label>
            <Input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} placeholder="e.g. Deluxe King" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="pb-1">Base Rate (INR)</Label>
              <Input type="number" value={form.baseRate} onChange={(e) => setForm((s) => ({ ...s, baseRate: e.target.value }))} />
            </div>
            <div>
              <Label className="pb-1">Bed Type</Label>
              <Input value={form.bedType} onChange={(e) => setForm((s) => ({ ...s, bedType: e.target.value }))} placeholder="King / Twin / Sofa bed" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="pb-1">Area (sq ft)</Label>
              <Input type="number" value={form.areaSqFt} onChange={(e) => setForm((s) => ({ ...s, areaSqFt: e.target.value }))} />
            </div>
            <div>
              <Label className="pb-1">Max Occupancy</Label>
              <Input type="number" value={form.maxOccupancy} onChange={(e) => setForm((s) => ({ ...s, maxOccupancy: e.target.value }))} />
            </div>
            <div>
              <Label className="pb-1">Total Keys</Label>
              <Input type="number" value={form.totalKeys} onChange={(e) => setForm((s) => ({ ...s, totalKeys: e.target.value }))} />
            </div>
          </div>

          <div>
            <Label className="pb-1">Amenities summary</Label>
            <Input value={form.amenitiesSummary} onChange={(e) => setForm((s) => ({ ...s, amenitiesSummary: e.target.value }))} placeholder="Comma separated short list" />
          </div>

          <Separator />

          <div className="flex gap-2">
            <Button onClick={submit}>{isEdit ? "Save changes" : "Create room type"}</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </div>
        </div>

        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  )
}