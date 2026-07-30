import { TestBed } from '@angular/core/testing';

import { DetailsHdrsSharedSignalsService } from './details-hdrs-shared-signals.service';

describe('DetailsHdrsSharedSignalsService', () => {
  let service: DetailsHdrsSharedSignalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailsHdrsSharedSignalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
