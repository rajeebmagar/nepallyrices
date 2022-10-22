import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedArtistComponent } from './related-artist.component';

describe('RelatedArtistComponent', () => {
  let component: RelatedArtistComponent;
  let fixture: ComponentFixture<RelatedArtistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedArtistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedArtistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
