import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/common/components/ui/select'
import type { VRDeviceDisplay } from '@/features/school-admin/vr-devices/types/device.types'
import { X } from 'lucide-react'

interface DeviceAssignmentRowProps {
    device: {
        id: string
        deviceId: string | null
        serialNumber: string | null
        studentName: string
    }
    availableDevices: VRDeviceDisplay[]
    onUpdate: (id: string, field: "deviceId" | "serialNumber" | "studentName", value: string) => void
    onRemove: (id: string) => void
}

export function DeviceAssignmentRow({ device, availableDevices, onUpdate, onRemove }: DeviceAssignmentRowProps) {
    return (
        <div className="flex gap-2 items-end">
            {/* Device Dropdown */}
            <div className="flex-1 min-w-0">
                <Select value={device.deviceId || ""} onValueChange={(value) => onUpdate(device.id, "deviceId", value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn thiết bị VR" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableDevices.length > 0 ? (
                            availableDevices.map((dev) => (
                                <SelectItem key={dev.id} value={dev.id}>
                                    {dev.name} ({dev.serialNumber})
                                </SelectItem>
                            ))
                        ) : (
                            <div className="px-2 py-1.5 text-sm text-neutral-500">Không có thiết bị nào sẵn sàng</div>
                        )}
                    </SelectContent>
                </Select>
            </div>

            {/* Student Name Input */}
            <div className="flex-1 min-w-0">
                <Input
                    placeholder="Tên học sinh"
                    value={device.studentName}
                    onChange={(e) => onUpdate(device.id, "studentName", e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Delete Button */}
            <Button variant="ghost" size="sm" onClick={() => onRemove(device.id)} className="text-neutral-500 hover:text-red-500">
                <X size={16} />
            </Button>
        </div>
    )
}
