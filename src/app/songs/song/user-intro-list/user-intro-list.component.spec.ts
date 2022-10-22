import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIntroListComponent } from './user-intro-list.component';

describe('UserIntroListComponent', () => {
  let component: UserIntroListComponent;
  let fixture: ComponentFixture<UserIntroListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserIntroListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserIntroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
