export interface VRDevice {
    id: string
    name: string
    uuid: string
    status: "active" | "inactive" | "maintenance"
    serialNumber: string
    createdAtUtc: string
    updatedAtUtc: string
}

export const generateMockDevices = (count: number): VRDevice[] => {
    const statuses: Array<"active" | "inactive" | "maintenance"> = ["active", "inactive", "maintenance"]
    const devices: VRDevice[] = []

    for (let i = 0; i < count; i++) {
        const now = new Date()
        const createdDate = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000) // Random date in last 90 days

        devices.push({
            id: `device-${Date.now()}-${i}`,
            name: `VR Device ${i + 1}`,
            uuid: `${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            serialNumber: `SN-${String(100000 + i).padStart(6, "0")}`,
            createdAtUtc: createdDate.toISOString(),
            updatedAtUtc: now.toISOString(),
        })
    }

    return devices
}

export const mockDevices: VRDevice[] = [
    {
        id: "device-1",
        name: "VR Device 1",
        uuid: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        status: "active",
        serialNumber: "SN-100001",
        createdAtUtc: "2025-09-01T10:30:00Z",
        updatedAtUtc: "2025-11-08T14:22:00Z",
    },
    {
        id: "device-2",
        name: "VR Device 2",
        uuid: "550e8400-e29b-41d4-a716-446655440000",
        status: "active",
        serialNumber: "SN-100002",
        createdAtUtc: "2025-09-05T09:15:00Z",
        updatedAtUtc: "2025-11-07T11:45:00Z",
    },
    {
        id: "device-3",
        name: "VR Device 3",
        uuid: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        status: "maintenance",
        serialNumber: "SN-100003",
        createdAtUtc: "2025-08-15T14:20:00Z",
        updatedAtUtc: "2025-11-06T08:30:00Z",
    },
    {
        id: "device-4",
        name: "VR Device 4",
        uuid: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
        status: "inactive",
        serialNumber: "SN-100004",
        createdAtUtc: "2025-07-20T16:45:00Z",
        updatedAtUtc: "2025-10-15T10:00:00Z",
    },
    {
        id: "device-5",
        name: "VR Device 5",
        uuid: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
        status: "active",
        serialNumber: "SN-100005",
        createdAtUtc: "2025-06-01T11:30:00Z",
        updatedAtUtc: "2025-11-08T16:20:00Z",
    },
]
