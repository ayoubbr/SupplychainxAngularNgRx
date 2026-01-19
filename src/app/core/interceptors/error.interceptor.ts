import { HttpInterceptorFn } from "@angular/common/http"
import { inject } from "@angular/core"
import { Router } from "@angular/router"
import { catchError, throwError, BehaviorSubject, switchMap, filter, take } from "rxjs"
import { AuthService } from "../auth/auth.service"

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router)
  const authService = inject(AuthService)

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshToken().pipe(
            switchMap((response: any) => {
              isRefreshing = false;
              refreshTokenSubject.next(response.accessToken);
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`
                }
              });
              return next(newReq);
            }),
            catchError((err) => {
              isRefreshing = false;
              // If refresh failed, we must logout
              // authService.logout() // This calls API, might fail again? 
              // Better to force clear session
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('access_token_expires_at');
              localStorage.removeItem('refresh_token_expires_at');

              const returnUrl = router.url;
              router.navigate(['/login'], { queryParams: { returnUrl: returnUrl } });

              return throwError(() => err);
            })
          );
        } else {
          return refreshTokenSubject.pipe(
            filter(token => token != null),
            take(1),
            switchMap(token => {
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${token}`
                }
              });
              return next(newReq);
            })
          );
        }
      } else if (error.status === 403) {
        router.navigate(["/unauthorized"])
      }

      return throwError(() => error)
    }),
  )
}
