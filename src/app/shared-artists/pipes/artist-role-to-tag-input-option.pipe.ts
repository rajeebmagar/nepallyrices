import { Pipe, PipeTransform } from "@angular/core";
import { ArtistRole } from "../models/artist-role";
import { TagInputOption } from "../../shared-models/tag-input-option";

@Pipe({
  name: "artistRoleToTagInputOption",
})
export class ArtistRoleToTagInputOptionPipe implements PipeTransform {
  transform(artist: ArtistRole): TagInputOption {
    if (artist.artistId === ArtistRole.NewArtistId) {
      return {
        isForAdd: true,
        description: artist.artistName,
        thumbnail: artist.profilePicture,
      } as TagInputOption;
    }
    return {
      description: artist.artistName,
      thumbnail: artist.profilePicture,
    } as TagInputOption;
  }
}
