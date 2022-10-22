import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroViewCellComponent } from './intro-view-cell.component';

describe('IntroViewCellComponent', () => {
  let component: IntroViewCellComponent;
  let fixture: ComponentFixture<IntroViewCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroViewCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroViewCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
