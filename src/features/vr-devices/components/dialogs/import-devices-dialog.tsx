"use client"

import { useState } from "react"
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
import { generateMockDevices } from "../../services/mock-data"

interface ImportDevicesDialogProps {
  isOpen: boolean
  onClose: () => void
  onImport: (devices: any[]) => void
}

export default function ImportDevicesDialog({ isOpen, onClose, onImport }: ImportDevicesDialogProps) {
  const [importCount, setImportCount] = useState(5)
  const [isLoading, setIsLoading] = useState(false)

  const handleImport = async () => {
    setIsLoading(true)
    // Simulate import delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newDevices = generateMockDevices(importCount)
    onImport(newDevices)
    setIsLoading(false)
    setImportCount(5)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import VR Devices</DialogTitle>
          <DialogDescription>
            Add new VR devices to your inventory. You can import from a CSV file or add devices manually.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">Number of devices to import</label>
            <Input
              type="number"
              min="1"
              max="100"
              value={importCount}
              onChange={(e) => setImportCount(Math.max(1, Number.parseInt(e.target.value) || 1))}
              className="w-full"
            />
          </div>

          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
            <p className="text-sm text-neutral-600 mb-3">Or upload a CSV file</p>
            <Input type="file" accept=".csv" className="w-full" placeholder="Choose file" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isLoading} variant="default">
            {isLoading ? "Importing..." : "Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
