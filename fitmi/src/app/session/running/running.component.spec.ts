import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningComponent } from './running.component';

describe('RunningComponent', () => {
  let component: RunningComponent;
  let fixture: ComponentFixture<RunningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunningComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
