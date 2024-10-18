import { TestBed } from '@angular/core/testing';

import { FirebaseCardsService } from './firebase-cards.service';

describe('FirebaseCardsService', () => {
  let service: FirebaseCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
