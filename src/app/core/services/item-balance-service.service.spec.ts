import { TestBed } from '@angular/core/testing';

import { ItemBalanceServiceService } from './item-balance-service.service';

describe('ItemBalanceServiceService', () => {
  let service: ItemBalanceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemBalanceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
