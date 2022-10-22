import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistFollowersComponent } from './artist-followers.component';

describe('ArtistFollowersComponent', () => {
  let component: ArtistFollowersComponent;
  let fixture: ComponentFixture<ArtistFollowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistFollowersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistFollowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
