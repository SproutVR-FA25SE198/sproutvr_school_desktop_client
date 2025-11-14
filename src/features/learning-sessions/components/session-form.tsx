"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Plus, Play, CheckCircle2 } from 'lucide-react'
import { Label } from "@/common/components/ui/label"
import { Input } from "@/common/components/ui/input"
import { Button } from "@/common/components/ui/button"
import { Card } from "@/common/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/common/components/ui/select"
import { DeviceAssignmentRow } from "./device-assignment-row"
import { getAllVrLessons, GET_ALL_VR_LESSONS_QUERY_KEY } from "@/common/services/vr-lesson.service"
import { getVrLessonList, GET_VR_LESSON_LIST_QUERY__KEY } from "@/features/lessons/services/lesson.service"
import { fetchVRDevices } from "@/features/school-admin/vr-devices/services/vr-device.service"
import { VRDeviceStatus } from "@/features/school-admin/vr-devices/types/device.types"
import { createRoom, activateRoom } from "@/core/ipc/grpc"
import routes from "@/core/configs/routes"
import type { VrLessonRetrieve } from "@/common/types/vr-lesson.type"
import type { VRDeviceDisplay } from "@/features/school-admin/vr-devices/types/device.types"

interface DeviceAssignment {
  id: string
  deviceId: string | null
  serialNumber: string | null
  studentName: string
}

interface SessionFormProps {
  vrLesson?: VrLessonRetrieve
  lessonId?: string // Filter VR lessons by lessonId if provided
}

