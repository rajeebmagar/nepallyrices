/* tslint:disable:no-unused-variable */

import { TestBed, async } from "@angular/core/testing";
import { SongIntroToIntroViewContentPipe } from "./song-intro-to-intro-view-content.pipe";
import { ArtistRolesToAnchorsPipe } from "../shared/pipes/artist-roles-to-anchors.pipe";

describe("songIntroToIntroViewContentPipe", () => {
  it("create an instance", () => {
    const pipe = new SongIntroToIntroViewContentPipe(
      new ArtistRolesToAnchorsPipe()
    );
    expect(pipe).toBeTruthy();
  });
});
