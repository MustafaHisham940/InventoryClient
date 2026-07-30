import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { unsavedChangesGuardGuard } from './unsaved-changes-guard.guard';

describe('unsavedChangesGuardGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => unsavedChangesGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
