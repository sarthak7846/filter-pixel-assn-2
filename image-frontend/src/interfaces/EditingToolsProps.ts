import { ImageEditingValues } from "./ImageEditingValues";
import { Dispatch, SetStateAction } from "react";

export interface EditingToolsProps {
  setImageEditingValues: Dispatch<SetStateAction<ImageEditingValues>>;
}
