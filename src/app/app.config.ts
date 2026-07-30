import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxSpinnerModule } from "ngx-spinner";
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { provideToastr } from 'ngx-toastr';
import { resErrorInterceptor } from './core/interceptors/res-error.interceptor';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),
    provideAnimations(),
   provideHttpClient(withFetch() , withInterceptors([loadingInterceptor , resErrorInterceptor])), 
   provideAnimationsAsync(),
   importProvidersFrom(NgxSpinnerModule, TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    },
    defaultLanguage: 'en' // Set your default language here
  })) ,
   provideToastr(),//toaster
 

  ]
};
