import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureSelectorComponent } from './picture-selector.component';

describe('PictureSelectorComponent', () => {
  let component: PictureSelectorComponent;
  let fixture: ComponentFixture<PictureSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
