import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "imageDefaultUrl",
})
export class ImageDefaultUrlPipe implements PipeTransform {
  transform(imageUrl, defaultImageUrl) {
    if (imageUrl) return imageUrl;
    else return defaultImageUrl;
  }
}
