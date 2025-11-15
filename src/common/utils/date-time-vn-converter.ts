/**
 * Convert datetime string into Vietnamese format, returns formatted string.
 * Example: '2024-01-01T00:00:00+00:00' → '00:00 ngày 1 tháng 1, 2024'
 *
 * @param dateString 
 */
export function formatDateTime(dateString: string | null) {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timePart = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${timePart} ngày ${datePart}`;
};

/**
 * Convert date string into Vietnamese format, returns formatted string.
 * Example: '2024-01-01' → '1 tháng 1, 2024'
 *
 * @param dateString 
 */
export function formatDateOnly(dateString: string | null) {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
}

