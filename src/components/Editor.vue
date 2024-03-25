<template>
  <div ref="holder" :style="{
    width: `100%`,
    height: `100vh`,
    lineHeight: `${size}px`,
  }" />
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineModel,
  onBeforeUnmount,
  onMounted,
  watch,
  ref,
  useCssModule,
} from 'vue';

import brace, {
  type Position,
  type IEditSession,
  type Editor,
} from 'brace';
import 'brace/theme/tomorrow';
import 'brace/ext/language_tools';
import '@/editor/rdt';

import type ISelection from '@/types/selection';
import type IIcon from '@/types/icon';

import useClientSize from '@/composables/useClientSize';
import bindEditorValue from '@/composables/bindEditorValue';
import bindEditorSelection from '@/composables/bindEditorSelection';
import bindEditorScroll from '@/composables/bindEditorScroll';

const props = defineProps<{
  icons: Record<string, IIcon | null>;
  size: number;
}>();

const holder = ref<HTMLElement>();
const editor = ref<Editor>();

const content = defineModel<string>('content');
bindEditorValue(editor, content);

const selection = defineModel<ISelection>('selection');
bindEditorSelection(editor, selection);

const scroll = defineModel<number>('scroll');
bindEditorScroll(editor, scroll);

onMounted(() => {
  editor.value = brace.edit(holder.value!);
  editor.value.$blockScrolling = Infinity;

  const session = editor.value.getSession();
  session.setMode('ace/mode/rdt');

  editor.value.setTheme('ace/theme/tomorrow');
  editor.value.setOption('enableLiveAutocompletion', [{ getCompletions, getDocTooltip }]);
});

onBeforeUnmount(() => {
  editor.value?.destroy();
  editor.value = undefined;
});

const holderSize = useClientSize(holder);
watch(holderSize, () => editor.value?.resize());

function getCompletions(
  _editor: Editor,
  _session: IEditSession,
  _pos: Position,
  _prefix: string,
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
