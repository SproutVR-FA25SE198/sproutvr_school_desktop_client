import { useLocation } from "react-router-dom"
import { SessionForm } from "../components/session-form"
import type { VrLessonRetrieve } from "@/common/types/vr-lesson.type"

export default function CreateSessionPage() {
    const location = useLocation()
    const state = location.state as { 
        vrLesson?: VrLessonRetrieve
        lessonId?: string
    }
    const vrLesson = state?.vrLesson
    const lessonId = state?.lessonId

    return (
        <div className="flex-1 overflow-auto p-8">
            <div className="max-w-6xl mx-auto">
                <SessionForm vrLesson={vrLesson} lessonId={lessonId} />
            </div>
        </div>
    )
}
