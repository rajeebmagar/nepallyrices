import { Image } from "app/shared-models/image";

export class CroppingRequest {
  image: Image;
  cropLength: Number;
  cropHeight: Number;
  cropRatio: Number;
}
