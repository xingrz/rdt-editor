import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { debounce } from 'radash';

import type ISelection from '@/types/selection';

const debouncedSetItem = debounce({ delay: 200 }, localStorage.setItem.bind(localStorage));

export const useEditorStore = defineStore('editor', () => {
  const size = ref(parseInt(localStorage.getItem('size') || '') || 20);
  const split = ref(parseFloat(localStorage.getItem('split') || '') || 0.75);
  const content = ref(localStorage.getItem('content') || '');
  const scroll = ref(0);
  const selection = ref<ISelection>();

  watch(size, (value) => {
    debouncedSetItem('size', String(value));
  });

  watch(split, (value) => {
    debouncedSetItem('split', String(value));
  });

  watch(content, (value) => {
    debouncedSetItem('content', value);
  });

  return {
    size,
    split,
    content,
    scroll,
    selection,
  };
});
