"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card } from "@/common/components/ui/card"
import { Button } from "@/common/components/ui/button"
import { ArrowLeft, Lock, LockOpen } from "lucide-react"
import type { AccountDetail } from "../types/account.types"
import { AccountStatus } from "../types/account.types"

export default function AccountDetail() {
    const navigate = useNavigate()
    const params = useParams()
    const accountId = params?.id as string

    const [accountDetail, setAccountDetail] = useState<AccountDetail | null>(null)

    useEffect(() => {
        // Fetch account from API
        const foundAccount = null;
        setAccountDetail(foundAccount || null)
    }, [accountId])

    const handleBack = () => {
        navigate("/accounts")
    }

    const formatDateTime = (dateString: string) => {
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

    const formatDateOnly = (dateString: string | null) => {
        if(!dateString) return;

        const date = new Date(dateString);

        const datePart = date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        return `${datePart}`;
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

    if (!accountDetail) {
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
                                Quản lý tài khoản giáo viên
                            </Button>

                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">{accountDetail.fullName}</h1>
                                    <div className="flex items-center gap-3 text-neutral-600">
                                        <span className="text-xs font-medium bg-neutral-100 px-2 py-1 rounded uppercase">Trạng thái</span>
                                        <span className="text-m font-mono font-semibold" style={{ 
                                            color: accountDetail.status.key === AccountStatus.Active ? '#10b981' :
                                                accountDetail.status.key === AccountStatus.Disabled ? '#f59e0b' : '#3b82f6'}}
                                        >
                                            {accountDetail.status.name}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={accountDetail.status.key === AccountStatus.Active ? handleDeactivate : handleReactivate}
                                        className="text-error hover:text-error"
                                    >
                                        {accountDetail.status.key === AccountStatus.Active ? (
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
                                <h3 className="text-lg font-bold text-neutral-900">Thông tin tài khoản giáo viên</h3>
                            </div>
                            <div className="p-8">
                                <div className="space-y-6">
                                    {/* Row 1 - Name & Email */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Họ tên</label>
                                            <div className="flex items-center gap-2 bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                                                <p className="text-sm text-neutral-900 font-mono break-all flex-1">{accountDetail.fullName}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Email</label>
                                            <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                                                <p className="text-sm text-neutral-900 font-mono break-all flex-1">{accountDetail.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2 - DOB & CreatedAt */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ngày sinh</label>
                                            <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                                                <p className="text-sm text-neutral-900">{formatDateOnly(accountDetail.dateOfBirth)}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ngày tạo</label>
                                            <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                                                <p className="text-sm text-neutral-900">{formatDateTime(accountDetail.joinedAtUtc)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Lesson created list */}
                        <Card className="overflow-hidden">
                            <div className="flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200">
                                <h3 className="text-lg font-bold text-neutral-900">Danh sách bài học</h3>
                                <div className="flex gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-neutral-500 mt-1">Tổng số: {} </p>
                                    </div>
                                </div>
                            </div>

                            {/* List out each lessons */}
                            <div className="p-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                        <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-neutral-900">Tên bài học ở đây</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Session created list */}
                        <Card className="overflow-hidden">
                            <div className="flex items-center justify-between bg-neutral-50 px-8 py-5 border-b border-neutral-200">
                                <h3 className="text-lg font-bold text-neutral-900">Danh sách buổi học</h3>
                                <div className="flex gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                    <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm"></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-neutral-500 mt-1">Tổng số: {} </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* List out each sessions */}
                            <div className="p-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                        <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-neutral-900">Tên lớp ở đây</p>
                                            <p className="text-xs text-neutral-500 mt-1">Thời gian tạo ở đây</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    )
}

