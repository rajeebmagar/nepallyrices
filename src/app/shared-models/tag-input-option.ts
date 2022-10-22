import { Image } from "./image";

export interface TagInputOption {
  isForAdd?: boolean;
  description: string;
  thumbnail?: Image;
  icon?: string;
}
