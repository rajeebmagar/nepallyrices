import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedArtistsWidgetComponent } from './related-artists-widget.component';

describe('RelatedArtistsWidgetComponent', () => {
  let component: RelatedArtistsWidgetComponent;
  let fixture: ComponentFixture<RelatedArtistsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedArtistsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedArtistsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
