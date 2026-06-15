<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { defaultPrefixFilter, findPickerOption } from '@/lib/filterable-picker'

const props = defineProps({
  modelValue: { type: [String, Number], default: null },
  options: { type: Array, default: () => [] },
  filterOptions: { type: Function, default: null },
  disabled: { type: Boolean, default: false },
  allowNone: { type: Boolean, default: false },
  noneLabel: { type: String, default: 'None' },
  placeholder: { type: String, default: 'Select…' },
  emptyPlaceholder: { type: String, default: 'No options available' },
  filterPlaceholder: { type: String, default: 'Filter…' },
  emptyFilterMessage: { type: String, default: 'No matches for' },
  debounceMs: { type: Number, default: 150 },
  minFilterChars: { type: Number, default: 0 },
  minFilterCharsHint: {
    type: String,
    default: 'Type at least {n} characters to search',
  },
  testId: { type: String, default: 'filterable-picker' },
})

const emit = defineEmits([
  'update:modelValue',
  'select',
  'close',
  'tabForward',
  'tabBackward',
])

const isOpen = ref(false)
const filterQuery = ref('')
const debouncedQuery = ref('')
const rootRef = ref(null)
const triggerRef = ref(null)
const filterInputRef = ref(null)
let debounceTimer = null

const isDisabled = computed(() => props.disabled || props.options.length === 0)

const selected = computed(() => findPickerOption(props.options, props.modelValue))

const triggerLabel = computed(() => {
  if (selected.value) return selected.value.label
  if (props.options.length === 0) return props.emptyPlaceholder
  return props.placeholder
})

const visibleOptions = computed(() => {
  if (
    props.minFilterChars > 0 &&
    debouncedQuery.value.trim().length < props.minFilterChars
  ) {
    return []
  }

  if (filterQuery.value !== debouncedQuery.value) {
    return []
  }

  if (props.filterOptions) {
    return props.filterOptions(debouncedQuery.value, props.options)
  }

  return defaultPrefixFilter(props.options, debouncedQuery.value)
})

const showMinCharsHint = computed(
  () =>
    props.minFilterChars > 0 &&
    debouncedQuery.value.trim().length < props.minFilterChars,
)

watch(filterQuery, (query) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = query
  }, props.debounceMs)
})

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})

function focusFilterInput() {
  const element = filterInputRef.value?.$el
  if (element instanceof HTMLInputElement) {
    element.focus()
    return
  }

  element?.querySelector?.('input')?.focus()
}

function openPanel() {
  if (isDisabled.value) return
  isOpen.value = true
  nextTick(() => focusFilterInput())
}

function closePanel(fromSelection = false) {
  if (!isOpen.value) return
  isOpen.value = false
  emit('close', { filterQuery: filterQuery.value, fromSelection })
}

function selectOption(option) {
  emit('update:modelValue', option.value)
  emit('select', option.data ?? option)
  closePanel(true)
}

function selectNone() {
  emit('update:modelValue', null)
  emit('select', null)
  closePanel(true)
}

function onTriggerClick() {
  if (isDisabled.value) return
  if (isOpen.value) closePanel()
  else openPanel()
}

function onTriggerFocus() {
  if (!isDisabled.value && !isOpen.value) openPanel()
}

function onFilterKeydown(event) {
  if (event.key === 'Enter') {
    event.preventDefault()
    if (visibleOptions.value.length > 0) {
      selectOption(visibleOptions.value[0])
    }
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closePanel()
    return
  }

  if (event.key === 'Tab') {
    closePanel()
    if (event.shiftKey) emit('tabBackward')
    else emit('tabForward')
  }
}

function onFocusOut(event) {
  if (!isOpen.value) return
  const related = event.relatedTarget
  if (related && rootRef.value?.contains(related)) return
  closePanel()
}

function focusTrigger() {
  triggerRef.value?.focus()
  openPanel()
}

function focusFilter() {
  openPanel()
  nextTick(() => focusFilterInput())
}

defineExpose({ focusTrigger, focusFilter })
</script>

<template>
  <div
    ref="rootRef"
    class="relative w-full"
    :data-testid="testId"
    @focusout="onFocusOut"
  >
    <button
      ref="triggerRef"
      type="button"
      class="border-input bg-background hover:bg-accent hover:text-accent-foreground flex min-h-11 w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm"
      :data-testid="`${testId}-trigger`"
      :disabled="isDisabled"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="onTriggerClick"
      @focus="onTriggerFocus"
    >
      <slot name="trigger-leading" :selected="selected" />
      <span class="flex-1 truncate">
        <slot name="trigger-label" :selected="selected" :label="triggerLabel">
          {{ triggerLabel }}
        </slot>
      </span>
    </button>

    <div
      v-if="isOpen"
      class="bg-popover text-popover-foreground absolute top-full z-50 mt-1 w-full rounded-lg border p-2 shadow-md"
      :data-testid="`${testId}-panel`"
      role="listbox"
    >
      <Input
        ref="filterInputRef"
        v-model="filterQuery"
        class="mb-2"
        :placeholder="filterPlaceholder"
        :data-testid="`${testId}-filter`"
        @keydown="onFilterKeydown"
      />

      <div class="max-h-40 overflow-y-auto" :data-testid="`${testId}-list`">
        <p
          v-if="showMinCharsHint"
          class="text-muted-foreground px-2 py-1 text-sm"
          :data-testid="`${testId}-min-chars`"
        >
          {{ minCharsHint }}
        </p>

        <p
          v-else-if="options.length > 0 && visibleOptions.length === 0"
          class="text-muted-foreground px-2 py-1 text-sm"
          :data-testid="`${testId}-empty`"
        >
          {{ emptyFilterMessage }}
          <span v-if="debouncedQuery">"{{ debouncedQuery }}"</span>
        </p>

        <button
          v-if="allowNone"
          type="button"
          class="hover:bg-accent flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm"
          :data-testid="`${testId}-none`"
          role="option"
          :aria-selected="modelValue === null"
          @mousedown.prevent
          @click="selectNone"
        >
          <slot name="none-leading" />
          <span>{{ noneLabel }}</span>
        </button>

        <button
          v-for="(option, index) in visibleOptions"
          :key="option.value"
          type="button"
          :class="
            cn(
              'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm',
              index === 0 ? 'bg-accent' : 'hover:bg-accent',
            )
          "
          :data-testid="`${testId}-option-${option.value}`"
          role="option"
          :aria-selected="option.value === modelValue"
          @mousedown.prevent
          @click="selectOption(option)"
        >
          <slot name="option-leading" :option="option" />
          <span>
            <slot name="option-label" :option="option">
              {{ option.label }}
            </slot>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
