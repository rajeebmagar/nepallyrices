import { Pipe, PipeTransform } from "@angular/core";
import { Genre } from "app/shared-models/genre";
import { TagInputOption } from "../../shared-models/tag-input-option";

@Pipe({
  name: "genreToTagInputOption",
})
export class GenreToTagInputOptionPipe implements PipeTransform {
  transform(genre: Genre): TagInputOption {
    if (genre.genreId === Genre.NewGenreId) {
      return {
        isForAdd: true,
        description: genre.name,
      } as TagInputOption;
    }
    return {
      description: genre.name,
    } as TagInputOption;
  }
}
