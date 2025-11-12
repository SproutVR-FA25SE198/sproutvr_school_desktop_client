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
import type { Account } from "../../types/account.types"

interface DeactivateAccountDialogProps {
  isOpen: boolean
  account: Account | null
  onConfirm: () => void
  onCancel: () => void
}

export default function DeactivateAccountDialog({ isOpen, account, onConfirm, onCancel }: DeactivateAccountDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Khóa tài khoản</DialogTitle>
          <DialogDescription>
            Xác nhận khóa tài khoản của <strong>{account?.fullName}</strong>?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button onClick={onConfirm} className="bg-error hover:bg-error text-white">
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
