import { TestBed } from '@angular/core/testing';

import { OpenCardService } from './open-card.service';

describe('OpenCardService', () => {
  let service: OpenCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
