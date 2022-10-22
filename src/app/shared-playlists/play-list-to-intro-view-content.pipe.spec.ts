import { PlayListToIntroViewContentPipe } from "./play-list-to-intro-view-content.pipe";

describe("PlayListToIntroViewContentPipe", () => {
  it("create an instance", () => {
    const pipe = new PlayListToIntroViewContentPipe(null);
    expect(pipe).toBeTruthy();
  });
});
