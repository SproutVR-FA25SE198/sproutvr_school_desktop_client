"use client"

import { Card } from "@/common/components/ui/card"
import { Button } from "@/common/components/ui/button"
import { Badge } from "@/common/components/ui/badge"
import { useNavigate } from "react-router-dom"
import type { VRDeviceDisplay } from "../types/device.types"
import { VRDeviceStatus, getStatusLabel, getStatusVariant, getStatusColor } from "../types/device.types"
import { Clock } from "lucide-react"

interface DeviceCardProps extends VRDeviceDisplay {
    onEdit?: () => void
}

export function DeviceCard({
    id,
    name,
    status,
    serialNumber,
    updatedAtUtc,
    onEdit
}: DeviceCardProps) {
    const navigate = useNavigate()

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

    const handleViewDetails = () => {
        navigate(`/vr-devices/${id}`)
    }

    return (
        <Card className={`group relative overflow-hidden border-2 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${getStatusColor(status)}`}>
            {/* Header */}
            <div className="mb-5">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-neutral-900 mb-1 truncate">{name}</h3>
                        <p className="text-xs text-neutral-500 font-mono">{serialNumber}</p>
                    </div>
                    <Badge
                        variant={getStatusVariant(status) as any}
                        className="ml-2 shrink-0 font-semibold shadow-sm"
                    >
                        {getStatusLabel(status)}
                    </Badge>
                </div>
            </div>

            {/* Info */}
            <div className="space-y-3 mb-5">
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="text-neutral-600">Cập nhật gần nhất:</span>
                    <span className="font-medium text-neutral-900 ml-auto">{getLastSync(updatedAtUtc)}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-neutral-200/50">
                <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1 font-semibold shadow-sm transition-all duration-200"
                    onClick={onEdit}
                >
                    Cập nhật
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 font-semibold bg-white/50 hover:bg-white border-neutral-300 transition-all duration-200"
                    onClick={handleViewDetails}
                >
                    Chi tiết
                </Button>
            </div>

            {/* Status Indicator Dot */}
            <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${status === VRDeviceStatus.Available ? "bg-green-500 animate-pulse" :
                    status === VRDeviceStatus.InUse ? "bg-blue-500 animate-pulse" :
                        "bg-amber-500 animate-pulse"
                }`} />
        </Card>
    )
}
