"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Card } from "@/common/components/ui/card"
import { Button } from "@/common/components/ui/button"
import { Badge } from "@/common/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Clock } from "lucide-react"
import EditDeviceDialog from "../components/dialogs/edit-device-dialog"
import type { VRDeviceDisplay } from "../types/device.types"
import { VRDeviceStatus, getStatusLabel, getStatusVariant } from "../types/device.types"

// Mock data - in a real app, this would come from an API or context
const mockDevices: VRDeviceDisplay[] = [
    {
        id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        name: "VR Headset 01",
        status: VRDeviceStatus.Available,
        serialNumber: "SN-100001",
        createdAtUtc: "2024-09-01T10:30:00Z",
        updatedAtUtc: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    },
    {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "VR Headset 02",
        status: VRDeviceStatus.InUse,
        serialNumber: "SN-100002",
        createdAtUtc: "2024-09-05T09:15:00Z",
        updatedAtUtc: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
        id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        name: "VR Headset 03",
        status: VRDeviceStatus.Available,
        serialNumber: "SN-100003",
        createdAtUtc: "2024-08-15T14:20:00Z",
        updatedAtUtc: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    },
    {
        id: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
        name: "VR Headset 04",
        status: VRDeviceStatus.InUse,
        serialNumber: "SN-100004",
        createdAtUtc: "2024-07-20T16:45:00Z",
        updatedAtUtc: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
        id: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
        name: "VR Headset 05",
        status: VRDeviceStatus.UnderMaintenance,
        serialNumber: "SN-100005",
        createdAtUtc: "2024-06-01T11:30:00Z",
        updatedAtUtc: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: "6ba7b813-9dad-11d1-80b4-00c04fd430c8",
        name: "VR Headset 06",
        status: VRDeviceStatus.Available,
        serialNumber: "SN-100006",
        createdAtUtc: "2024-05-10T08:00:00Z",
        updatedAtUtc: new Date(Date.now() - 30 * 1000).toISOString(),
    },
    {
        id: "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
        name: "VR Headset 07",
        status: VRDeviceStatus.Available,
        serialNumber: "SN-100007",
        createdAtUtc: "2024-04-25T13:15:00Z",
        updatedAtUtc: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    },
    {
        id: "6ba7b815-9dad-11d1-80b4-00c04fd430c8",
        name: "VR Headset 08",
        status: VRDeviceStatus.InUse,
        serialNumber: "SN-100008",
        createdAtUtc: "2024-03-12T15:45:00Z",
        updatedAtUtc: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
]

export default function VRDeviceDetail() {
    const navigate = useNavigate()
    const params = useParams()
    const deviceId = params?.id as string

    const [device, setDevice] = useState<VRDeviceDisplay | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    useEffect(() => {
        // In a real app, fetch device from API
        const foundDevice = mockDevices.find((d) => d.id === deviceId)
        setDevice(foundDevice || null)
    }, [deviceId])

    const handleBack = () => {
        navigate("/vr-devices")
    }

    const handleEdit = () => {
        setIsEditDialogOpen(true)
    }

    const handleSaveDevice = (updatedDevice: VRDeviceDisplay) => {
        const deviceWithTimestamp = {
            ...updatedDevice,
            updatedAtUtc: new Date().toISOString(),
        }
        setDevice(deviceWithTimestamp)
        setIsEditDialogOpen(false)
    }

    const getLastSync = (updatedAt: string) => {
        const now = new Date()
        const updated = new Date(updatedAt)
        const diffMs = now.getTime() - updated.getTime()
        const diffMins = Math.floor(diffMs / 60000)

        if (diffMins < 1) return "Just now"
        if (diffMins < 60) return `${diffMins} min ago`
        const diffHours = Math.floor(diffMins / 60)
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
        const diffDays = Math.floor(diffHours / 24)
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this device?")) {
            // In a real app, call API to delete
            navigate("/vr-devices")
        }
    }



    if (!device) {
        return (
            <div className="flex h-screen bg-neutral-50 items-center justify-center">
                <Card className="p-8">
                    <p className="text-neutral-600">Device not found</p>
                    <Button onClick={handleBack} className="mt-4">
                        Back to Devices
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
                                Back to Devices
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
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleEdit}
                                    >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleDelete}
                                        className="text-error hover:text-error"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
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
                                    <h3 className="text-lg font-bold text-neutral-900 mb-2">Status</h3>
                                    <p className="text-sm text-neutral-500">Current device status and last update time</p>
                                </div>
                                <Badge variant={getStatusVariant(device.status) as any} className="text-sm px-3 py-1">
                                    {getStatusLabel(device.status)}
                                </Badge>
                            </div>
                            <div className="mt-6 pt-6 border-t border-neutral-100 flex items-center gap-2">
                                <div className="flex items-center gap-2 text-neutral-600">
                                    <Clock className="w-4 h-4 text-neutral-400" />
                                    <span className="text-sm">Last update</span>
                                </div>
                                <span className="text-sm font-semibold text-neutral-900 ml-auto">{getLastSync(device.updatedAtUtc)}</span>
                            </div>
                        </Card>

                        {/* Device Information */}
                        <Card className="overflow-hidden">
                            <div className="bg-neutral-50 px-8 py-5 border-b border-neutral-200">
                                <h3 className="text-lg font-bold text-neutral-900">Device Information</h3>
                            </div>
                            <div className="p-8">
                                <div className="space-y-6">
                                    {/* Row 1 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Device ID</label>
                                            <div className="flex items-center gap-2 bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                                                <p className="text-sm text-neutral-900 font-mono break-all flex-1">{device.id}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Serial Number</label>
                                            <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                                                <p className="text-lg font-bold text-neutral-900">{device.serialNumber}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Row 2 */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Created</label>
                                            <div className="bg-neutral-50 rounded-lg px-4 py-3 border border-neutral-200">
                                                <p className="text-sm text-neutral-900">{formatDate(device.createdAtUtc)}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Last Updated</label>
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
                                <h3 className="text-lg font-bold text-neutral-900">Recent Activity</h3>
                            </div>
                            <div className="p-8">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-neutral-900">Device synced successfully</p>
                                            <p className="text-xs text-neutral-500 mt-1">{formatDate(device.updatedAtUtc)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-neutral-900">Status updated to {getStatusLabel(device.status)}</p>
                                            <p className="text-xs text-neutral-500 mt-1">{formatDate(device.updatedAtUtc)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                                        <div className="w-2.5 h-2.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-neutral-900">Device created</p>
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
        </div>
    )
}

