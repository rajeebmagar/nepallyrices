import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongWidgetComponent } from './song-widget.component';

describe('SongWidgetComponent', () => {
  let component: SongWidgetComponent;
  let fixture: ComponentFixture<SongWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
