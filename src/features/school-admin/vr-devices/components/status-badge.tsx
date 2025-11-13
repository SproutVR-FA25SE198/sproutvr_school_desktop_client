interface StatusBadgeProps {
  status: string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-success/10 text-success border border-success/20"
      case "inactive":
        return "bg-neutral-100 text-neutral-700 border border-neutral-200"
      case "maintenance":
        return "bg-warning/10 text-warning border border-warning/20"
      default:
        return "bg-neutral-100 text-neutral-700 border border-neutral-200"
    }
  }

  return (
    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles(status)}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}
