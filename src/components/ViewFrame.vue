<template>
  <main
    class="mx-auto max-w-2xl px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]"
  >
    <header v-if="$slots.header" class="mb-6 space-y-2">
      <slot name="header" />
    </header>
    <div
      class="rounded-xl border border-border bg-card p-4 ring-1 ring-foreground/10"
    >
      <slot />
    </div>
  </main>
</template>
