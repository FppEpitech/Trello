import { TestBed } from '@angular/core/testing';

import { FirebaseActivitiesService } from './firebase-activities.service';

describe('FirebaseActivitiesService', () => {
  let service: FirebaseActivitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseActivitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
