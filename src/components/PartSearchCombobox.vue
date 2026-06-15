<script setup>
import { computed, ref } from 'vue'
import FilterablePicker from '@/components/FilterablePicker.vue'
import { lookupPart, resolvePartId, searchParts } from '@/lib/part-catalog'

const props = defineProps({
  modelValue: { type: String, default: '' },
  session: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue', 'select', 'tabForward', 'tabBackward'])

const pickerRef = ref(null)

const partOptions = computed(() =>
  searchParts('', { session: props.session }).map((part) => ({
    value: part.partId,
    label: part.partId,
    data: part,
  })),
)

const resolvedName = computed(() => {
  if (!props.modelValue) {
    return ''
  }
  return lookupPart(props.modelValue)?.name ?? ''
})

function filterPartOptions(query, options) {
  return searchParts(query.trim(), { session: props.session }).map((part) => ({
    value: part.partId,
    label: part.partId,
    data: part,
  }))
}

function onUpdate(value) {
  const resolved = value == null || value === '' ? '' : resolvePartId(String(value)) ?? String(value)
  emit('update:modelValue', resolved)
}

function onSelect(option) {
  if (option?.partId) {
    emit('select', option)
  }
}

function onClose({ filterQuery, fromSelection }) {
  if (fromSelection) {
    return
  }
  const resolved = resolvePartId(filterQuery)
  if (resolved) {
    emit('update:modelValue', resolved)
    const part = lookupPart(resolved)
    if (part) {
      emit('select', { ...part, source: 'catalog' })
    }
  }
}

function focus() {
  pickerRef.value?.focusFilter()
}

defineExpose({ focus })
</script>

<template>
  <div class="flex flex-col gap-2" data-testid="lot-entry-part">
    <span
      v-if="resolvedName"
      class="text-muted-foreground text-xs"
      data-testid="part-search-resolved"
    >
      {{ resolvedName }}
    </span>
    <FilterablePicker
      ref="pickerRef"
      :model-value="modelValue"
      :options="partOptions"
      :filter-options="filterPartOptions"
      :min-filter-chars="2"
      test-id="part-search"
      placeholder="Search parts…"
      filter-placeholder="Filter parts…"
      empty-filter-message="No parts match"
      @update:model-value="onUpdate"
      @select="onSelect"
      @close="onClose"
      @tab-forward="emit('tabForward')"
      @tab-backward="emit('tabBackward')"
    >
      <template #option-label="{ option }">
        <span class="font-medium">{{ option.value }}</span>
        <span class="text-muted-foreground text-xs">{{ option.data?.name }}</span>
      </template>
    </FilterablePicker>
  </div>
</template>
