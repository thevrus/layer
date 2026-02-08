<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import RuleEditor from '@/components/RuleEditor.vue';
import RuleList from '@/components/RuleList.vue';
import Settings from '@/components/Settings.vue';
import { getTheme, applyTheme } from '@/utils/storage';

const view = ref<'editor' | 'list' | 'settings'>('editor');
const editRuleId = ref<string | null>(null);

const params = new URLSearchParams(window.location.search);
const expanded = params.has('expanded');
const paramRuleId = params.get('ruleId');
if (paramRuleId) editRuleId.value = paramRuleId;

onMounted(async () => {
  const theme = await getTheme();
  applyTheme(theme);
  if (expanded) {
    document.getElementById('app')?.classList.add('expanded');
  }
});

function showList() {
  view.value = 'list';
}

function showEditor(ruleId?: string | null) {
  editRuleId.value = ruleId ?? null;
  view.value = 'editor';
}

function showSettings() {
  view.value = 'settings';
}
</script>

<template>
  <div class="flex flex-col" :class="expanded ? 'w-full h-screen' : 'w-[420px] h-[460px]'">
    <RuleEditor
      v-if="view === 'editor'"
      :key="editRuleId ?? 'new'"
      :editRuleId="editRuleId"
      :expanded="expanded"
      @showList="showList"
      @showSettings="showSettings"
      @saved="() => {}"
    />
    <RuleList
      v-else-if="view === 'list'"
      @edit="(id) => showEditor(id)"
      @newRule="showEditor(null)"
      @back="showEditor()"
    />
    <Settings
      v-else-if="view === 'settings'"
      @back="showEditor()"
    />
  </div>
</template>
