import { useLocation } from "react-router-dom"
import { SessionForm } from "../components/session-form"
import type { VrLessonRetrieve } from "@/common/types/vr-lesson.type"

export default function CreateSessionPage() {
    const location = useLocation()
    const vrLesson = (location.state as { vrLesson?: VrLessonRetrieve })?.vrLesson

    return (
        <div className="flex-1 overflow-auto p-8">
            <div className="max-w-6xl mx-auto">
                {/* Form */}
                <SessionForm vrLesson={vrLesson} />
            </div>
        </div>
    )
}
