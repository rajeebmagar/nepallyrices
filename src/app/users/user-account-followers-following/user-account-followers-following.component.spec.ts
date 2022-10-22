import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountFollowersFollowingComponent } from './user-account-followers-following.component';

describe('UserAccountFollowersFollowingComponent', () => {
  let component: UserAccountFollowersFollowingComponent;
  let fixture: ComponentFixture<UserAccountFollowersFollowingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountFollowersFollowingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountFollowersFollowingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
