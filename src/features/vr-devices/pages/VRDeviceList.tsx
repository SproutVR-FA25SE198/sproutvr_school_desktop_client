"use client"

import { useState } from "react"
import { Button } from "@/common/components/ui/button"
import { Card } from "@/common/components/ui/card"
import { DeviceCard } from "../components/device-card"
import ImportDevicesDialog from "../components/dialogs/import-devices-dialog"
import EditDeviceDialog from "../components/dialogs/edit-device-dialog"
import type { VRDeviceDisplay } from "../types/device.types"
import { VRDeviceStatus } from "../types/device.types"

const initialDevices: VRDeviceDisplay[] = [
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

export default function DevicesPage() {
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [devices, setDevices] = useState<VRDeviceDisplay[]>(initialDevices)
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState<VRDeviceDisplay | null>(null)

    const filteredDevices = filterStatus === "all" ? devices : devices.filter((d) => String(d.status) === filterStatus)

    const availableCount = devices.filter((d) => d.status === VRDeviceStatus.Available).length
    const inUseCount = devices.filter((d) => d.status === VRDeviceStatus.InUse).length
    const maintenanceCount = devices.filter((d) => d.status === VRDeviceStatus.UnderMaintenance).length

    const handleImportDevices = (newDevices: any[]) => {
        const formattedDevices: VRDeviceDisplay[] = newDevices.map((device, index) => ({
            id: `${crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${index}`}`,
            name: device.name,
            status: device.status !== undefined ? device.status : VRDeviceStatus.Available,
            serialNumber: `SN-${String(100000 + devices.length + index + 1).padStart(6, "0")}`,
            createdAtUtc: new Date().toISOString(),
            updatedAtUtc: new Date().toISOString(),
        }))
        setDevices([...devices, ...formattedDevices])
        setIsImportDialogOpen(false)
    }

    const handleEditDevice = (device: VRDeviceDisplay) => {
        setSelectedDevice(device)
        setIsEditDialogOpen(true)
    }

    const handleSaveDevice = (updatedDevice: VRDeviceDisplay) => {
        const deviceWithTimestamp = {
            ...updatedDevice,
            updatedAtUtc: new Date().toISOString(),
        }
        setDevices(devices.map((d) => (d.id === deviceWithTimestamp.id ? deviceWithTimestamp : d)))
        setIsEditDialogOpen(false)
        setSelectedDevice(null)
    }

    return (
        <div className="flex h-screen bg-neutral-50">
            {/* <Sidebar /> */}

            <div className="flex-1 flex flex-col">
                {/* <TopBar schoolName="Lincoln High School" userName="John Doe" /> */}

                <div className="flex-1 overflow-y-auto px-8 pt-8 pb-24">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-neutral-900 mb-2">Device Management</h2>
                                <p className="text-neutral-500">Monitor and manage VR devices across your school</p>
                            </div>
                            <Button variant="default" size="lg" onClick={() => setIsImportDialogOpen(true)}>
                                + Add Device
                            </Button>
                        </div>

                        {/* Status overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-neutral-500 mb-1">Available</p>
                                        <p className="text-3xl font-bold text-neutral-900">{availableCount}</p>
                                    </div>
                                    <span className="text-4xl">🟢</span>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-neutral-500 mb-1">In Use</p>
                                        <p className="text-3xl font-bold text-neutral-900">{inUseCount}</p>
                                    </div>
                                    <span className="text-4xl">🔵</span>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-neutral-500 mb-1">Maintenance</p>
                                        <p className="text-3xl font-bold text-neutral-900">{maintenanceCount}</p>
                                    </div>
                                    <span className="text-4xl">🟠</span>
                                </div>
                            </Card>
                        </div>

                        {/* Filter buttons */}
                        <div className="flex gap-2 mb-6">
                            <Button
                                variant={filterStatus === "all" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterStatus("all")}
                            >
                                All
                            </Button>
                            <Button
                                variant={filterStatus === String(VRDeviceStatus.Available) ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterStatus(String(VRDeviceStatus.Available))}
                            >
                                Available
                            </Button>
                            <Button
                                variant={filterStatus === String(VRDeviceStatus.InUse) ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterStatus(String(VRDeviceStatus.InUse))}
                            >
                                In Use
                            </Button>
                            <Button
                                variant={filterStatus === String(VRDeviceStatus.UnderMaintenance) ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilterStatus(String(VRDeviceStatus.UnderMaintenance))}
                            >
                                Maintenance
                            </Button>
                        </div>

                        {/* Devices grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredDevices.map((device) => (
                                <DeviceCard
                                    key={device.id}
                                    {...device}
                                    onEdit={() => handleEditDevice(device)}
                                />
                            ))}
                        </div>

                        {filteredDevices.length === 0 && (
                            <Card className="text-center py-12">
                                <p className="text-neutral-500">No devices found for the selected filter.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Import devices dialog */}
            <ImportDevicesDialog
                isOpen={isImportDialogOpen}
                onClose={() => setIsImportDialogOpen(false)}
                onImport={handleImportDevices}
            />

            {/* Edit device dialog */}
            <EditDeviceDialog
                isOpen={isEditDialogOpen}
                device={selectedDevice}
                onClose={() => {
                    setIsEditDialogOpen(false)
                    setSelectedDevice(null)
                }}
                onSave={handleSaveDevice}
            />
        </div>
    )
}
