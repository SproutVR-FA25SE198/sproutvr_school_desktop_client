"use client"

import { useState } from "react"
import { Button } from "@/common/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/common/components/ui/dropdown-menu"
import DeleteDeviceDialog from "./dialogs/delete-device-dialog"
import StatusBadge from "./status-badge"
import { MoreVertical } from "lucide-react"

interface Device {
    id: string
    name: string
    uuid: string
    status: string
    serialNumber: string
    createdAtUtc: string
    updatedAtUtc: string
}

interface DevicesTableProps {
    devices: Device[]
    onUpdateStatus: (deviceId: string, newStatus: string) => void
    onDeleteDevice: (deviceId: string) => void
}

export default function DevicesTable({ devices, onUpdateStatus, onDeleteDevice }: DevicesTableProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

    const handleStatusChange = (device: Device, newStatus: string) => {
        onUpdateStatus(device.id, newStatus)
    }

    const handleDeleteClick = (device: Device) => {
        setSelectedDevice(device)
        setDeleteDialogOpen(true)
    }

    const handleConfirmDelete = () => {
        if (selectedDevice) {
            onDeleteDevice(selectedDevice.id)
            setDeleteDialogOpen(false)
            setSelectedDevice(null)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-neutral-200 bg-neutral-50">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Name</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">UUID</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Serial Number</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Created</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-900">Updated</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-neutral-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map((device) => (
                            <tr key={device.id} className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-neutral-900 font-medium">{device.name}</td>
                                <td className="px-6 py-4 text-sm text-neutral-600 font-mono">{device.uuid}</td>
                                <td className="px-6 py-4 text-sm text-neutral-600">{device.serialNumber}</td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={device.status} />
                                </td>
                                <td className="px-6 py-4 text-sm text-neutral-600">{formatDate(device.createdAtUtc)}</td>
                                <td className="px-6 py-4 text-sm text-neutral-600">{formatDate(device.updatedAtUtc)}</td>
                                <td className="px-6 py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-neutral-900">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => handleStatusChange(device, "active")}
                                                className="text-success cursor-pointer"
                                            >
                                                Set Active
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleStatusChange(device, "inactive")}
                                                className="text-warning cursor-pointer"
                                            >
                                                Set Inactive
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleStatusChange(device, "maintenance")}
                                                className="text-warning cursor-pointer"
                                            >
                                                Set Maintenance
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteClick(device)} className="text-error cursor-pointer">
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {devices.length === 0 && (
                <div className="px-6 py-12 text-center">
                    <p className="text-neutral-600">No devices found. Import devices to get started.</p>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <DeleteDeviceDialog
                isOpen={deleteDialogOpen}
                device={selectedDevice}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setDeleteDialogOpen(false)
                    setSelectedDevice(null)
                }}
            />
        </>
    )
}
