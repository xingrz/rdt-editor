import { defineStore } from 'pinia';
import { ref } from 'vue';
import { debounce } from 'radash';

import ISelection from '@/types/selection';

const debouncedSetItem = debounce({ delay: 200 }, localStorage.setItem.bind(localStorage));

export const useEditorStore = defineStore('editor', () => {
  const size = ref(parseInt(localStorage.getItem('size') || '') || 20);
  const width = ref(parseInt(localStorage.getItem('width') || '') || 200);
  const content = ref(localStorage.getItem('content') || '');
  const scroll = ref(0);
  const selection = ref<ISelection | null>(null);

  function setSize(value: number): void {
    size.value = value;
    debouncedSetItem('size', `${size.value}`);
  }

  function setWidth(value: number): void {
    width.value = value;
    debouncedSetItem('width', `${width.value}`);
  }

  function setScroll(value: number): void {
    scroll.value = value;
  }

  function setSelection(value: ISelection | null): void {
    selection.value = value;
  }

  function save(value: string): void {
    content.value = value;
    debouncedSetItem('content', value);
  }

  return {
    size, width, content, scroll, selection,
    setSize, setWidth, setScroll, setSelection, save
  };
});
