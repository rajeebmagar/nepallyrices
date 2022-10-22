import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToPlayListComponent } from './add-to-play-list.component';

describe('AddToPlayListComponent', () => {
  let component: AddToPlayListComponent;
  let fixture: ComponentFixture<AddToPlayListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToPlayListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToPlayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
