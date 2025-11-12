"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "@/common/components/ui/button"
import { Card } from "@/common/components/ui/card"
import { DeviceCard } from "../components/device-card"
import ImportDevicesDialog from "../components/dialogs/import-devices-dialog"
import EditDeviceDialog from "../components/dialogs/edit-device-dialog"
import type { VRDeviceDisplay } from "../types/device.types"
import { VRDeviceStatus } from "../types/device.types"
import { fetchVRDevices, type FetchVRDevicesParams, updateVRDeviceStatus } from "../services/vr-device.service"

export default function DevicesPage() {
    const [filterStatus, setFilterStatus] = useState<string>("all")
    const [devices, setDevices] = useState<VRDeviceDisplay[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pageIndex, setPageIndex] = useState(1)
    const [pageSize, setPageSize] = useState(12)
    const [totalItems, setTotalItems] = useState(0)
    const [statusTotals, setStatusTotals] = useState({
        [VRDeviceStatus.Available]: 0,
        [VRDeviceStatus.InUse]: 0,
        [VRDeviceStatus.UnderMaintenance]: 0,
    })
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState<VRDeviceDisplay | null>(null)

    const buildQueryParams = useCallback((): FetchVRDevicesParams => {
        const params: FetchVRDevicesParams = {
            pageIndex,
            pageSize,
            sortBy: "createdAtUtcDesc",
            isPaginated: true,
        }

        if (filterStatus !== "all") {
            params.vrDeviceStatus = Number(filterStatus) as VRDeviceStatus
        }

        return params
    }, [filterStatus, pageIndex, pageSize])

    const loadDevices = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)
            const { items, totalItems } = await fetchVRDevices(buildQueryParams())
            setDevices(items)
            setTotalItems(totalItems)
        } catch (err) {
            console.error("Failed to fetch VR devices", err)
            setError("Không thể tải danh sách thiết bị.")
        } finally {
            setIsLoading(false)
        }
    }, [buildQueryParams])

    const loadStatusCounters = useCallback(async () => {
        try {
            const [available, inUse, maintenance] = await Promise.all([
                fetchVRDevices({ pageIndex: 1, pageSize: 1, sortBy: "createdAtUtcDesc", isPaginated: true, vrDeviceStatus: VRDeviceStatus.Available }),
                fetchVRDevices({ pageIndex: 1, pageSize: 1, sortBy: "createdAtUtcDesc", isPaginated: true, vrDeviceStatus: VRDeviceStatus.InUse }),
                fetchVRDevices({ pageIndex: 1, pageSize: 1, sortBy: "createdAtUtcDesc", isPaginated: true, vrDeviceStatus: VRDeviceStatus.UnderMaintenance }),
            ])

            setStatusTotals({
                [VRDeviceStatus.Available]: available.totalItems,
                [VRDeviceStatus.InUse]: inUse.totalItems,
                [VRDeviceStatus.UnderMaintenance]: maintenance.totalItems,
            })
        } catch (err) {
            console.error("Failed to load status counters", err)
        }
    }, [])

    useEffect(() => {
        void loadDevices()
    }, [loadDevices])

    useEffect(() => {
        void loadStatusCounters()
    }, [loadStatusCounters])

    const filteredDevices = useMemo(() => {
        if (filterStatus === "all") return devices
        return devices.filter((d) => String(d.status) === filterStatus)
    }, [devices, filterStatus])

    const availableCount = statusTotals[VRDeviceStatus.Available]
    const inUseCount = statusTotals[VRDeviceStatus.InUse]
    const maintenanceCount = statusTotals[VRDeviceStatus.UnderMaintenance]
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

    const handleImportDevices = async () => {
        await loadDevices()
        await loadStatusCounters()
        setIsImportDialogOpen(false)
    }

    const handleEditDevice = (device: VRDeviceDisplay) => {
        setSelectedDevice(device)
        setIsEditDialogOpen(true)
    }

    const handleSaveDevice = async (newStatus: VRDeviceStatus) => {
        if (!selectedDevice) return
        try {
            await updateVRDeviceStatus(selectedDevice.id, newStatus)
            await loadDevices()
            await loadStatusCounters()
            setIsEditDialogOpen(false)
            setSelectedDevice(null)
        } catch (err) {
            console.error("Failed to update device status", err)
            throw err
        }
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
                                <h2 className="text-3xl font-bold text-neutral-900 mb-2">Quản lý thiết bị VR</h2>
                                <p className="text-neutral-500">Theo dõi và quản lý thiết bị VR trong trường học</p>
                            </div>
                            <Button variant="default" size="lg" onClick={() => setIsImportDialogOpen(true)}>
                                + Thêm thiết bị
                            </Button>
                        </div>

                        {/* Status overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-neutral-500 mb-1">Sẵn sàng</p>
                                        <p className="text-3xl font-bold text-neutral-900">{availableCount}</p>
                                    </div>
                                    <span className="text-4xl">🟢</span>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-neutral-500 mb-1">Đang sử dụng</p>
                                        <p className="text-3xl font-bold text-neutral-900">{inUseCount}</p>
                                    </div>
                                    <span className="text-4xl">🔵</span>
                                </div>
                            </Card>
                            <Card className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-neutral-500 mb-1">Bảo trì</p>
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
                                Tất cả
                            </Button>
                            <Button
                                variant={filterStatus === String(VRDeviceStatus.Available) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    setFilterStatus(String(VRDeviceStatus.Available))
                                    setPageIndex(1)
                                }}
                            >
                                Sẵn sàng
                            </Button>
                            <Button
                                variant={filterStatus === String(VRDeviceStatus.InUse) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    setFilterStatus(String(VRDeviceStatus.InUse))
                                    setPageIndex(1)
                                }}
                            >
                                Đang sử dụng
                            </Button>
                            <Button
                                variant={filterStatus === String(VRDeviceStatus.UnderMaintenance) ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                    setFilterStatus(String(VRDeviceStatus.UnderMaintenance))
                                    setPageIndex(1)
                                }}
                            >
                                Bảo trì
                            </Button>
                        </div>

                        {/* Devices grid */}
                        {isLoading ? (
                            <Card className="py-12 text-center">
                                <p className="text-neutral-500">Đang tải danh sách thiết bị...</p>
                            </Card>
                        ) : error ? (
                            <Card className="py-12 text-center space-y-4">
                                <p className="text-error">{error}</p>
                                <div className="flex justify-center gap-2">
                                    <Button variant="outline" onClick={() => setFilterStatus("all")}>Đặt lại bộ lọc</Button>
                                    <Button onClick={() => loadDevices()}>Thử lại</Button>
                                </div>
                            </Card>
                        ) : (
                            <>
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
                                        <p className="text-neutral-500">Không có thiết bị nào phù hợp bộ lọc.</p>
                                    </Card>
                                )}

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-8">
                                    <div className="text-sm text-neutral-600">
                                        Tổng cộng {totalItems} thiết bị • Trang {pageIndex} / {totalPages}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-neutral-600">Hiển thị</span>
                                            <select
                                                className="border border-neutral-300 rounded-md px-2 py-1 text-sm"
                                                value={pageSize}
                                                onChange={(e) => {
                                                    setPageSize(Number(e.target.value))
                                                    setPageIndex(1)
                                                }}
                                            >
                                                {[6, 12, 24, 48].map((size) => (
                                                    <option key={size} value={size}>
                                                        {size}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={pageIndex === 1}
                                                onClick={() => setPageIndex((prev) => Math.max(1, prev - 1))}
                                            >
                                                Trước
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={pageIndex >= totalPages}
                                                onClick={() =>
                                                    setPageIndex((prev) =>
                                                        prev >= totalPages ? prev : prev + 1,
                                                    )
                                                }
                                            >
                                                Sau
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
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
