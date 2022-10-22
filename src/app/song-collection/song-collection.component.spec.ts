import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongCollectionComponent } from './song-collection.component';

describe('SongCollectionComponent', () => {
  let component: SongCollectionComponent;
  let fixture: ComponentFixture<SongCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
