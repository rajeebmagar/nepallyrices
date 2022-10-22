import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepalyricsSharingComponent } from './nepalyrics-sharing.component';

describe('NepalyricsSharingComponent', () => {
  let component: NepalyricsSharingComponent;
  let fixture: ComponentFixture<NepalyricsSharingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepalyricsSharingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepalyricsSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
