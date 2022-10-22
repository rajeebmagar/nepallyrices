import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagInputOptionComponent } from './tag-input-option.component';

describe('TagInputOptionComponent', () => {
  let component: TagInputOptionComponent;
  let fixture: ComponentFixture<TagInputOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagInputOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagInputOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
