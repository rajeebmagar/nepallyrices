import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountHeaderComponent } from './user-account-header.component';

describe('UserAccountHeaderComponent', () => {
  let component: UserAccountHeaderComponent;
  let fixture: ComponentFixture<UserAccountHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAccountHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAccountHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
