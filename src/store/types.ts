import ISelection from "@/types/selection";
import IIcon from "@/types/icon";

export interface EditorState {
  size: number;
  width: number;
  content: string;
  scroll: number;
  selection: ISelection;
}

export interface IconState {
  icons: Record<string, IIcon | null>;
}

export interface RootState {
  editor: EditorState;
  icon: IconState;
}
