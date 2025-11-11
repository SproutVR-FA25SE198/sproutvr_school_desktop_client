"use client"

import { Card } from "@/common/components/ui/card"
import { Button } from "@/common/components/ui/button"
import { Badge } from "@/common/components/ui/badge"
import { useNavigate } from "react-router-dom"
import type { AccountDisplay } from "../types/account.types"
import { AccountStatus, getStatusLabel, getStatusVariant, getStatusColor } from "../types/account.types"
import { Clock } from "lucide-react"

interface AccountCardProps extends AccountDisplay {
    onEdit?: () => void
}

export function AccountCard({
    id,
    firstName,
    lastName,
    username,
    email,
    status,
    updatedAtUtc,
    onEdit
}: AccountCardProps) {
    const navigate = useNavigate()

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

    const handleViewDetails = () => {
        navigate(`/accounts/${id}`)
    }

    return (
        <Card className={`group relative flex flex-col overflow-hidden border-2 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${getStatusColor(status)}`}>
            {/* Header */}
            <div className="mb-5">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-neutral-900 mb-1 truncate">{firstName} {lastName}</h3>
                        <p className="text-xs text-neutral-500 font-mono">{username}</p>
                        <p className="text-xs text-neutral-500 font-mono">{email}</p>
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
                    <span className="text-neutral-600">Cập nhật {getLastSync(updatedAtUtc)}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-neutral-200/50 mt-auto">
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
            <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${status === AccountStatus.Active ? "bg-green-500 animate-pulse" :
                    status === AccountStatus.Disabled ? "bg-amber-500 animate-pulse" :
                        "bg-blue-500 animate-pulse"
            }`} />
        </Card>
    )
}
