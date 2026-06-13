<template>
  <div class="mx-auto w-full max-w-4xl space-y-4">
    <header v-if="$slots.header" class="space-y-2">
      <slot name="header" />
    </header>
    <div
      class="rounded-xl border border-border bg-card p-3 ring-1 ring-foreground/10 md:p-4"
    >
      <slot />
    </div>
  </div>
</template>
