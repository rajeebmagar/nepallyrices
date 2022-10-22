import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayListWidgetComponent } from './play-list-widget.component';

describe('PlayListWidgetComponent', () => {
  let component: PlayListWidgetComponent;
  let fixture: ComponentFixture<PlayListWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayListWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayListWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
