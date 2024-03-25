import type { Ref } from 'vue';
import type { Ace } from 'ace-code';

import onRefAssigned from './onRefAssigned';

export default function bindEditorValue(editor: Ref<Ace.Editor | undefined>, val: Ref<string | undefined>): void {
  onRefAssigned(editor, (value) => {
    if (val.value) {
      value.setValue(val.value);
    }

    value.on('change', () => {
      val.value = value.getValue();
    });
  });

  // only one way binding
}
