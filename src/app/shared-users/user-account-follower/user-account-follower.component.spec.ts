import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountFollowerComponent } from './user-account-follower.component';

describe('UserAccountFollowerComponent', () => {
  let component: UserAccountFollowerComponent;
  let fixture: ComponentFixture<UserAccountFollowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountFollowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountFollowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
