<template>
  <div ref="holder" :style="{
    width: `100%`,
    height: `100vh`,
    lineHeight: `${size}px`,
  }" />
</template>

<script lang="ts" setup>
import { defineProps, onMounted, toRefs, watch, ref, useCssModule } from 'vue';

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

import ISelection from '@/types/selection';
import IIcon from '@/types/icon';

import useOnWindowResize from '@/composables/useOnWindowResize';

interface IRenderer extends VirtualRenderer {
  scrollTop: number;
  scrollSelectionIntoView(): void;
}

const props = defineProps<{
  content: string;
  selection: ISelection | null;
  scroll: number;
  icons: Record<string, IIcon | null>;
  size: number;
  width: number;
}>();

const emit = defineEmits<{
  (e: 'update:content', content: string): void;
  (e: 'update:selection', selection: ISelection | null): void;
  (e: 'update:scroll', scroll: number): void;
}>();

const { width, scroll, selection } = toRefs(props);

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
      if (renderer) emit('update:scroll', renderer.scrollTop);
    });

    editor.setTheme('ace/theme/tomorrow');
    editor.setValue(props.content);
    editor.setOption('enableLiveAutocompletion', [{ getCompletions, getDocTooltip }]);

    editor.on('change', () => {
      if (editor) emit('update:content', editor.getValue());
    });

    editor.selection.on('changeCursor', () => {
      if (editor) {
        const { start } = editor.getSelection().getRange();
        emit('update:selection', {
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
  callback(null, Object.keys(props.icons)
    .filter((icon) => !!props.icons[icon])
    .map((icon) => ({ value: icon })));
}

const style = useCssModule();
function getDocTooltip(item: { value: string; docHTML: string }): void {
  item.docHTML = `<img src="${props.icons[item.value]?.data}" class="${style.preview}" />`;
}
</script>

<style lang="scss" module>
.preview {
  height: 120px;
  display: block;
}
</style>
