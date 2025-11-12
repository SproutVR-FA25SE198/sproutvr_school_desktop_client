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
import { AccountStatus, type AccountDisplay } from "../../types/account.types"

interface EditAccountDialogProps {
  isOpen: boolean
  account: AccountDisplay | null
  onClose: () => void
  onSave: (account: AccountDisplay) => void
}

export default function EditAccountDialog({ isOpen, account, onClose, onSave }: EditAccountDialogProps) {
  const [formData, setFormData] = useState<AccountDisplay>({
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    status: account?.status ?? AccountStatus.Disabled,
    createdAtUtc: "",
    updatedAtUtc: "",
  })

  useEffect(() => {
    if (account) {
      setFormData(account)
    }
  }, [account])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      updatedAtUtc: new Date().toISOString(),
    })
    onClose()
  }

  const handleChange = (field: keyof AccountDisplay, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    const datePart = date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const timePart = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${datePart}, ${timePart}`;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật</DialogTitle>
          <DialogDescription>
            Chỉnh sửa và lưu thông tin tài khoản.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Họ
              </label>
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Tên
              </label>
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Tên đăng nhập
              </label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-2">
                Email
              </label>
              <Input
                type="text"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full"
                required
              />
            </div>
           
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  Thời gian tạo
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
                  Cập nhật gần nhất
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
              Hủy
            </Button>
            <Button type="submit" variant="default">
              Lưu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

