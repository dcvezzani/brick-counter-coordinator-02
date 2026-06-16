<script setup>
import { computed, ref } from 'vue'
import { Label } from '@/components/ui/label'
import FilterablePicker from '@/components/FilterablePicker.vue'
import { lookupSet, resolveSetNumber, searchSets } from '@/lib/set-catalog'

const props = defineProps({
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue', 'select', 'tabForward', 'tabBackward'])

const pickerRef = ref(null)

const setOptions = computed(() =>
  searchSets('').map((set) => ({
    value: set.setNumber,
    label: set.setNumber,
    data: set,
  })),
)

const resolvedSet = computed(() => lookupSet(props.modelValue))

function filterSetOptions(query) {
  return searchSets(query.trim()).map((set) => ({
    value: set.setNumber,
    label: set.setNumber,
    data: set,
  }))
}

function onUpdate(value) {
  if (value == null) {
    emit('update:modelValue', '')
    return
  }
  const resolved = resolveSetNumber(String(value))
  emit('update:modelValue', resolved ?? '')
}

function onSelect(option) {
  if (!option) return
  const set = option.data ?? option
  emit('select', set)
}

function onClose({ filterQuery, fromSelection }) {
  if (fromSelection) return
  const raw = filterQuery?.trim() || props.modelValue
  const resolved = resolveSetNumber(raw)
  if (!resolved) return
  emit('update:modelValue', resolved)
  const set = lookupSet(resolved)
  if (set) emit('select', set)
}

function focus() {
  pickerRef.value?.focusFilter()
}

defineExpose({ focus })
</script>

<template>
  <div class="flex flex-col gap-2">
    <Label>
      Set number
      <span
        v-if="resolvedSet"
        class="text-muted-foreground text-xs"
        data-testid="set-search-resolved"
      >
        {{ resolvedSet.name }}
      </span>
    </Label>
    <p class="text-xs text-muted-foreground">
      Search by set number or name.
    </p>
    <FilterablePicker
      ref="pickerRef"
      :model-value="modelValue || null"
      :options="setOptions"
      :filter-options="filterSetOptions"
      :min-filter-chars="2"
      placeholder="Search sets…"
      filter-placeholder="Filter sets"
      empty-filter-message="No sets match"
      test-id="set-search"
      @update:model-value="onUpdate"
      @select="onSelect"
      @close="onClose"
      @tab-forward="emit('tabForward')"
      @tab-backward="emit('tabBackward')"
    >
      <template #option-label="{ option }">
        <span class="block font-medium">{{ option.data.setNumber }}</span>
        <span class="text-muted-foreground block text-xs">{{ option.data.name }}</span>
      </template>
    </FilterablePicker>
  </div>
</template>
