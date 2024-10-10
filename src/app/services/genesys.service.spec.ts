import { TestBed } from '@angular/core/testing';

import { GenesysService } from './genesys.service';

describe('GenesysService', () => {
  let service: GenesysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenesysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
