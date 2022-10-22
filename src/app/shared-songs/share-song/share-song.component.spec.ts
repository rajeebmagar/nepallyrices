import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareSongComponent } from './share-song.component';

describe('ShareSongComponent', () => {
  let component: ShareSongComponent;
  let fixture: ComponentFixture<ShareSongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareSongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
