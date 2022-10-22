import { Pipe, PipeTransform } from "@angular/core";
import { Anchor } from "app/shared-models/anchor";
import { Tag } from "app/shared/entities/tag";
@Pipe({
  name: "tagsToAnchors",
})
export class TagsToAnchorsPipe implements PipeTransform {
  transform(tags: Array<Tag>): Array<Anchor> {
    let anchors = new Array<Anchor>();
    for (let tag of tags) {
      let anchor = new Anchor();
      anchor.title = tag.name;
      anchor.url = "/tags/" + tag.name;
      anchors.push(anchor);
    }
    return anchors;
  }
}
