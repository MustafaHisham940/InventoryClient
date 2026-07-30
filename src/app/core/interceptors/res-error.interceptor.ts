import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const resErrorInterceptor: HttpInterceptorFn = (req, next) => {
  
  const _ToastrService=inject(ToastrService)
  
  return next(req).pipe(
    catchError(
      
      (err)=>{
          // 1. Extract the API error response
      const apiError = err.error;
      const middlewareError = apiError?.Errors || apiError?.errors; // Added middleware check
      
      console.log('from Interceptor' , err.error)
      
      
        
      // Handle middleware errors first (added this block)
      if (middlewareError) {
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
    )
  );
};
