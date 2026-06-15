<script setup>
import { computed, ref, watch } from 'vue'
import ColorPicker from '@/components/ColorPicker.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import FormField from '@/components/FormField.vue'
import PartSearchCombobox from '@/components/PartSearchCombobox.vue'
import { Button } from '@/components/ui/button'
import { showSuccessToast } from '@/lib/feedback'
import { toPickerColors } from '@/lib/bricklink-colors'
import {
  conditionDisplayLabel,
  isConditionChoosable,
  isConditionReadOnly,
  resolveDefaultLotCondition,
} from '@/lib/lot-entry-defaults'
import { getColorsForPart } from '@/lib/part-catalog'
import { saveLot } from '@/lib/storyboard-session'

const props = defineProps({
  sessionId: { type: String, required: true },
  session: { type: Object, required: true },
})

const emit = defineEmits(['saved'])

const partId = ref('')
const colorId = ref(null)
const condition = ref(resolveDefaultLotCondition(props.session))
const qty = ref(1)

const partError = ref('')
const colorError = ref('')
const qtyError = ref('')

const duplicateOpen = ref(false)
const pendingSave = ref(null)
const pendingExistingQty = ref(0)
const saveAndAddAnother = ref(false)

const partSearchRef = ref(null)
const colorPickerRef = ref(null)

const pickerColors = computed(() =>
  partId.value
    ? toPickerColors(getColorsForPart(partId.value, { session: props.session }))
    : [],
)

const conditionReadOnly = computed(() => isConditionReadOnly(props.session))
const conditionChoosable = computed(() => isConditionChoosable(props.session))

const duplicateDescription = computed(() => {
  if (!pendingSave.value) {
    return ''
  }
  return `This part, color, and condition already has ${pendingExistingQty.value} counted. Add ${pendingSave.value.qty} more?`
})

watch(partId, () => {
  colorId.value = null
})

function clearErrors() {
  partError.value = ''
  colorError.value = ''
  qtyError.value = ''
}

function validate() {
  clearErrors()
  let valid = true

  if (!partId.value) {
    partError.value = 'Part is required'
    valid = false
  }
  if (colorId.value == null) {
    colorError.value = 'Color is required'
    valid = false
  }
  if (qty.value < 1) {
    qtyError.value = 'Quantity must be at least 1'
    valid = false
  }

  return valid
}

function resetForm() {
  partId.value = ''
  colorId.value = null
  qty.value = 1
  condition.value = resolveDefaultLotCondition(props.session)
  clearErrors()
}

function buildPayload() {
  return {
    partId: partId.value,
    colorId: colorId.value,
    condition: condition.value,
    qty: qty.value,
  }
}

function finishSave(result) {
  const message = result.merged ? 'Lot updated' : 'Lot saved'
  showSuccessToast(message)
  emit('saved', { lot: result.lot, merged: result.merged ?? false })

  if (saveAndAddAnother.value) {
    resetForm()
    partSearchRef.value?.focus()
  }

  saveAndAddAnother.value = false
}

async function performSave(mergeDuplicate = false) {
  const payload = { ...buildPayload(), ...(mergeDuplicate ? { mergeDuplicate: true } : {}) }
  const result = saveLot(props.sessionId, payload)

  if (result.duplicate) {
    pendingSave.value = buildPayload()
    pendingExistingQty.value = result.existing?.qty ?? 0
    duplicateOpen.value = true
    return
  }

  finishSave(result)
}

function onSave(addAnother = false) {
  saveAndAddAnother.value = addAnother
  if (!validate()) {
    saveAndAddAnother.value = false
    return
  }
  performSave()
}

function onDuplicateConfirm() {
  duplicateOpen.value = false
  if (pendingSave.value) {
    performSave(true)
    pendingSave.value = null
  }
}

function onDuplicateCancel() {
  duplicateOpen.value = false
  pendingSave.value = null
  saveAndAddAnother.value = false
}

function decrementQty() {
  if (qty.value > 1) {
    qty.value -= 1
  }
}

function incrementQty() {
  qty.value += 1
}

function onTabForwardFromPart() {
  colorPickerRef.value?.focusFilter()
}

function focusPart() {
  partSearchRef.value?.focus()
}

defineExpose({ focusPart, reset: resetForm })
</script>

<template>
  <form
    class="space-y-4"
    data-testid="lot-entry-form"
    @submit.prevent
  >
    <FormField label="Part" :error="partError" required>
      <PartSearchCombobox
        ref="partSearchRef"
        v-model="partId"
        :session="session"
        @tab-forward="onTabForwardFromPart"
      />
    </FormField>

    <FormField label="Color" :error="colorError" required>
      <ColorPicker
        ref="colorPickerRef"
        v-model="colorId"
        :colors="pickerColors"
      />
    </FormField>

    <FormField label="Condition">
      <p
        v-if="conditionReadOnly"
        class="min-h-11 flex items-center text-sm"
        data-testid="lot-entry-condition-readonly"
      >
        {{ conditionDisplayLabel(condition) }}
      </p>
      <div v-else-if="conditionChoosable" class="flex gap-2">
        <Button
          type="button"
          data-testid="lot-entry-condition-new"
          class="min-h-11 flex-1"
          :variant="condition === 'N' ? 'default' : 'outline'"
          :aria-pressed="condition === 'N'"
          @click="condition = 'N'"
        >
          New
        </Button>
        <Button
          type="button"
          data-testid="lot-entry-condition-used"
          class="min-h-11 flex-1"
          :variant="condition === 'U' ? 'default' : 'outline'"
          :aria-pressed="condition === 'U'"
          @click="condition = 'U'"
        >
          Used
        </Button>
      </div>
    </FormField>

    <FormField label="Quantity" :error="qtyError" required>
      <div class="flex items-center justify-center gap-3">
        <Button
          type="button"
          variant="outline"
          class="min-h-11 min-w-11"
          data-testid="lot-entry-qty-minus"
          aria-label="Decrease quantity"
          :disabled="qty <= 1"
          @click="decrementQty"
        >
          −
        </Button>
        <span
          class="text-2xl font-semibold tabular-nums"
          data-testid="lot-entry-qty"
          aria-live="polite"
        >
          {{ qty }}
        </span>
        <Button
          type="button"
          variant="outline"
          class="min-h-11 min-w-11"
          data-testid="lot-entry-qty-plus"
          aria-label="Increase quantity"
          @click="incrementQty"
        >
          +
        </Button>
      </div>
    </FormField>

    <div class="flex gap-2">
      <Button
        type="button"
        class="min-h-11 flex-1"
        data-testid="lot-entry-save"
        @click="onSave(false)"
      >
        Save
      </Button>
      <Button
        type="button"
        variant="outline"
        class="min-h-11 flex-1"
        data-testid="lot-entry-save-add"
        @click="onSave(true)"
      >
        Save and add another
      </Button>
    </div>

    <div v-if="duplicateOpen" data-testid="lot-entry-duplicate-confirm">
      <ConfirmDialog
        v-model:open="duplicateOpen"
        title="Lot already exists"
        :description="duplicateDescription"
        cancel-label="Cancel"
        confirm-label="Add to lot"
        @confirm="onDuplicateConfirm"
        @cancel="onDuplicateCancel"
      />
    </div>
  </form>
</template>
