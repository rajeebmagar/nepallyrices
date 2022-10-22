import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioPlayListComponent } from './audio-play-list.component';

describe('AudioPlayListComponent', () => {
  let component: AudioPlayListComponent;
  let fixture: ComponentFixture<AudioPlayListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioPlayListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioPlayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
