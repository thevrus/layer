<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import CodeEditor from './CodeEditor.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Maximize2, Minimize2 } from 'lucide-vue-next';
import {
  type Rule,
  getRules,
  saveRule,
  generateId,
  domainToPattern,
} from '@/utils/storage';

const emit = defineEmits<{
  (e: 'showList'): void;
  (e: 'showSettings'): void;
  (e: 'saved'): void;
}>();

const props = defineProps<{
  editRuleId?: string | null;
  expanded?: boolean;
}>();

const activeTab = ref<'css' | 'js'>('css');
const urlPattern = ref('');
const name = ref('');
const css = ref('');
const js = ref('');
const enabled = ref(true);
const currentRuleId = ref<string | null>(null);
const favicon = ref<string | undefined>();
const saved = ref(false);

onMounted(async () => {
  if (props.editRuleId) {
    const rules = await getRules();
    const rule = rules.find((r) => r.id === props.editRuleId);
    if (rule) {
      loadRule(rule);
      return;
    }
  }

  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (tab?.url) {
      const url = new URL(tab.url);
      urlPattern.value = domainToPattern(url.hostname);
      name.value = url.hostname;
      if (tab.favIconUrl) favicon.value = tab.favIconUrl;

      const rules = await getRules();
      const existing = rules.find(
        (r) => r.urlPattern === urlPattern.value,
      );
      if (existing) {
        loadRule(existing);
      }
    }
  } catch {
    // Popup might not have access to tabs
  }
});

function loadRule(rule: Rule) {
  currentRuleId.value = rule.id;
  name.value = rule.name;
  urlPattern.value = rule.urlPattern;
  css.value = rule.css;
  js.value = rule.js;
  enabled.value = rule.enabled;
  favicon.value = rule.favicon;
}

async function handleSave() {
  const rule: Rule = {
    id: currentRuleId.value ?? generateId(),
    name: name.value || urlPattern.value,
    urlPattern: urlPattern.value,
    css: css.value,
    js: js.value,
    enabled: enabled.value,
    favicon: favicon.value,
  };
  await saveRule(rule);
  currentRuleId.value = rule.id;
  saved.value = true;
  emit('saved');
}

function handleExpand() {
  const popupUrl = browser.runtime.getURL('/popup.html');
  const params = new URLSearchParams({ expanded: 'true' });
  if (currentRuleId.value) params.set('ruleId', currentRuleId.value);
  browser.tabs.create({ url: `${popupUrl}?${params}` });
  window.close();
}

async function handleReload() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    await browser.tabs.reload(tab.id);
    window.close();
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center gap-3 px-4 pt-4 pb-1">
      <img
        v-if="favicon"
        :src="favicon"
        class="size-4 shrink-0 rounded-sm"
        @error="favicon = undefined"
      />
      <Input
        v-model="name"
        class="flex-1 border-0 bg-transparent text-foreground text-[15px] font-semibold shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40 px-0 h-auto"
        placeholder="Rule name"
      />
      <Switch v-model="enabled" />
    </div>

    <!-- URL pattern -->
    <div class="px-4 pb-3">
      <Input
        v-model="urlPattern"
        class="font-mono text-xs"
        placeholder="*://*.example.com/*"
      />
    </div>

    <!-- Tabs + Editor -->
    <Tabs v-model="activeTab" class="flex-1 flex flex-col px-4 min-h-0">
      <div class="flex items-center gap-1.5">
        <TabsList class="flex-1">
          <TabsTrigger value="css" class="flex-1">CSS</TabsTrigger>
          <TabsTrigger value="js" class="flex-1">JavaScript</TabsTrigger>
        </TabsList>
        <Button
          variant="ghost"
          size="sm"
          class="text-muted-foreground h-auto px-1.5 py-1.5 shrink-0"
          @click="handleExpand"
          :title="expanded ? 'Close expanded view' : 'Open in expanded view'"
        >
          <Minimize2 v-if="expanded" class="size-3.5" />
          <Maximize2 v-else class="size-3.5" />
        </Button>
      </div>
      <div class="flex-1 flex flex-col border border-border rounded-lg overflow-hidden min-h-0">
        <CodeEditor
          v-show="activeTab === 'css'"
          v-model="css"
          lang="css"
          placeholder="/* Your custom CSS here */"
        />
        <CodeEditor
          v-show="activeTab === 'js'"
          v-model="js"
          lang="js"
          placeholder="// Your custom JavaScript here"
        />
      </div>
    </Tabs>

    <!-- Footer -->
    <div class="flex justify-between items-center px-4 py-3">
      <div class="flex items-center gap-2">
        <Button
          variant="link"
          class="text-muted-foreground px-0"
          @click="emit('showList')"
        >
          All Rules
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="text-muted-foreground h-auto px-1.5 py-1"
          @click="emit('showSettings')"
        >
          <Settings class="size-3.5" />
        </Button>
      </div>
      <Button
        v-if="!saved"
        :disabled="!urlPattern.trim()"
        @click="handleSave"
      >
        Save
      </Button>
      <Button
        v-else
        class="bg-success text-success-foreground hover:bg-success/90"
        @click="handleReload"
      >
        Reload Page
      </Button>
    </div>
  </div>
</template>
