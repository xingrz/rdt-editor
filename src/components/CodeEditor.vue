<template>
  <div ref="holder" :style="{
    width: `100%`,
    height: `100%`,
    lineHeight: `${size}px`,
  }" />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, useCssModule } from 'vue';
import { useResizeObserver } from '@vueuse/core';

import { Ace, edit as aceEdit, config as aceConfig } from 'ace-code';
import 'ace-code/src/ext/language_tools';
import 'ace-code/styles/ace.css';
import 'ace-code/styles/theme/tomorrow.css';
import * as RDT from '@/editor/rdt';

import type ISelection from '@/types/selection';
import type { IIcon } from '@/types/icon';

import bindEditorValue from '@/composables/bindEditorValue';
import bindEditorSelection from '@/composables/bindEditorSelection';
import bindEditorScroll from '@/composables/bindEditorScroll';

const props = defineProps<{
  icons: Record<string, IIcon | null>;
  size: number;
}>();

const holder = ref<HTMLElement>();
const editor = ref<Ace.Editor>();

const content = defineModel<string>('content');
bindEditorValue(editor, content);

const selection = defineModel<ISelection>('selection');
bindEditorSelection(editor, selection);

const scroll = defineModel<number>('scroll');
bindEditorScroll(editor, scroll);

const aceModules: Record<string, unknown> = {
  'ace/theme/tomorrow': { cssClass: 'ace-tomorrow' },
  'ace/mode/rdt': RDT,
};

aceConfig.setLoader((path, callback) => {
  callback(null, aceModules[path]);
});

onMounted(() => {
  editor.value = aceEdit(holder.value!, {
    theme: 'ace/theme/tomorrow',
    mode: 'ace/mode/rdt',
    enableLiveAutocompletion: [new Completer()],
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
  editor.value = undefined;
});

useResizeObserver(holder, () => editor.value?.resize());

class Completer implements Ace.Completer {
  private style = useCssModule();

  getCompletions(_editor: Ace.Editor, _session: Ace.EditSession, _pos: Ace.Point, _prefix: string, callback: Ace.CompleterCallback): void {
    callback(null, Object.keys(props.icons)
      .filter((icon) => props.icons[icon]?.status == 'ready')
      .map((icon) => ({ value: icon })));
  }

  getDocTooltip(item: Ace.ValueCompletion): string | Ace.ValueCompletion | undefined {
    const icon = props.icons[item.value];
    if (icon?.data) {
      const img = document.createElement('img');
      img.src = icon.data;
      img.className = this.style.preview;
      item.docHTML = img.outerHTML;
    }
    return;
  }
}
</script>

<style lang="scss" module>
.preview {
  height: 120px;
  display: block;
}
</style>
