"use client"

import { useState, useEffect } from "react"
import { Button } from "@/common/components/ui/button"
import { Input } from "@/common/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select"
import type { VRDeviceDisplay } from "../../types/device.types"
import { VRDeviceStatus, getStatusLabel } from "../../types/device.types"

interface EditDeviceDialogProps {
  isOpen: boolean
  device: VRDeviceDisplay | null
  onClose: () => void
  onSave: (device: VRDeviceDisplay) => void
}

export default function EditDeviceDialog({ isOpen, device, onClose, onSave }: EditDeviceDialogProps) {
  const [formData, setFormData] = useState<VRDeviceDisplay>({
    id: "",
    name: "",
    status: VRDeviceStatus.Available,
    serialNumber: "",
    createdAtUtc: "",
    updatedAtUtc: "",
  })

  useEffect(() => {
    if (device) {
      setFormData(device)
    }
  }, [device])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      updatedAtUtc: new Date().toISOString(),
    })
    onClose()
  }

  const handleChange = (field: keyof VRDeviceDisplay, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Device</DialogTitle>
          <DialogDescription>
            Update the device information below and save your changes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Device Name
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Serial Number
              </label>
              <Input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => handleChange("serialNumber", e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Status
              </label>
              <Select
                value={String(formData.status)}
                onValueChange={(value) => handleChange("status", parseInt(value) as VRDeviceStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={String(VRDeviceStatus.Available)}>
                    {getStatusLabel(VRDeviceStatus.Available)}
                  </SelectItem>
                  <SelectItem value={String(VRDeviceStatus.InUse)}>
                    {getStatusLabel(VRDeviceStatus.InUse)}
                  </SelectItem>
                  <SelectItem value={String(VRDeviceStatus.UnderMaintenance)}>
                    {getStatusLabel(VRDeviceStatus.UnderMaintenance)}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Created At
                </label>
                <Input
                  type="text"
                  value={formData.createdAtUtc ? formatDate(formData.createdAtUtc) : ""}
                  readOnly
                  className="w-full bg-neutral-100 text-neutral-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Last Updated
                </label>
                <Input
                  type="text"
                  value={formData.updatedAtUtc ? formatDate(formData.updatedAtUtc) : ""}
                  readOnly
                  className="w-full bg-neutral-100 text-neutral-600"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="default">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

