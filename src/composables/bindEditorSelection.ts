import { watch, type Ref } from 'vue';
import type { Editor, Range, VirtualRenderer } from 'brace';

import onRefAssigned from './onRefAssigned';

import ISelection from '@/types/selection';

interface Renderer extends VirtualRenderer {
  scrollTop: number;
  scrollSelectionIntoView(): void;
}

export default function bindEditorSelection(editorRef: Ref<Editor | undefined>, selection: Ref<ISelection | undefined>): void {
  onRefAssigned(editorRef, (editor) => {
    applyRange(editor, toRange({ row: 0, offset: 0, length: 0 }));

    editor.selection.on('changeCursor', () => {
      const range = editor.getSelection().getRange();
      selection.value = toSelection(range, 'editor');
    });
  });

  watch(selection, (selection) => {
    const editor = editorRef.value;
    // Do not respond to selection changes dispatched from the editor
    // This can't be done with a comparation between two selection objects,
    // since the object generated from the editor is different, especially on
    // multi-line selections or deletions.
    if (editor && selection && selection.from != 'editor') {
      applyRange(editor, toRange(selection));
    }
  });
}

function toRange({ row, offset, length }: Omit<ISelection, 'from'>): Range {
  return {
    start: { row: row, column: offset },
    end: { row: row, column: offset + length },
  } as Range;
}

function applyRange(editor: Editor, range: Range) {
  const renderer = editor.renderer as Renderer;
  editor.selection.setRange(range, false);
  renderer.scrollToX(0);
  renderer.scrollSelectionIntoView();
  editor.focus();
}

function toSelection(range: Range, from: ISelection['from']): ISelection {
  return {
    row: range.start.row,
    offset: range.start.column,
    length: range.end.column - range.start.column,
    from: from,
  } as ISelection;
}
