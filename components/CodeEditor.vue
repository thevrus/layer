<script lang="ts" setup>
import { ref, onMounted, watch, shallowRef } from 'vue';
import { EditorView, placeholder as cmPlaceholder, keymap } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { indentWithTab } from '@codemirror/commands';
import { basicSetup } from 'codemirror';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

const props = defineProps<{
  modelValue: string;
  lang: 'css' | 'js';
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const container = ref<HTMLDivElement>();
const view = shallowRef<EditorView>();

onMounted(() => {
  if (!container.value) return;

  const state = EditorState.create({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      props.lang === 'css' ? css() : javascript(),
      oneDark,
      keymap.of([indentWithTab]),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          emit('update:modelValue', update.state.doc.toString());
        }
      }),
      EditorView.theme({
        '&': { height: '100%', fontSize: '12px' },
        '.cm-scroller': { overflow: 'auto' },
        '.cm-content': { fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', 'Consolas', monospace" },
        '.cm-gutters': { border: 'none' },
        '&.cm-focused': { outline: 'none' },
      }),
      props.placeholder ? cmPlaceholder(props.placeholder) : [],
    ].flat(),
  });

  view.value = new EditorView({ state, parent: container.value });
});

// Sync external changes into the editor
watch(() => props.modelValue, (val) => {
  if (!view.value) return;
  const current = view.value.state.doc.toString();
  if (val !== current) {
    view.value.dispatch({
      changes: { from: 0, to: current.length, insert: val },
    });
  }
});
</script>

<template>
  <div ref="container" class="flex-1 min-h-0 overflow-hidden" />
</template>
