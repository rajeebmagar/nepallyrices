import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayListDetailHeaderComponent } from './play-list-detail-header.component';

describe('PlayListDetailHeaderComponent', () => {
  let component: PlayListDetailHeaderComponent;
  let fixture: ComponentFixture<PlayListDetailHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayListDetailHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayListDetailHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
