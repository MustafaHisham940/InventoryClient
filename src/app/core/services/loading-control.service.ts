import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingControlService {
  private loadingInterceptorEnabled = true;

  isLoadingInterceptorEnabled(): boolean {
    return this.loadingInterceptorEnabled;
  }

  disableLoadingInterceptor(): void {
    this.loadingInterceptorEnabled = false;
  }

  enableLoadingInterceptor(): void {
    this.loadingInterceptorEnabled = true;
  }
}
