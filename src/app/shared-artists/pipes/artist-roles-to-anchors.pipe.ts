import { Pipe, PipeTransform } from "@angular/core";
import { Anchor } from "app/shared-models/anchor";
import { ArtistRole } from "app/shared-artists/models/artist-role";

@Pipe({
  name: "artistRolesToAnchors",
})
export class ArtistRolesToAnchorsPipe implements PipeTransform {
  transform(artistRoles: Array<ArtistRole>): Array<Anchor> {
    let anchors = new Array<Anchor>();
    for (let artistRole of artistRoles) {
      let anchor = new Anchor();
      anchor.title = artistRole.artistName;
      anchor.url = "/artists/" + artistRole.artistUrlFriendlyName;
      anchors.push(anchor);
    }
    return anchors;
  }
}
