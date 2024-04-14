import { watch, type Ref } from 'vue';
import { whenever } from '@vueuse/core';
import type { Ace } from 'ace-code';

export default function bindEditorScroll(editor: Ref<Ace.Editor | undefined>, scroll: Ref<number | undefined>): void {
  whenever(editor, (value) => {
    const session = value.getSession();
    session.on('changeScrollTop', () => {
      const scrollTop = session.getScrollTop();
      if (scroll.value != scrollTop) {
        scroll.value = scrollTop;
      }
    });
  });

  watch(scroll, (value) => {
    if (typeof value != 'undefined' && editor.value) {
      const session = editor.value.getSession();
      if (session.getScrollTop() !== value) {
        session.setScrollTop(value);
      }
    }
  });
}
