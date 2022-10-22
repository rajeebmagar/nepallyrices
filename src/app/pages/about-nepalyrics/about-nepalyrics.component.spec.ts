import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutNepalyricsComponent } from './about-nepalyrics.component';

describe('AboutNepalyricsComponent', () => {
  let component: AboutNepalyricsComponent;
  let fixture: ComponentFixture<AboutNepalyricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutNepalyricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutNepalyricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
