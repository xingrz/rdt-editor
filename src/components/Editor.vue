<template>
  <div ref="holder" :style="{
    width: `100%`,
    height: `100vh`,
    lineHeight: `${size}px`,
  }" />
</template>

<script lang="ts" setup>
import { computed, defineProps, onMounted, toRefs, watch, ref } from 'vue';

import brace, {
  Range,
  Position,
  IEditSession,
  Editor as IEditor,
  VirtualRenderer,
} from 'brace';
import 'brace/theme/tomorrow';
import 'brace/ext/language_tools';
import '@/editor/rdt';

import { useStore } from '@/store';
import ISelection from '@/types/selection';

import useOnWindowResize from '@/composables/useOnWindowResize';

interface IRenderer extends VirtualRenderer {
  scrollTop: number;
  scrollSelectionIntoView(): void;
}

const props = defineProps<{
  size: number;
  scroll: number;
  width: number;
  selection: ISelection | null;
}>();

const { width, scroll, selection } = toRefs(props);

const store = useStore();
const icons = computed(() => store.state.icon.icons);
const content = computed(() => store.state.editor.content);
const save = (content: string) => store.commit('save', content);
const setScroll = (scroll: number) => store.commit('setScroll', scroll);
const setSelection = (selection: ISelection | null) => store.commit('setSelection', selection);

let editor: IEditor | undefined;
let renderer: IRenderer | undefined;

useOnWindowResize(() => editor?.resize());
watch(width, () => editor?.resize());

watch(scroll, (scroll) => renderer?.scrollToY(scroll));

function applySelection(row: number, offset: number, length: number) {
  if (renderer && editor) {
    const { selection } = editor.getSession();
    selection.setRange({
      start: { row: row, column: offset },
      end: { row: row, column: offset + length },
    } as Range, false);
    renderer.scrollToX(0);
    renderer.scrollSelectionIntoView();
    editor.focus();
  }
}

watch(selection, (selection) => {
  if (selection && selection.from != 'editor') {
    applySelection(selection.row, selection.offset, selection.length);
  }
});

const holder = ref<HTMLElement | null>(null);
onMounted(() => {
  if (holder.value) {
    editor = brace.edit(holder.value);
    editor.$blockScrolling = Infinity;

    renderer = editor.renderer as IRenderer;

    const session = editor.getSession();
    session.setMode('ace/mode/rdt');
    session.on('changeScrollTop', () => {
      if (renderer) setScroll(renderer.scrollTop);
    });

    editor.setTheme('ace/theme/tomorrow');
    editor.setValue(content.value);
    editor.setOption('enableLiveAutocompletion', [{ getCompletions, getDocTooltip }]);

    editor.on('change', () => {
      if (editor) save(editor.getValue());
    });

    editor.selection.on('changeCursor', () => {
      if (editor) {
        const { start } = editor.getSelection().getRange();
        setSelection({
          row: start.row,
          offset: start.column,
          length: 0,
          from: 'editor',
        });
      }
    });

    applySelection(0, 0, 0);
  }
});

function getCompletions(
  editor: IEditor,
  session: IEditSession,
  pos: Position,
  prefix: string,
  callback: (err: Error | null, completions?: { value: string }[]) => void
): void {
  callback(null, Object.keys(icons.value)
    .filter((icon) => !!icons.value[icon])
    .map((icon) => ({ value: icon })));
}

function getDocTooltip(item: { value: string; docHTML: string }): void {
  item.docHTML = `<img src='${icons.value[item.value]?.data
    }' class='preview' />`;
}
</script>

<style>
.preview {
  height: 120px;
  display: block;
}
</style>
