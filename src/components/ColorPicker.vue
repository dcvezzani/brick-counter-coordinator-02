<script setup>
import { computed, ref } from 'vue'
import FilterablePicker from '@/components/FilterablePicker.vue'
import { defaultContainsFilter } from '@/lib/filterable-picker'
import { colorSwatch } from '@/lib/bricklink-colors'
import { cn } from '@/lib/utils'

const props = defineProps({
  colors: {
    type: Array,
    default: () => [],
  },
  modelValue: { type: Number, default: null },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'tabForward', 'tabBackward'])

const pickerRef = ref(null)

const options = computed(() =>
  props.colors.map((color) => ({
    value: color.id,
    label: `${color.name} (${color.id})`,
    data: color,
  })),
)

const isDisabled = computed(() => props.disabled || props.colors.length === 0)

function focus() {
  pickerRef.value?.focusTrigger()
}

function focusFilter() {
  pickerRef.value?.focusFilter()
}

defineExpose({ focus, focusFilter })
</script>

<template>
  <div data-testid="lot-entry-color">
    <FilterablePicker
      ref="pickerRef"
      :model-value="modelValue"
      :options="options"
      :filter-options="defaultContainsFilter"
      :disabled="isDisabled"
      allow-none
      placeholder="Select color"
      empty-placeholder="Select a part first"
      filter-placeholder="Filter colors"
      empty-filter-message="No colors match"
      test-id="color-picker"
      @update:model-value="emit('update:modelValue', $event)"
      @tab-forward="emit('tabForward')"
      @tab-backward="emit('tabBackward')"
    >
      <template #trigger-leading="{ selected }">
        <span
          data-testid="color-picker-trigger-swatch"
          :class="
            cn(
              'size-5 shrink-0 rounded-sm border',
              !selected && 'border-dashed border-muted-foreground/50',
            )
          "
          :style="{ backgroundColor: selected ? colorSwatch(selected.data) : undefined }"
          aria-hidden="true"
        />
      </template>
      <template #option-leading="{ option }">
        <span
          class="size-4 shrink-0 rounded-sm border border-border/60"
          :style="{ backgroundColor: colorSwatch(option.data) }"
          aria-hidden="true"
        />
      </template>
      <template #none-leading>
        <span
          class="size-4 shrink-0 rounded-sm border border-dashed border-muted-foreground/50"
          aria-hidden="true"
        />
      </template>
    </FilterablePicker>
  </div>
</template>
