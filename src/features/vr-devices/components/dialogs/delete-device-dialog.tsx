"use client"

import { Button } from "@/common/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog"

interface Device {
  id: string
  name: string
  uuid: string
  status: string
  serialNumber: string
  createdAtUtc: string
  updatedAtUtc: string
}

interface DeleteDeviceDialogProps {
  isOpen: boolean
  device: Device | null
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteDeviceDialog({ isOpen, device, onConfirm, onCancel }: DeleteDeviceDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Device</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{device?.name}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-error hover:bg-error text-white">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
