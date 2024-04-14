import type { Ref } from 'vue';
import { whenever } from '@vueuse/core';
import type { Ace } from 'ace-code';

export default function bindEditorValue(editor: Ref<Ace.Editor | undefined>, val: Ref<string | undefined>): void {
  whenever(editor, (value) => {
    if (val.value) {
      value.setValue(val.value);
    }

    value.on('change', () => {
      val.value = value.getValue();
    });
  });

  // only one way binding
}
