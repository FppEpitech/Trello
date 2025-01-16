import { TestBed } from '@angular/core/testing';

import { FirebaseTemplatesService } from './firebase-templates.service';

describe('FirebaseTemplatesService', () => {
  let service: FirebaseTemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseTemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
