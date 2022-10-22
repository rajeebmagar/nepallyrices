import { Component, OnInit, Input } from "@angular/core";
import { ArtistRole } from "app/shared-artists/models/artist-role";

@Component({
  selector: "nl-song-artists",
  templateUrl: "./song-artists.component.html",
  styleUrls: ["./song-artists.component.css"],
})
export class SongArtistsComponent implements OnInit {
  @Input() artistsRoles: ArtistRole[];
  @Input() title: string;

  // constructor(private songWithAddToQueueCommandFactory: SongWithAddToQueueCommandFactory,
  //   private songIntroCommandsFactoryService:SongIntroCommandsFactoryService);

  ngOnInit() {}
}
