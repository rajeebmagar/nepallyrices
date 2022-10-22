import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayListViewCellComponent } from './play-list-view-cell.component';

describe('PlayListViewCellComponent', () => {
  let component: PlayListViewCellComponent;
  let fixture: ComponentFixture<PlayListViewCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayListViewCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayListViewCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
