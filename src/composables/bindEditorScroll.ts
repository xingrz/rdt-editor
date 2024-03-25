import { watch, type Ref } from 'vue';
import type { Ace } from 'ace-code';

import onRefAssigned from './onRefAssigned';

export default function bindEditorScroll(editor: Ref<Ace.Editor | undefined>, scroll: Ref<number | undefined>): void {
  onRefAssigned(editor, (value) => {
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
