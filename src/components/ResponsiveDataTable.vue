<script setup>
import { useSlots } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  columns: { type: Array, required: true },
  rowKey: { type: [String, Function], default: 'id' },
})

const slots = useSlots()

function resolveRowKey(item, index) {
  if (typeof props.rowKey === 'function') return props.rowKey(item, index)
  return item?.[props.rowKey] ?? index
}

function cellValue(item, column) {
  if (typeof column.accessor === 'function') return column.accessor(item)
  return item?.[column.key]
}

function hasCellSlot(key) {
  return Boolean(slots[`cell-${key}`])
}

function hasMobileSlot() {
  return Boolean(slots.mobile)
}
</script>

<template>
  <div class="hidden overflow-x-auto rounded-md border border-border md:block">
    <table class="w-full text-sm">
      <thead class="border-b border-border bg-muted/50 text-left">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-3 py-2 font-medium"
            :class="column.headerClass"
          >
            {{ column.header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="resolveRowKey(item, index)"
          class="border-b border-border last:border-0"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-3 py-2"
            :class="column.cellClass"
          >
            <slot
              v-if="hasCellSlot(column.key)"
              :name="`cell-${column.key}`"
              :item="item"
              :value="cellValue(item, column)"
              :index="index"
            />
            <template v-else>{{ cellValue(item, column) }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <ul class="space-y-2 md:hidden" role="list">
    <li
      v-for="(item, index) in items"
      :key="resolveRowKey(item, index)"
      class="rounded-md border border-border p-3 text-sm"
    >
      <slot v-if="hasMobileSlot()" name="mobile" :item="item" :index="index" />
      <template v-else>
        <p v-for="column in columns" :key="column.key" class="leading-snug">
          <span class="text-muted-foreground">{{ column.header }}: </span>
          <span class="font-medium">{{ cellValue(item, column) }}</span>
        </p>
      </template>
    </li>
  </ul>
</template>
