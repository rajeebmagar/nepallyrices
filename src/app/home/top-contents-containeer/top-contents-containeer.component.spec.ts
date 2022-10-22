/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TopContentsContaineerComponent } from './top-contents-containeer.component';

describe('TopContentsContaineerComponent', () => {
  let component: TopContentsContaineerComponent;
  let fixture: ComponentFixture<TopContentsContaineerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopContentsContaineerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopContentsContaineerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
