import { TestBed } from '@angular/core/testing';

import { InMemoryCarDbService } from './in-memory-car-db.service';

describe('InMemoryCarDbService', () => {
  let service: InMemoryCarDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InMemoryCarDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
