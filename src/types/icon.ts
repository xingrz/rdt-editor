export type IIcon = {
  status: string;
  data?: string;
  ratio?: number;
} & ({
  status: 'loading';
} | {
  status: 'failed';
} | {
  status: 'ready';
  data: string;
  ratio: number;
});
