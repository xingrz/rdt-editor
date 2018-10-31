export function save(text) {
  return {
    type: 'EDITOR_SAVE',
    text,
  };
}
