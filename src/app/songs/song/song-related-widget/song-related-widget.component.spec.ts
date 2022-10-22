import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongRelatedWidgetComponent } from './song-related-widget.component';

describe('SongRelatedWidgetComponent', () => {
  let component: SongRelatedWidgetComponent;
  let fixture: ComponentFixture<SongRelatedWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongRelatedWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongRelatedWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
