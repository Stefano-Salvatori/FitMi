import { TestBed } from '@angular/core/testing';

import { GoalBufferService } from './session-data.service';

describe('SessionDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SessionDataService = TestBed.get(SessionDataService);
    expect(service).toBeTruthy();
  });
});
