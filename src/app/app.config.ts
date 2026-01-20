import {type ApplicationConfig, provideZoneChangeDetection} from "@angular/core"
import {provideRouter} from "@angular/router"
import {provideHttpClient, withInterceptors} from "@angular/common/http"
import {routes} from "./app.routes"
import {authInterceptor} from "./core/interceptors/auth.interceptor"
import {errorInterceptor} from "./core/interceptors/error.interceptor"
import {jwtInterceptor} from './core/interceptors/jwt.interceptor';
import {provideStore} from '@ngrx/store';
import {customerFeature} from './state/customer/customer.reducer';
import {provideEffects} from '@ngrx/effects';
import {CustomerEffects} from './state/customer/customer.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideStore({[customerFeature.name]: customerFeature.reducer}),
    provideEffects(CustomerEffects)
  ],
}
