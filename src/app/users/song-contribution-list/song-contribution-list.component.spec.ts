import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongContributionListComponent } from './song-contribution-list.component';

describe('SongContributionListComponent', () => {
  let component: SongContributionListComponent;
  let fixture: ComponentFixture<SongContributionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongContributionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongContributionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
