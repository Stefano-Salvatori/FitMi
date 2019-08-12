import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RunningStatsComponent } from './running-stats.component';

describe('RunningStatsComponent', () => {
  let component: RunningStatsComponent;
  let fixture: ComponentFixture<RunningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunningStatsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunningSTatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
