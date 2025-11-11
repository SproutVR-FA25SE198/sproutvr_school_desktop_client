// Account Status Enum
export enum AccountStatus {
    Active = 1,
    Disabled = 0
}

export interface Account {
    id: string // UUID
    firstName: string // VARCHAR(50)
    lastName: string //VARCHAR(50)
    username: string //VARCHAR(50)
    email: string //VARCHAR(100)
    status: AccountStatus // Enum: 0=Active, 1=Disabled
    createdAtUtc: string // TIMESTAMPZ
    updatedAtUtc: string // TIMESTAMPZ
}

// Extended interface for display purposes
export type AccountDisplay = Account

// Helper functions for status display
export const getStatusLabel = (status: AccountStatus): string => {
    switch (status) {
        case AccountStatus.Active:
            return "Hoạt động"
        case AccountStatus.Disabled:
            return "Đã khóa"
        default:
            return "Không rõ trạng thái"
    }
}

export const getStatusVariant = (status: AccountStatus): "success" | "error" | "warning" => {
    switch (status) {
        case AccountStatus.Active:
            return "success"
        case AccountStatus.Disabled:
            return "warning"
        default:
            return "error"
    }
}

export const getStatusColor = (status: AccountStatus): string => {
    switch (status) {
        case AccountStatus.Active:
            return "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
        case AccountStatus.Disabled:
            return "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"
        default:
            return "bg-white"
    }
}
