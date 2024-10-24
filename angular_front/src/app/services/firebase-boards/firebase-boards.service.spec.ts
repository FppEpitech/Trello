import { TestBed } from '@angular/core/testing';

import { FirebaseBoardsService } from './firebase-boards.service';

describe('FirebaseBoardsService', () => {
  let service: FirebaseBoardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseBoardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
