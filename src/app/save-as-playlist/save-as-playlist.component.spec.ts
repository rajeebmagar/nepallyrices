import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveAsPlaylistComponent } from './save-as-playlist.component';

describe('SaveAsPlaylistComponent', () => {
  let component: SaveAsPlaylistComponent;
  let fixture: ComponentFixture<SaveAsPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveAsPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveAsPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
