/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CommaSeparatedAnchorsComponent } from './comma-separated-anchors.component';

describe('CommaSeparatedAnchorsComponent', () => {
  let component: CommaSeparatedAnchorsComponent;
  let fixture: ComponentFixture<CommaSeparatedAnchorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommaSeparatedAnchorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommaSeparatedAnchorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
