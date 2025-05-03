<template>
  <div class="text-center pa-4">
    <v-dialog v-model="active" transition="dialog-bottom-transition" fullscreen>
      <v-card>
        <v-toolbar>
          <v-btn icon="mdi-close" @click="active = false"></v-btn>
          <v-toolbar-title>訂單詳細資料</v-toolbar-title>
        </v-toolbar>

        <v-container
          class="d-flex flex-column align-center justify-start"
          style="min-height: 100vh"
          v-if="itemDetail && itemDetail.orderNumber"
        >
          <v-table
            height="auto"
            fixed-header
            class="elevation-1"
            style="
              max-width: 960px;
              width: 100%;
              background-color: white;
              border-radius: 12px;
              overflow: hidden;
            "
          >
            <thead>
              <tr class="orders-detail-table-header-1">
                <th colspan="4">
                  訂單編號: {{ itemDetail.orderNumber }}
                  <span style="margin-left: 2em"
                    >訂購時間: {{ formatDate(itemDetail.createdAt) }}</span
                  >
                </th>
              </tr>
              <tr class="orders-detail-table-header-2">
                <th v-for="(thead, index) in theads" :key="index" class="text-center">
                  {{ thead }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="itemDetail.orderDetailItems.length === 0">
                <td colspan="4" class="text-center">
                  <v-img :src="noDataUrl" width="300" height="300" contain class="mx-auto"></v-img>
                  <div class="mb-4">目前沒有任何資料</div>
                </td>
              </tr>
              <tr v-for="(item, id) in itemDetail.orderDetailItems" :key="id" class="text-center">
                <td>
                  {{ item.bookName }}
                </td>
                <td>
                  {{ item.unitPrice }}
                </td>
                <td>{{ item.quantity }}</td>
                <td>
                  {{ item.unitPrice * item.quantity }}
                </td>
              </tr>
            </tbody>
          </v-table>
          <v-divider class="my-6" style="width: 100%; max-width: 960px"></v-divider>
          <v-container max-width="960px" class="pa-0">
            <v-row>
              <v-col cols="12">
                <div class="order-details-card">
                  <v-row>
                    <!-- 左欄：資訊列表 -->
                    <v-col cols="12" md="6">
                      <div class="info-section">
                        <template v-if="props.isReadonly">
                          <div class="info-item">
                            <span class="label">訂單狀態：</span
                            >{{ OrderStatusUtils.getLabel(itemDetail.orderStatus) }}
                          </div>
                          <div class="info-item">
                            <span class="label">付款狀態：</span
                            >{{ PaymentStatusUtils.getLabel(itemDetail.paymentStatus) }}
                          </div>
                          <div class="info-item">
                            <span class="label">付款方式：</span
                            >{{ PaymentMethodUtils.getLabel(itemDetail.paymentMethod) }}
                          </div>
                          <div class="info-item">
                            <span class="label">配送方式：</span
                            >{{ ShippingMethodUtils.getLabel(itemDetail.shippingMethod) }}
                          </div>
                        </template>
                        <template v-else>
                          <div
                            v-for="field in selectFields"
                            :key="field.key"
                            class="info-item"
                            style="display: flex; align-items: center"
                          >
                            <span class="label" style="margin-right: 10px"
                              >{{ field.label }}：</span
                            >
                            <v-select
                              density="compact"
                              :items="field.items"
                              v-model="itemDetail[field.key as keyof typeof itemDetail]"
                              item-title="title"
                              item-value="value"
                              style="width: 150px; display: flex; align-items: center"
                              :disabled="
                                field.key === 'paymentMethod' || field.key === 'shippingMethod'
                              "
                            />
                          </div>
                        </template>

                        <div class="info-item">
                          <span class="label">配送地址：</span>{{ itemDetail.shippingAddress }}
                        </div>
                        <div class="info-item">
                          <span class="label">配送備註：</span>{{ itemDetail.shippingNote }}
                        </div>
                        <div class="info-item">
                          <span class="label">會員編號：</span>{{ itemDetail.memberId }}
                        </div>
                        <div class="info-item">
                          <span class="label">會員信箱：</span>{{ itemDetail.memberEmail }}
                        </div>
                      </div>
                    </v-col>

                    <!-- 右欄：金額 -->
                    <v-col
                      cols="12"
                      md="6"
                      class="d-flex flex-column justify-space-between align-end"
                    >
                      <!-- 上半：金額資訊 -->
                      <div class="amount-section text-right">
                        <div class="amount-label">金額小計</div>
                        <div class="amount-value">NT$ {{ 100 }} 元</div>
                      </div>

                      <!-- 下半：按鈕 -->
                      <div v-if="!props.isReadonly" class="mt-4">
                        <v-btn color="red" size="large" class="me-2" @click="active = false"
                          >取消</v-btn
                        >
                        <v-btn color="primary" size="large" @click="handleEdit">修改</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>
<script setup lang="ts">
import noDataUrl from '@/assets/no-data.svg'
import { DateUtils } from '@/utils/TimeUtils'
import {
  OrderStatusUtils,
  PaymentStatusUtils,
  PaymentMethodUtils,
  ShippingMethodUtils,
} from '@/api/enums'
import type { OrderDetail } from '@/api/types'
import { type PropType } from 'vue'

const theads = ['商品名稱', '單價', '數量', '商品總額']

const active = defineModel<boolean>('active')
const itemDetail = defineModel<OrderDetail>('order-detail')
const props = defineProps({
  isReadonly: {
    type: Boolean,
    default: true,
  },
  selectFields: {
    type: Array as PropType<
      {
        key: string
        label: string
        items: { title: string; value: number }[]
      }[]
    >,
    default: () => [],
  },
})
const emit = defineEmits(['onEdit'])

const handleEdit = () => {
  emit('onEdit')
}

const formatDate = (dateStr: string) => {
  return DateUtils.formatDate(dateStr)
}
</script>

<style scoped>
.v-table.v-table--fixed-header
  > .v-table__wrapper
  > table
  > thead
  > tr.orders-detail-table-header-1
  > th {
  background-color: #f6f6f6;
  color: #8a8a8a;
}

.v-table.v-table--fixed-header
  > .v-table__wrapper
  > table
  > thead
  > tr.orders-detail-table-header-2
  > th {
  background-color: #f6f6f6;
  color: #2a2a2a;
}

.order-details-card {
  background-color: #f9fbff;
  border: 1px solid #d1e3ff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(33, 103, 197, 0.05);
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  font-size: 16px;
  color: #1a1a1a;
}

.label {
  font-weight: 600;
  color: #1d4fa5;
}

.amount-section {
  text-align: right;
  padding-top: 8px;
}

.amount-label {
  font-size: 20px;
  font-weight: 500;
  color: #1d4fa5;
}

.amount-value {
  font-size: 28px;
  font-weight: bold;
  color: #1976d2;
  margin-top: 8px;
}
</style>
