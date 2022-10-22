import { Pipe, PipeTransform } from "@angular/core";
import { Anchor } from "app/shared-models/anchor";
import { Genre } from "app/shared-models/genre";

@Pipe({
  name: "genresToAnchors",
})
export class GenresToAnchorsPipe implements PipeTransform {
  transform(genres: Array<Genre>): Array<Anchor> {
    let anchors = new Array<Anchor>();
    for (let genre of genres) {
      let anchor = new Anchor();
      anchor.title = genre.name;
      anchor.url = "/genres/" + genre.name;
      anchors.push(anchor);
    }
    return anchors;
  }
}
