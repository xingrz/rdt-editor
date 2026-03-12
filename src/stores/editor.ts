import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { debounce } from 'radash';

import type ISelection from '@/types/selection';

const PREFIX = 'rdt-editor:';

function getItem(key: string): string | null {
  return localStorage.getItem(PREFIX + key) ?? localStorage.getItem(key);
}

function setItem(key: string, value: string): void {
  localStorage.setItem(PREFIX + key, value);
}

const debouncedSetItem = debounce({ delay: 200 }, setItem);

const EXAMPLE = `KBHFa~~Redmond
STR
\\ABZgl\STRq\KBHFeq~~Bellevue
STR
STR
HST~~Mercer Island
STR
tSTRa
tSTRe
STR
BHF~~International District
STR
\\ABZg+l\STRq\KBHFaq~~SeaTac Airport
STR
KBHFe~~Angle Lake`;

export const useEditorStore = defineStore('editor', () => {
  const size = ref(parseInt(getItem('size') || '') || 20);
  const width = ref(parseInt(getItem('width') || '') || 200);
  const content = ref(getItem('content') ?? EXAMPLE);
  const scroll = ref(0);
  const selection = ref<ISelection>();

  watch(size, (value) => {
    debouncedSetItem('size', String(value));
  });

  watch(width, (value) => {
    debouncedSetItem('width', String(value));
  });

  watch(content, (value) => {
    debouncedSetItem('content', value);
  });

  return {
    size,
    width,
    content,
    scroll,
    selection,
  };
});
