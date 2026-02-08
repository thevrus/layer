<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-vue-next';
import { type Theme, getTheme, setTheme, applyTheme } from '@/utils/storage';

const emit = defineEmits<{
  (e: 'back'): void;
}>();

const theme = ref<Theme>('dark');

const options: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

onMounted(async () => {
  theme.value = await getTheme();
});

async function selectTheme(value: Theme) {
  theme.value = value;
  applyTheme(value);
  await setTheme(value);
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-border">
      <Button variant="ghost" size="sm" @click="emit('back')">
        <ChevronLeft class="size-4" />
        Back
      </Button>
      <span class="text-sm font-semibold text-foreground">Settings</span>
      <div class="w-16" />
    </div>

    <!-- Settings content -->
    <div class="flex-1 overflow-y-auto p-4">
      <div class="space-y-4">
        <!-- Theme -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">Theme</label>
          <div class="flex gap-2">
            <button
              v-for="opt in options"
              :key="opt.value"
              class="flex-1 rounded-md border px-3 py-2 text-sm transition-colors"
              :class="theme === opt.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-transparent text-muted-foreground hover:bg-muted'"
              @click="selectTheme(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
