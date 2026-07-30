import { TestBed } from '@angular/core/testing';

import { HDetailsService } from './hdetails.service';

describe('HDetailsService', () => {
  let service: HDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
