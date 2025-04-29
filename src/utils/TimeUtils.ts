export const DateUtils = {
  formatDate(dateStr: string): string {
    // 解析原始日期
    const date = new Date(dateStr)

    // 調整為 UTC+8 時區
    // 直接 + 8 小時，是無法處理夏令時間
    date.setHours(date.getHours() + 8)

    // 格式化日期為 YYYY/MM/DD HH:mm:ss 格式
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
  },
}
