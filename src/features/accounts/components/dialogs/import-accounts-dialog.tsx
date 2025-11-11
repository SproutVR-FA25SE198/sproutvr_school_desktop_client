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
import { generateMockAccounts } from "../../services/mock-data"

interface ImportAccountsDialogProps {
  isOpen: boolean
  onClose: () => void
  onImport: (accounts: any[]) => void
}

export default function ImportAccountsDialog({ isOpen, onClose, onImport }: ImportAccountsDialogProps) {
  const [importCount, setImportCount] = useState(5)
  const [isLoading, setIsLoading] = useState(false)

  const handleImport = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newAccounts = generateMockAccounts(importCount)
    onImport(newAccounts)
    setIsLoading(false)
    setImportCount(5)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm tài khoản</DialogTitle>
          <DialogDescription>
            Tạo tài khoản mới cho hệ thống bằng cách tải file .csv, .xlxs, .xls hoặc tạo thủ công.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">Số lượng tài khoản mới</label>
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
