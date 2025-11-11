"use client"

import { useEffect, useState } from "react"
import { Button } from "@/common/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/components/ui/select"
import type { VRDeviceDisplay } from "../../types/device.types"
import { VRDeviceStatus, getStatusLabel } from "../../types/device.types"

interface ImportDevicesDialogProps {
  isOpen: boolean
  onClose: () => void
  device: VRDeviceDisplay | null
  onSave: (status: VRDeviceStatus) => Promise<void>
}

export default function EditDeviceDialog({ isOpen, onClose, device, onSave }: ImportDevicesDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<VRDeviceStatus>(VRDeviceStatus.Available)

  useEffect(() => {
    if (device) {
      setStatus(device.status)
    }
    setError(null)
  }, [device])

  const handleUpdateStatus = async () => {
    if (!device) return

    setIsLoading(true)
    setError(null)

    try {
      await onSave(status)
      onClose()
    } catch (err) {
      console.error("Update device status failed", err)
      setError("Không thể cập nhật trạng thái. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái thiết bị</DialogTitle>
          <DialogDescription>
            Chọn trạng thái mới cho thiết bị VR.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {device && (
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                  Tên thiết bị
                </label>
                <p className="text-sm font-semibold text-neutral-900">{device.name}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                  Số serial
                </label>
                <p className="text-sm font-semibold text-neutral-900">{device.serialNumber}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">Trạng thái</label>
            <Select value={String(status)} onValueChange={(value) => setStatus(Number(value) as VRDeviceStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={String(VRDeviceStatus.Available)}>{getStatusLabel(VRDeviceStatus.Available)}</SelectItem>
                <SelectItem value={String(VRDeviceStatus.InUse)}>{getStatusLabel(VRDeviceStatus.InUse)}</SelectItem>
                <SelectItem value={String(VRDeviceStatus.UnderMaintenance)}>
                  {getStatusLabel(VRDeviceStatus.UnderMaintenance)}
                </SelectItem>
              </SelectContent>
            </Select>
            {error && <p className="text-xs text-error mt-2">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={handleUpdateStatus} disabled={isLoading || !device} variant="default">
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

