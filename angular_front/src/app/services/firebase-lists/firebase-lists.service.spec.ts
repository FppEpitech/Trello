import { TestBed } from '@angular/core/testing';

import { FirebaseListsService } from './firebase-lists.service';

describe('FirebaseListsService', () => {
  let service: FirebaseListsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseListsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
