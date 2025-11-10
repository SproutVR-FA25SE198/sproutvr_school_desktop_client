"use client"

import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card } from "@/common/components/ui/card"
import { Button } from "@/common/components/ui/button"
import { Badge } from "@/common/components/ui/badge"
import { ArrowLeft, Edit, Clock } from "lucide-react"
import EditDeviceDialog from "../components/dialogs/edit-device-dialog"
import type { VRDeviceDisplay } from "../types/device.types"
import { VRDeviceStatus, getStatusLabel, getStatusVariant } from "../types/device.types"
import { fetchVRDeviceById, updateVRDeviceStatus } from "../services/vr-device.service"

export default function VRDeviceDetail() {
    const navigate = useNavigate()
    const params = useParams()
    const deviceId = params?.id as string

    const [device, setDevice] = useState<VRDeviceDisplay | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [statusError, setStatusError] = useState<string | null>(null)

    const loadDevice = useCallback(async () => {
        if (!deviceId) return
        try {
            setIsLoading(true)
            setError(null)
            const data = await fetchVRDeviceById(deviceId)
            setDevice(data)
            setStatusError(null)
        } catch (err) {
            console.error("Failed to load device detail", err)
            setError("Không tìm thấy thông tin thiết bị.")
        } finally {
            setIsLoading(false)
        }
    }, [deviceId])

    useEffect(() => {
        void loadDevice()
    }, [loadDevice])

    const handleBack = () => {
        navigate("/vr-devices")
    }

    const handleEdit = () => {
        setIsEditDialogOpen(true)
    }

    const handleSaveDevice = async (newStatus: VRDeviceStatus) => {
        if (!device) return
        try {
            await updateVRDeviceStatus(device.id, newStatus)
            await loadDevice()
            setIsEditDialogOpen(false)
        } catch (err) {
            console.error("Failed to update device status", err)
            setStatusError("Không thể cập nhật trạng thái. Vui lòng thử lại.")
            throw err
        }
    }

    const getLastSync = (updatedAt: string) => {
        const now = new Date()
        const updated = new Date(updatedAt)
        const diffMs = now.getTime() - updated.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return "Vừa xong"
        if (diffMins < 60) return `${diffMins} phút trước`
        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) return `${diffHours} giờ trước`
        const diffDays = Math.floor(diffHours / 24)
        return `${diffDays} ngày trước`
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        })
    }


    if (isLoading) {
        return (
            <div className="flex h-screen bg-neutral-50 items-center justify-center">
                <Card className="p-8">
                    <p className="text-neutral-600">Đang tải thông tin thiết bị...</p>
                </Card>
            </div>
        )
    }

    if (error || !device) {
        return (
            <div className="flex h-screen bg-neutral-50 items-center justify-center">
                <Card className="p-8">
                    <p className="text-neutral-600">{error || "Không tìm thấy thiết bị"}</p>
                    <div className="flex gap-2 mt-4">
                        <Button variant="outline" onClick={handleBack}>
                            Quay lại danh sách
                        </Button>
                        <Button onClick={() => loadDevice()}>Thử lại</Button>
                    </div>
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
                                Quay lại danh sách
                            </Button>

                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">{device.name}</h1>
                                    <div className="flex items-center gap-3 text-neutral-600">
                                        <span className="text-xs font-medium bg-neutral-100 px-2 py-1 rounded uppercase">SN</span>
                                        <span className="text-sm font-mono font-semibold">{device.serialNumber}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={handleEdit}>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Cập nhật
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Status Section */}
                        <Card className="mb-6 border-l-4 p-6" style={{
                            borderLeftColor: device.status === VRDeviceStatus.Available ? '#10b981' :
                                device.status === VRDeviceStatus.InUse ? '#3b82f6' : '#f59e0b'
                        }}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-neutral-900 mb-2">Trạng thái thiết bị</h3>
                                    <p className="text-sm text-neutral-500">Trạng thái hiện tại và thời gian cập nhật gần nhất</p>
                                </div>
                                <Badge variant={getStatusVariant(device.status) as any} className="text-sm px-3 py-1">
                                    {getStatusLabel(device.status)}
                                </Badge>
                            </div>
                            <div className="mt-6 pt-6 border-t border-neutral-100 flex items-center gap-2">
                                <div className="flex items-center gap-2 text-neutral-600">
                                    <Clock className="w-4 h-4 text-neutral-400" />
                                    <span className="text-sm">Cập nhật gần nhất</span>
                                </div>
                                <span className="text-sm font-semibold text-neutral-900 ml-auto">{getLastSync(device.updatedAtUtc)}</span>
                            </div>
                        </Card>

                        {/* Device Information */}
                        <Card className="overflow-hidden">
                            <div className="bg-neutral-50 px-8 py-5 border-b border-neutral-200">
                                <h3 className="text-lg font-bold text-neutral-900">Thông tin thiết bị</h3>
                            </div>
                            <div className="p-8">
                                <div className="space-y-6">
                                    {/* Row 1 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Mã thiết bị</label>
                                            <div className="flex items-center gap-2 bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                                                <p className="text-sm text-neutral-900 font-mono break-all flex-1">{device.id}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Số serial</label>
                                            <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                                                <p className="text-lg font-bold text-neutral-900">{device.serialNumber}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ngày tạo</label>
                                            <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                                                <p className="text-sm text-neutral-900">{formatDate(device.createdAtUtc)}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Cập nhật lần cuối</label>
                                            <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                                                <p className="text-sm text-neutral-900">{formatDate(device.updatedAtUtc)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="mt-6 overflow-hidden">
                            <div className="bg-neutral-50 px-8 py-5 border-b border-neutral-200">
                                <h3 className="text-lg font-bold text-neutral-900">Hoạt động gần đây</h3>
                            </div>
                            <div className="p-8">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-neutral-900">Đồng bộ thành công</p>
                                            <p className="text-xs text-neutral-500 mt-1">{formatDate(device.updatedAtUtc)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-neutral-900">Đổi trạng thái thành {getStatusLabel(device.status)}</p>
                                            <p className="text-xs text-neutral-500 mt-1">{formatDate(device.updatedAtUtc)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                        <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-neutral-900">Tạo thiết bị</p>
                                            <p className="text-xs text-neutral-500 mt-1">{formatDate(device.createdAtUtc)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Edit device dialog */}
            <EditDeviceDialog
                isOpen={isEditDialogOpen}
                device={device}
                onClose={() => setIsEditDialogOpen(false)}
                onSave={handleSaveDevice}
            />
            {statusError && (
                <div className="mt-4">
                    <Card className="bg-error/10 border-error text-error px-4 py-3">
                        <p className="text-sm">{statusError}</p>
                    </Card>
                </div>
            )}
        </div>
    )
}

