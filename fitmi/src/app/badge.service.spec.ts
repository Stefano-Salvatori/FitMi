import { TestBed } from '@angular/core/testing';

import { BadgeService } from './badge.service';

describe('BadgeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BadgeService = TestBed.get(BadgeService);
    expect(service).toBeTruthy();
  });
});
