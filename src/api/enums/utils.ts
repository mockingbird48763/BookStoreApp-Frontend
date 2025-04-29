import type { StatusDetail } from './type'

// 枚舉本質是 number
export const StatusUtils = <T extends number>(details: Record<T, StatusDetail>) => {
  return {
    getLabel(status: T): string {
      return details[status]?.label ?? '未知狀態'
    },

    getIcon(status: T): string {
      return details[status]?.icon ?? 'mdi-cancel'
    },

    getColor(status: T): string {
      return details[status]?.color ?? 'grey'
    },
  }
}
