import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayListDetailComponent } from './play-list-detail.component';

describe('PlayListDetailComponent', () => {
  let component: PlayListDetailComponent;
  let fixture: ComponentFixture<PlayListDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayListDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
