import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GymComponent } from './gym.component';

describe('GymComponent', () => {
  let component: GymComponent;
  let fixture: ComponentFixture<GymComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GymComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
