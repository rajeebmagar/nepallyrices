import { Pipe, PipeTransform } from "@angular/core";
import { Tag } from "app/shared/entities/tag";
import { TagInputOption } from "../../shared-models/tag-input-option";

@Pipe({
  name: "tagToTagInputOption",
})
export class TagToTagInputOptionPipe implements PipeTransform {
  transform(tag: Tag): TagInputOption {
    if (tag.tagId === Tag.NewTagId) {
      return {
        isForAdd: true,
        description: tag.name,
      } as TagInputOption;
    }
    return {
      description: tag.name,
      icon: "local_offer",
    } as TagInputOption;
  }
}
