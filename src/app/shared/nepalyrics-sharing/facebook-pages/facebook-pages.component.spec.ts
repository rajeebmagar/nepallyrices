import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookPagesComponent } from './facebook-pages.component';

describe('FacebookPagesComponent', () => {
  let component: FacebookPagesComponent;
  let fixture: ComponentFixture<FacebookPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
