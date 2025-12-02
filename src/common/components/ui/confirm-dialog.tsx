import { useState } from "react"
import ReactDOM from "react-dom/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/common/components/ui/dialog"
import { Button } from "@/common/components/ui/button"

export function confirmDialog(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const div = document.createElement("div")
    document.body.appendChild(div)

    const root = ReactDOM.createRoot(div)

    const ConfirmComponent = () => {
      const [open, setOpen] = useState(true)

      const close = (value: boolean) => {
        setOpen(false)
        resolve(value)
        setTimeout(() => {
          root.unmount()
          div.remove()
        }, 200)
      }

      return (
        <Dialog open={open} onOpenChange={() => close(false)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Xác nhận</DialogTitle>
            </DialogHeader>

            <p className="text-neutral-700">{message}</p>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => close(false)}>
                Hủy
              </Button>
              <Button onClick={() => close(true)}>
                Xác nhận
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )
    }

    root.render(<ConfirmComponent />)
  })
}
