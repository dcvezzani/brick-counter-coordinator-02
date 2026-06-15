<script setup>
import { computed, ref } from 'vue'
import FilterablePicker from '@/components/FilterablePicker.vue'
import { colorSwatch } from '@/lib/bricklink-colors'
import { defaultContainsFilter, findPickerOption } from '@/lib/filterable-picker'
import { cn } from '@/lib/utils'

const props = defineProps({
  colors: { type: Array, default: () => [] },
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

const selected = computed(() => findPickerOption(options.value, props.modelValue))

const isDisabled = computed(
  () => props.disabled || props.colors.length === 0,
)

function focus() {
  pickerRef.value?.focusTrigger()
}

function focusFilter() {
  pickerRef.value?.focusFilter()
}

defineExpose({ focus, focusFilter })
</script>

<template>
  <FilterablePicker
    ref="pickerRef"
    :model-value="modelValue"
    :options="options"
    :filter-options="(query, opts) => defaultContainsFilter(opts, query)"
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
    <template #trigger-leading="{ selected: selectedOption }">
      <span
        class="size-5 shrink-0 rounded-full border"
        :class="cn(!selectedOption && 'border-dashed')"
        :data-testid="'color-picker-trigger-swatch'"
        :style="{ backgroundColor: colorSwatch(selectedOption?.data) }"
      />
    </template>

    <template #option-leading="{ option }">
      <span
        class="size-4 shrink-0 rounded-full border"
        :style="{ backgroundColor: colorSwatch(option.data) }"
      />
    </template>

    <template #none-leading>
      <span class="size-4 shrink-0 rounded-full border border-dashed" />
    </template>
  </FilterablePicker>
</template>
