import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { LoadingControlService } from '../services/loading-control.service';

/** In-flight HTTP count; spinner shows once while any request is active */
let activeRequests = 0;
/** Delay hiding so sequential calls (or switchMap chains) do not flash hide/show between requests */
let hideScheduled: ReturnType<typeof setTimeout> | null = null;
const HIDE_DELAY_MS = 120;

function cancelScheduledHide(): void {
  if (hideScheduled !== null) {
    clearTimeout(hideScheduled);
    hideScheduled = null;
  }
}

function scheduleHide(spinner: NgxSpinnerService): void {
  cancelScheduledHide();
  hideScheduled = setTimeout(() => {
    hideScheduled = null;
    if (activeRequests === 0) {
      spinner.hide();
    }
  }, HIDE_DELAY_MS);
}

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingControl = inject(LoadingControlService);

  if (!loadingControl.isLoadingInterceptorEnabled()) {
    return next(req);
  }

  const spinner = inject(NgxSpinnerService);

  cancelScheduledHide();
  activeRequests++;
  if (activeRequests === 1) {
    spinner.show();
  }

  return next(req).pipe(
    finalize(() => {
      activeRequests--;
      if (activeRequests < 0) {
        activeRequests = 0;
      }
      if (activeRequests === 0) {
        scheduleHide(spinner);
      }
    })
  );
};
