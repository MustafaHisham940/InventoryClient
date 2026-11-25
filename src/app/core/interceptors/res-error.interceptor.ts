import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs';

/**
 * File downloads (Excel / PDF) use responseType 'blob', so their error body
 * also arrives as a Blob. Turn it back into JSON so the real server message
 * can be shown instead of the generic one.
 */
function withJsonErrorBody(err: any): Observable<any> {
  if (!(err instanceof HttpErrorResponse) || !(err.error instanceof Blob)) {
    return of(err);
  }

  return from(err.error.text()).pipe(
    switchMap(text => {
      let body: any = null;
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = null; // not JSON (for example an HTML error page)
      }
      return of(new HttpErrorResponse({
        error: body,
        headers: err.headers,
        status: err.status,
        statusText: err.statusText,
        url: err.url ?? undefined
      }));
    }),
    catchError(() => of(err))
  );
}

/** true for a non-empty list, a non-empty string or a non-empty object */
function hasErrors(value: any): boolean {
  if (!value) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return Object.keys(value).length > 0;
}

export const resErrorInterceptor: HttpInterceptorFn = (req, next) => {

  const _ToastrService=inject(ToastrService)

  return next(req).pipe(
    catchError(rawErr => withJsonErrorBody(rawErr).pipe(switchMap(

      (err)=>{
          // 1. Extract the API error response
      const apiError = err.error;
      const middlewareError = apiError?.Errors || apiError?.errors; // Added middleware check

      console.log('from Interceptor' , err.error)



      // Handle middleware errors first (added this block)
      if (hasErrors(middlewareError)) {
        const errorMessage = Array.isArray(middlewareError)
          ? middlewareError.join('<br>')
          : typeof middlewareError === 'string'
            ? middlewareError
            : Object.values(middlewareError).flat().join('<br>');

        _ToastrService.error(errorMessage, "يوجد خطأ" || 'خطأ', {

          disableTimeOut: true,
          closeButton: true,
          enableHtml: true,positionClass: 'toast-center-center',
          toastClass: 'ngx-toastr custom-large-toast',
          tapToDismiss:true,

        });
        return throwError(() => err);
      }

      // A result with only a message (for example the cost adjustment ServiceResult)
      const apiMessage = apiError?.message || apiError?.Message;
      if (typeof apiMessage === 'string' && apiMessage.trim()) {
        _ToastrService.error(apiMessage, 'يوجد خطأ', {
          positionClass: 'toast-bottom-center',
          disableTimeOut: true,
          closeButton: true
        });
        return throwError(() => err);
      }







         // 2. Handle non-API errors (e.g., network issues)
      if (!apiError || !apiError.errors) {
        _ToastrService.warning('حدث خطأ غير متوقع', 'خطأ', {
          positionClass: 'toast-top-left',
          timeOut: 5000
        });
        return throwError(() => err);
      }



      // 3. Flatten errors into a single string (for Toastr)
      const errorMessages = Object.values(apiError.errors)
        .flat()
        .join('<br>'); // Join with line breaks

      // 4. Show Toastr with formatted errors
      _ToastrService.error(errorMessages, "يوجد خطأ" || 'خطأ', {
        positionClass: 'toast-bottom-center',
        disableTimeOut: true,
        closeButton:true,
        enableHtml: true // Allow HTML line breaks
      });

        return throwError( ()=>err )
      }
    )))
  );
};
