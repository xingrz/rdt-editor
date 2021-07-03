export default interface ISelection {
  row: number;
  offset: number;
  length: number;
  from: 'editor' | 'preview';
}
