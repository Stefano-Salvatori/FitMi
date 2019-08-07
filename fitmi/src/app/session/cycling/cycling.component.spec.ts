import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CyclingComponent } from './cycling.component';

describe('CyclingComponent', () => {
  let component: CyclingComponent;
  let fixture: ComponentFixture<CyclingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CyclingComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CyclingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
