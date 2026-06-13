<script setup>
import { computed, useId } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  description: { type: String, required: false },
  error: { type: String, required: false },
  required: { type: Boolean, required: false, default: false },
})

const fieldId = useId()
const labelId = `${fieldId}-label`
const descriptionId = computed(() => (props.description ? `${fieldId}-description` : undefined))
const errorId = computed(() => (props.error ? `${fieldId}-error` : undefined))
const ariaDescribedBy = computed(() =>
  [descriptionId.value, errorId.value].filter(Boolean).join(' ') || undefined,
)
const ariaInvalid = computed(() => (props.error ? true : undefined))
</script>

<template>
  <div
    class="flex flex-col gap-1 text-sm"
    role="group"
    :aria-labelledby="labelId"
    :aria-describedby="ariaDescribedBy"
    :aria-invalid="error ? true : undefined"
  >
    <span :id="labelId" class="font-medium leading-none">
      {{ label }}
      <span v-if="required" class="text-destructive" aria-hidden="true"> *</span>
    </span>
    <p
      v-if="description"
      :id="descriptionId"
      class="text-xs text-muted-foreground"
    >
      {{ description }}
    </p>
    <slot
      :field-id="fieldId"
      :aria-describedby="ariaDescribedBy"
      :aria-invalid="ariaInvalid"
    />
    <p
      v-if="error"
      :id="errorId"
      class="text-xs text-destructive"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>
