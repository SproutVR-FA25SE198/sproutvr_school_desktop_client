"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card } from "@/common/components/ui/card"
import { Button } from "@/common/components/ui/button"
import { ArrowLeft, Edit, Lock, LockOpen } from "lucide-react"
import type { AccountDisplay } from "../types/account.types"
import { AccountStatus, getStatusLabel } from "../types/account.types"
import EditAccountDialog from "../components/dialogs/edit-account-dialog"

// Mock data - in a real app, this would come from an API or context
const mockAccounts: AccountDisplay[] = [
    {
        id: "acc-1",
        firstName: "Nguyễn",
        lastName: "Văn An",
        username: "nguyen.van.an",
        email: "nguyen.van.an@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-2",
        firstName: "Trần",
        lastName: "Thị Bích",
        username: "tran.thi.bich",
        email: "tran.thi.bich@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-3",
        firstName: "Lê",
        lastName: "Hoàng Nam",
        username: "le.hoang.nam",
        email: "le.hoang.nam@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T12:30:00Z",
    },
    {
        id: "acc-4",
        firstName: "Phạm",
        lastName: "Thị Hoa",
        username: "pham.thi.hoa",
        email: "pham.thi.hoa@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-5",
        firstName: "Vũ",
        lastName: "Đức Minh",
        username: "vu.duc.minh",
        email: "vu.duc.minh@sproutvrschool.com",
        status: AccountStatus.Disabled,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-6",
        firstName: "Bùi",
        lastName: "Quang Huy",
        username: "bui.quang.huy",
        email: "bui.quang.huy@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-7",
        firstName: "Đỗ",
        lastName: "Thị Lan",
        username: "do.thi.lan",
        email: "do.thi.lan@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-8",
        firstName: "Hoàng",
        lastName: "Văn Tú",
        username: "hoang.van.tu",
        email: "hoang.van.tu@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T11:30:00Z",
    },
    {
        id: "acc-9",
        firstName: "Nguyễn",
        lastName: "Thị Hạnh",
        username: "nguyen.thi.hanh",
        email: "nguyen.thi.hanh@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
    {
        id: "acc-10",
        firstName: "Trịnh",
        lastName: "Quốc Bảo",
        username: "trinh.quoc.bao",
        email: "trinh.quoc.bao@sproutvrschool.com",
        status: AccountStatus.Active,
        createdAtUtc: "2025-11-10T10:30:00Z",
        updatedAtUtc: "2025-11-10T10:30:00Z",
    },
]

export default function AccountDetail() {
    const navigate = useNavigate()
    const params = useParams()
    const accountId = params?.id as string

    const [account, setAccount] = useState<AccountDisplay | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    useEffect(() => {
        // In a real app, fetch account from API
        const foundAccount = mockAccounts.find((a) => a.id === accountId)
        setAccount(foundAccount || null)
    }, [accountId])

    const handleBack = () => {
        navigate("/accounts")
    }

    const handleEdit = () => {
        setIsEditDialogOpen(true)
    }

    const handleSaveAccount = (updatedAccount: AccountDisplay) => {
        const accountWithTimestamp = {
            ...updatedAccount,
            updatedAtUtc: new Date().toISOString(),
        }
        setAccount(accountWithTimestamp)
        setIsEditDialogOpen(false)
    }

    const getLastSync = (updatedAt: string) => {
        const now = new Date()
        const updated = new Date(updatedAt)
        const diffMs = now.getTime() - updated.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return "vừa đây"
        if (diffMins < 60) return `${diffMins} phút trước`
        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) return `${diffHours} tiếng trước`
        const diffDays = Math.floor(diffHours / 24)
        return `${diffDays} ngày trước`
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

        return `${timePart} ngày ${datePart}`;
    }

    const handleDeactivate = () => {
        if (window.confirm("Bạn có chắc bạn muốn khóa tài khoản này?")) {
            // Call API to update status
        }
    }

    const handleReactivate = () => {
        if (window.confirm("Bạn có chắc bạn mở khóa tài khoản này?")) {
            // Call API to update status
        }
    }

    if (!account) {
        return (
            <div className="flex h-screen bg-neutral-50 items-center justify-center">
                <Card className="p-8 flex flex-col items-center justify-center text-center">
                    <p className="text-neutral-600">Không tìm thấy tài khoản người dùng.</p>
                    <Button onClick={handleBack} className="mt-4">
                        Quay lại
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-neutral-50">
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-auto px-8 pt-8 pb-24">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleBack}
                                className="mb-6 -ml-2 hover:bg-white/50"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Quản lý tài khoản người dùng
                            </Button>

                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">{account.firstName} {account.lastName}</h1>
                                    <div className="flex items-center gap-3 text-neutral-600">
                                        <span className="text-xs font-medium bg-neutral-100 px-2 py-1 rounded uppercase">Trạng thái</span>
                                        <span className="text-m font-mono font-semibold" style={{ 
                                            color: account.status === AccountStatus.Active ? '#10b981' :
                                                account.status === AccountStatus.Disabled ? '#f59e0b' : '#3b82f6'}}
                                        >
                                            {getStatusLabel(account.status)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleEdit}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Cập nhật
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={account.status === AccountStatus.Active ? handleDeactivate : handleReactivate}
                                        className="text-error hover:text-error"
                                    >
                                        {account.status === AccountStatus.Active ? (
                                            <>
                                                <Lock className="w-4 h-4 mr-2" />
                                                Khóa tài khoản
                                            </>
                                        ) : (
                                            <>
                                                <LockOpen className="w-4 h-4 mr-2" />
                                                Mở khóa
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Account Information */}
                        <Card className="overflow-hidden">
                            <div className="flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200">
                                <h3 className="text-lg font-bold text-neutral-900">Thông tin tài khoản người dùng</h3>
                                <div className="flex gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-neutral-500 mt-1">Cập nhật {getLastSync(account.updatedAtUtc)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="space-y-6">
                                    {/* Row 1 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Tên đăng nhập</label>
                                            <div className="flex items-center gap-2 bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                                                <p className="text-sm text-neutral-900 font-mono break-all flex-1">{account.username}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email</label>
                                            <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                                                <p className="text-sm text-neutral-900 font-mono break-all flex-1">{account.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Thời gian tạo</label>
                                            <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                                                <p className="text-sm text-neutral-900">{formatDate(account.createdAtUtc)}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Cập nhật gần nhất</label>
                                            <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                                                <p className="text-sm text-neutral-900">{formatDate(account.updatedAtUtc)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                    </div>
                </div>
            </div>

            {/* Edit account dialog */}
            <EditAccountDialog
                isOpen={isEditDialogOpen}
                account={account}
                onClose={() => setIsEditDialogOpen(false)}
                onSave={handleSaveAccount}
            />
        </div>
    )
}

