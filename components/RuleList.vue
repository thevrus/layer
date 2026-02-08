<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { type Rule, getRules, saveRule, deleteRule } from '@/utils/storage';
import { ChevronLeft, Plus, Trash2 } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'edit', id: string): void;
  (e: 'newRule'): void;
  (e: 'back'): void;
}>();

const rules = ref<Rule[]>([]);
const deleteDialogOpen = ref(false);
const ruleToDelete = ref<string | null>(null);

onMounted(async () => {
  rules.value = await getRules();
});

async function toggleRule(rule: Rule) {
  rule.enabled = !rule.enabled;
  await saveRule(rule);
}

function confirmDelete(id: string) {
  ruleToDelete.value = id;
  deleteDialogOpen.value = true;
}

async function handleDelete() {
  if (!ruleToDelete.value) return;
  const id = ruleToDelete.value;
  await deleteRule(id);
  rules.value = rules.value.filter((r) => r.id !== id);
  ruleToDelete.value = null;
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
      <span class="text-sm font-semibold text-foreground">All Rules</span>
      <Button size="sm" @click="emit('newRule')">
        <Plus class="size-4" />
        New
      </Button>
    </div>

    <!-- Empty state -->
    <div v-if="rules.length === 0" class="flex-1 flex flex-col items-center justify-center gap-1.5">
      <p class="text-sm text-muted-foreground">No rules yet</p>
      <p class="text-xs text-muted-foreground/60">Create your first rule to start customizing</p>
    </div>

    <!-- Rule list -->
    <div v-else class="flex-1 overflow-y-auto">
      <div
        v-for="rule in rules"
        :key="rule.id"
        class="flex items-center gap-3 px-4 py-3 border-b border-border/50 cursor-pointer transition-colors hover:bg-muted/50"
        @click="emit('edit', rule.id)"
      >
        <img
          v-if="rule.favicon"
          :src="rule.favicon"
          class="size-4 shrink-0 rounded-sm"
        />
        <div class="flex flex-col gap-0.5 min-w-0 flex-1">
          <span class="text-sm font-medium text-foreground truncate">{{ rule.name }}</span>
          <span class="text-xs text-muted-foreground font-mono truncate">{{ rule.urlPattern }}</span>
        </div>
        <div class="flex items-center gap-2 shrink-0" @click.stop>
          <Switch
            :model-value="rule.enabled"
            @update:model-value="toggleRule(rule)"
          />
          <Button
            variant="ghost"
            size="icon-sm"
            class="text-muted-foreground hover:text-destructive"
            @click="confirmDelete(rule.id)"
          >
            <Trash2 class="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
    <AlertDialog v-model:open="deleteDialogOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete rule?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this rule. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            @click="handleDelete"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
