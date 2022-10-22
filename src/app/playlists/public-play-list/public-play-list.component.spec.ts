import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPlayListComponent } from './public-play-list.component';

describe('PublicPlayListComponent', () => {
  let component: PublicPlayListComponent;
  let fixture: ComponentFixture<PublicPlayListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicPlayListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPlayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
