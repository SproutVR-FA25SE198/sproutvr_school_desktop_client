// VR Device Status Enum
export enum VRDeviceStatus {
    Available = 0,
    InUse = 1,
    UnderMaintenance = 2,
}

export interface VRDevice {
    id: string // UUID
    name: string // VARCHAR(100)
    status: VRDeviceStatus // Enum: 0=Available, 1=InUse, 2=UnderMaintenance
    serialNumber: string // VARCHAR(100)
    createdAtUtc: string // TIMESTAMPZ
    updatedAtUtc: string // TIMESTAMPZ
}

// Extended interface for display purposes
export type VRDeviceDisplay = VRDevice

// Helper functions for status display
export const getStatusLabel = (status: VRDeviceStatus): string => {
    switch (status) {
        case VRDeviceStatus.Available:
            return "Sẵn sàng"
        case VRDeviceStatus.InUse:
            return "Đang sử dụng"
        case VRDeviceStatus.UnderMaintenance:
            return "Bảo trì"
        default:
            return "Không xác định"
    }
}

export const getStatusVariant = (status: VRDeviceStatus): "success" | "error" | "warning" | "info" => {
    switch (status) {
        case VRDeviceStatus.Available:
            return "success"
        case VRDeviceStatus.InUse:
            return "info"
        case VRDeviceStatus.UnderMaintenance:
            return "warning"
        default:
            return "error"
    }
}

export const getStatusColor = (status: VRDeviceStatus): string => {
    switch (status) {
        case VRDeviceStatus.Available:
            return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
        case VRDeviceStatus.InUse:
            return "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200"
        case VRDeviceStatus.UnderMaintenance:
            return "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"
        default:
            return "bg-white"
    }
}

// Legacy alias for backward compatibility
export type Device = VRDevice