export function SessionForm({ vrLesson: initialVrLesson, lessonId }: SessionFormProps) {
  const navigate = useNavigate()
  const [classroomNumber, setClassroomNumber] = useState("")
  const [classroomLetter, setClassroomLetter] = useState("")
  const [selectedVrLessonId, setSelectedVrLessonId] = useState<string>(initialVrLesson?.id || "")
  const [devices, setDevices] = useState<DeviceAssignment[]>([])
  const [duration, setDuration] = useState("00:30:00")
  const [startTimeType, setStartTimeType] = useState("now")
  const [startTime, setStartTime] = useState(new Date().toISOString().slice(11, 16))
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [isActivating, setIsActivating] = useState(false)
  const [vrLearningSessionId, setVrLearningSessionId] = useState<string | null>(null)
  const [createdSession, setCreatedSession] = useState<{ sessionId: string; roomCode: string } | null>(null)

  // Hardcoded teacher ID - should be from auth context in production
  const teacherId = '0199f4b1-8487-4352-8a2a-320a00e40e58'

  // Fetch VR lessons - filter by lessonId if provided, otherwise get all
  const { data: vrLessonsData } = useQuery({
    queryKey: lessonId 
      ? [GET_VR_LESSON_LIST_QUERY__KEY, lessonId]
      : [GET_ALL_VR_LESSONS_QUERY_KEY],
    queryFn: async () => {
      if (lessonId) {
        return await getVrLessonList(lessonId)
      }
      return await getAllVrLessons()
    },
    enabled: !initialVrLesson, // Only fetch if no initial VR lesson
    refetchOnWindowFocus: false,
  })

  // Fetch active VR devices
  const { data: vrDevicesData, isLoading: isLoadingDevices } = useQuery({
    queryKey: ['vr-devices-active'],
    queryFn: async () => await fetchVRDevices({ 
      vrDeviceStatus: VRDeviceStatus.Available, 
      isPaginated: false 
    }),
    refetchOnWindowFocus: false,
  })

  // Handle different response structures
  const vrLessons = lessonId 
    ? (vrLessonsData?.items || []) // getVrLessonList returns { items: [...] }
    : (vrLessonsData?.items || []) // getAllVrLessons also returns { items: [...] }
  const selectedVrLesson = initialVrLesson || vrLessons.find(vl => vl.id === selectedVrLessonId)
  const activeDevices = vrDevicesData?.items || []

  // Create room when component mounts with a VR lesson, or when VR lesson is selected
  const { mutate: createRoomMutation } = useMutation({
    mutationFn: async ({ vrLessonId, className }: { vrLessonId: string; className: string }) => {
      return await createRoom(teacherId, vrLessonId, className)
    },
    onSuccess: (response) => {
      console.log('Room created:', response)
      setVrLearningSessionId(response.vr_learning_session_id)
      setIsCreatingRoom(false)
    },
    onError: (error: any) => {
      console.error('Create room error:', error)
      alert(`Lỗi khi tạo phòng: ${error?.message || 'Unknown error'}`)
      setIsCreatingRoom(false)
    },
  })

  // Auto-create room when VR lesson is available and class name is provided
  useEffect(() => {
    if (selectedVrLessonId && !vrLearningSessionId && !isCreatingRoom) {
      const className = `${classroomNumber}${classroomLetter ? ' ' + classroomLetter : ''}`.trim()
      // Only create room if class name is provided
      if (className) {
        setIsCreatingRoom(true)
        createRoomMutation({ vrLessonId: selectedVrLessonId, className })
      }
    }
  }, [selectedVrLessonId, classroomNumber, classroomLetter, vrLearningSessionId, isCreatingRoom])

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

  const getAvailableDevices = (currentRowId: string): VRDeviceDisplay[] => {
    const selectedSerialNumbers = devices
      .filter((d) => d.id !== currentRowId && d.serialNumber)
      .map((d) => d.serialNumber)
    return activeDevices.filter((device) => !selectedSerialNumbers.includes(device.serialNumber))
  }

  const addDeviceRow = () => {
    if (devices.length < 8) {
      const newId = `device-${Date.now()}`
      setDevices([...devices, { id: newId, deviceId: null, serialNumber: null, studentName: "" }])
    }
  }

  const removeDeviceRow = (id: string) => {
    setDevices(devices.filter((d) => d.id !== id))
  }

  const updateDeviceRow = (id: string, field: "deviceId" | "serialNumber" | "studentName", value: string) => {
    setDevices(devices.map((d) => {
      if (d.id === id) {
        if (field === "deviceId") {
          // Find device by ID and set both deviceId and serialNumber
          const device = activeDevices.find(dev => dev.id === value)
          return { ...d, deviceId: value, serialNumber: device?.serialNumber || null }
        }
        return { ...d, [field]: value }
      }
      return d
    }))
  }

  const classroomName = `${classroomNumber}${classroomLetter ? ' ' + classroomLetter : ''}`.trim()
  const isFormValid =
    classroomNumber.trim() &&
    selectedVrLessonId &&
    devices.length > 0 &&
    devices.every((d) => d.serialNumber && d.studentName)

  const handleSubmit = async () => {
    if (!isFormValid) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc")
      return
    }

    if (!vrLearningSessionId) {
      alert("Vui lòng đợi phòng được tạo trước")
      return
    }

    setIsActivating(true)
    try {
      // Calculate start time and convert to protobuf Timestamp format
      let startDate: Date
      if (startTimeType === "now") {
        startDate = new Date()
      } else {
        // Parse time and create date
        const [hours, minutes] = startTime.split(':')
        startDate = new Date()
        startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0)
      }

      // Convert to protobuf Timestamp format: { seconds, nanos }
      const startTimeAtUtc = {
        seconds: Math.floor(startDate.getTime() / 1000),
        nanos: (startDate.getTime() % 1000) * 1000000
      }

      // Prepare device assignments
      const assignedDeviceSerials = devices
        .filter((d) => d.serialNumber && d.studentName)
        .map((d) => ({
          vr_device_serial_number: d.serialNumber!,
          student_name: d.studentName,
        }))

      // Activate room (room_code is returned here)
      const activateResponse = await activateRoom(
        vrLearningSessionId,
        selectedVrLessonId,
        startTimeAtUtc,
        assignedDeviceSerials
      )
      console.log('Room activated:', activateResponse)

      const roomCode = activateResponse.room_code

      // Show success with room code
      setCreatedSession({ sessionId: vrLearningSessionId, roomCode })
      
      // Store session data in sessionStorage as fallback (in case location.state is lost)
      const sessionData = {
        roomCode,
        sessionId: vrLearningSessionId,
        className: classroomName,
        vrLessonId: selectedVrLessonId
      }
      sessionStorage.setItem(`session_${vrLearningSessionId}`, JSON.stringify(sessionData))
      
      // Navigate to monitoring page with room code and other session data
      navigate(routes.learningSessionMonitoring.replace(':id', vrLearningSessionId), {
        state: sessionData
      })
      
      // Show desktop notification or alert
      if (window.electron?.showNotification) {
        window.electron.showNotification({
          title: 'Phiên học đã được kích hoạt thành công',
          body: `Mã phòng: ${roomCode}`,
        })
      }
    } catch (err: any) {
      console.error('Activate room error:', err)
      alert(`Lỗi khi kích hoạt phiên học: ${err?.message || 'Unknown error'}`)
    } finally {
      setIsActivating(false)
    }
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
              <Select 
                value={selectedVrLessonId} 
                onValueChange={setSelectedVrLessonId}
                disabled={!!vrLearningSessionId}
              >
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
            {isCreatingRoom && (
              <p className="text-xs text-blue-600 mt-1">Đang tạo phòng...</p>
            )}
            {vrLearningSessionId && (
              <p className="text-xs text-green-600 mt-1">Phòng đã được tạo (ID: {vrLearningSessionId.slice(0, 8)}...)</p>
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

          {/* Success Message */}
          {createdSession && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="text-green-600" size={20} />
                <h3 className="text-lg font-semibold text-green-900">Phiên học đã được tạo thành công!</h3>
              </div>
              <div className="mt-2">
                <p className="text-sm text-green-700 mb-1">Mã phòng:</p>
                <p className="text-2xl font-bold text-green-900 font-mono tracking-wider">
                  {createdSession.roomCode}
                </p>
                <p className="text-xs text-green-600 mt-2">Session ID: {createdSession.sessionId}</p>
              </div>
            </div>
          )}

          {/* Play VR Lesson Button */}
          <Button 
            className="w-full bg-[#5B9FD8] hover:bg-[#4A8CC5] gap-2" 
            onClick={handleSubmit}
            disabled={isActivating || !!createdSession || !vrLearningSessionId || isCreatingRoom}
          >
            <Play size={16} />
            {isActivating ? 'Đang kích hoạt phiên học...' : createdSession ? 'Đã kích hoạt phiên học' : !vrLearningSessionId ? 'Đang tạo phòng...' : 'Kích hoạt phiên học VR'}
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
