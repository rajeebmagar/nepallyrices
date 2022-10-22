import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectExternalLoginComponent } from './connect-external-login.component';

describe('ConnectExternalLoginComponent', () => {
  let component: ConnectExternalLoginComponent;
  let fixture: ComponentFixture<ConnectExternalLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectExternalLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectExternalLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
