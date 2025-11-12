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

interface ImportAccountsDialogProps {
  isOpen: boolean
  onClose: () => void
  onImport: (accounts: any[]) => void
}

export default function ImportAccountsDialog({ isOpen, onClose, onImport }: ImportAccountsDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleImport = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm tài khoản</DialogTitle>
          <DialogDescription>
            Thêm tài khoản mới bằng cách tải file .csv, .xlxs, .xls.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
            <p className="text-sm text-neutral-600 mb-3">Tải file</p>
            <Input type="file" accept=".csv, .xlsx, .xls" className="w-full" placeholder="Choose file" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleImport} disabled={isLoading} variant="default">
            {isLoading ? "Đang tạo mới..." : "Tạo tài khoản"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
