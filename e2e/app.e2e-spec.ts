import { NepalyricsWebApplicationPage } from './app.po';

describe('nepalyrics-web-application App', function() {
  let page: NepalyricsWebApplicationPage;

  beforeEach(() => {
    page = new NepalyricsWebApplicationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
