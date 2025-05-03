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

// 提供 select 使用的 options
export const createOptionsFromDetails = <T extends Record<number, { label: string }>>(
  details: T,
): Array<{ title: string; value: number }> => {
  return Object.entries(details).map(([key, detail]) => ({
    title: detail.label,
    value: Number(key),
  }))
}
