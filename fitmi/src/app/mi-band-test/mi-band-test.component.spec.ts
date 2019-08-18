import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiBandTestComponent } from './mi-band-test.component';

describe('MiBandTestComponent', () => {
  let component: MiBandTestComponent;
  let fixture: ComponentFixture<MiBandTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiBandTestComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiBandTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
