import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIntroCellComponent } from './user-intro-cell.component';

describe('UserIntroCellComponent', () => {
  let component: UserIntroCellComponent;
  let fixture: ComponentFixture<UserIntroCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserIntroCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserIntroCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
