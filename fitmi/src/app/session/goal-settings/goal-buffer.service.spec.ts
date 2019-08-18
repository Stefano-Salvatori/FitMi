import { TestBed } from '@angular/core/testing';

import { GoalBufferService } from './goal-buffer.service';

describe('GoalBufferService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GoalBufferService = TestBed.get(GoalBufferService);
    expect(service).toBeTruthy();
  });
});
