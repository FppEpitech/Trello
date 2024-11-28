import { TestBed } from '@angular/core/testing';

import { FirebaseWorkspacesService } from './firebase-workspaces.service';

describe('FirebaseWorkspacesService', () => {
  let service: FirebaseWorkspacesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseWorkspacesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
