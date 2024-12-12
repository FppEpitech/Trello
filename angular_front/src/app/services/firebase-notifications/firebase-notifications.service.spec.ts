import { TestBed } from '@angular/core/testing';

import { FirebaseNotificationsService } from './firebase-notifications.service';

describe('FirebaseNotificationsService', () => {
  let service: FirebaseNotificationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseNotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
