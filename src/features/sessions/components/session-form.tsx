"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus, Play } from 'lucide-react'
import { Label } from "@/common/components/ui/label"
import { Input } from "@/common/components/ui/input"
import { Button } from "@/common/components/ui/button"
import { Card } from "@/common/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/components/ui/select"
import { DeviceAssignmentRow } from "./device-assignment-row"
import { mockDevices } from "@/features/school-admin/vr-devices/services/mock-data"
import { getAllVrLessons, GET_ALL_VR_LESSONS_QUERY_KEY } from "@/common/services/vr-lesson.service"
import type { VrLessonRetrieve } from "@/common/types/vr-lesson.type"

interface DeviceAssignment {
  id: string
  deviceId: string | null
  studentName: string
}

interface SessionFormProps {
  vrLesson?: VrLessonRetrieve
}

export function SessionForm({ vrLesson: initialVrLesson }: SessionFormProps) {
  const [classroomNumber, setClassroomNumber] = useState("")
  const [classroomLetter, setClassroomLetter] = useState("")
  const [selectedVrLessonId, setSelectedVrLessonId] = useState<string>(initialVrLesson?.id || "")
  const [devices, setDevices] = useState<DeviceAssignment[]>([])
  const [duration, setDuration] = useState("00:30:00")
  const [startTimeType, setStartTimeType] = useState("now")
  const [startTime, setStartTime] = useState(new Date().toISOString().slice(11, 16))

  const { data: vrLessonsData } = useQuery({
    queryKey: [GET_ALL_VR_LESSONS_QUERY_KEY],
    queryFn: async () => await getAllVrLessons(),
    enabled: !initialVrLesson, // Only fetch if no initial VR lesson
    refetchOnWindowFocus: false,
  })

  const vrLessons = vrLessonsData?.items || []
  const selectedVrLesson = initialVrLesson || vrLessons.find(vl => vl.id === selectedVrLessonId)

  // Handle classroom number input - only numbers
  const handleClassroomNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Remove non-digits
    setClassroomNumber(value)
  }

  // Handle classroom letter input - alphanumeric, no special chars
  const handleClassroomLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '') // Only alphanumeric
    setClassroomLetter(value)
  }

  const activeDevices = mockDevices.filter((d: { status: string }) => d.status === "active")
  const getAvailableDevices = (currentRowId: string) => {
    const selectedIds = devices.filter((d) => d.id !== currentRowId).map((d) => d.deviceId)
    return activeDevices.filter((device: { id: string | null }) => !selectedIds.includes(device.id))
  }

  const addDeviceRow = () => {
    if (devices.length < 8) {
      const newId = `device-${Date.now()}`
      setDevices([...devices, { id: newId, deviceId: null, studentName: "" }])
    }
  }

  const removeDeviceRow = (id: string) => {
    setDevices(devices.filter((d) => d.id !== id))
  }

  const updateDeviceRow = (id: string, field: "deviceId" | "studentName", value: string) => {
    setDevices(devices.map((d) => (d.id === id ? { ...d, [field]: value } : d)))
  }

  const classroomName = `${classroomNumber}${classroomLetter ? ' ' + classroomLetter : ''}`.trim()
  const isFormValid =
    classroomNumber.trim() &&
    selectedVrLessonId &&
    devices.length > 0 &&
    devices.every((d) => d.deviceId && d.studentName)

  const handleSubmit = () => {
    if (!isFormValid) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc")
      return
    }
    console.log("[v0] Session submitted:", {
      classroomName,
      classroomNumber,
      classroomLetter,
      vrLessonId: selectedVrLessonId,
      vrLesson: selectedVrLesson,
      devices,
      duration,
      startTimeType,
      startTime,
    })
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {/* Main Form - 3 columns */}
      <div className="col-span-3">
        <Card className="p-6 mb-6">
          {/* VR Lesson Selection */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">
              Bài học VR
            </Label>
            {initialVrLesson ? (
              <Input
                value={initialVrLesson.name}
                readOnly
                className="w-full bg-neutral-100"
              />
            ) : (
              <Select value={selectedVrLessonId} onValueChange={setSelectedVrLessonId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn bài học VR" />
                </SelectTrigger>
                <SelectContent>
                  {vrLessons.length > 0 ? (
                    vrLessons.map((vrLesson) => (
                      <SelectItem key={vrLesson.id} value={vrLesson.id}>
                        {vrLesson.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-neutral-500">Không có bài học VR nào</div>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Classroom Name - Split into 2 fields */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">
              Lớp học
            </Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="10, 11, 12..."
                  value={classroomNumber}
                  onChange={handleClassroomNumberChange}
                  className="w-full"
                  type="text"
                  inputMode="numeric"
                />
                <p className="text-xs text-neutral-500 mt-1">Chỉ nhập số</p>
              </div>
              <div className="flex-1">
                <Input
                  placeholder="A, B, 1, 2..."
                  value={classroomLetter}
                  onChange={handleClassroomLetterChange}
                  className="w-full"
                />
                <p className="text-xs text-neutral-500 mt-1">Chữ hoặc số, không ký tự đặc biệt</p>
              </div>
            </div>
          </div>

          {/* Device Assignments */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-sm font-medium">VR Devices ({devices.length}/8)</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addDeviceRow}
                disabled={devices.length >= 8}
                className="gap-1"
              >
                <Plus size={16} />
                Add Device
              </Button>
            </div>

            {/* Device rows */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {devices.map((device) => (
                <DeviceAssignmentRow
                  key={device.id}
                  device={device}
                  availableDevices={getAvailableDevices(device.id)}
                  onUpdate={updateDeviceRow}
                  onRemove={removeDeviceRow}
                />
              ))}

              {devices.length === 0 && (
                <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center">
                  <p className="text-neutral-500 text-sm">No devices added yet. Click "Add Device" to get started.</p>
                </div>
              )}
            </div>

            <p className="text-xs text-neutral-500 mt-3">Maximum: 8 devices in 1 VR learning session</p>
          </div>

          {/* Instruction box */}
          <div className="bg-neutral-100 rounded-lg p-4 mb-6">
            <p className="text-xs text-neutral-600">Instruction for teacher</p>
          </div>

          {/* Play VR Lesson Button */}
          <Button className="w-full bg-[#5B9FD8] hover:bg-[#4A8CC5] gap-2" onClick={handleSubmit}>
            <Play size={16} />
            Play VR Lesson
          </Button>
        </Card>
      </div>

      {/* Right Sidebar - 1 column */}
      <div className="col-span-1">
        <Card className="p-6 sticky top-0">
          {/* Duration */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">Duration</Label>
            <Input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="00:30:00"
              className="font-mono text-sm"
            />
          </div>

          {/* Start Time */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Start Time</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="start-timer"
                  value="timer"
                  checked={startTimeType === "timer"}
                  onChange={(e) => setStartTimeType(e.target.value)}
                  className="w-4 h-4"
                />
                <label htmlFor="start-timer" className="text-sm text-neutral-700">
                  Timer chọn giờ
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="start-now"
                  value="now"
                  checked={startTimeType === "now"}
                  onChange={(e) => setStartTimeType(e.target.value)}
                  className="w-4 h-4"
                />
                <label htmlFor="start-now" className="text-sm text-neutral-700">
                  Now
                </label>
              </div>
            </div>

            {startTimeType === "timer" && (
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-2"
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
