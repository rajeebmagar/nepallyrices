import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistPopularSongsComponent } from './artist-popular-songs.component';

describe('ArtistPopularSongsComponent', () => {
  let component: ArtistPopularSongsComponent;
  let fixture: ComponentFixture<ArtistPopularSongsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistPopularSongsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistPopularSongsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
