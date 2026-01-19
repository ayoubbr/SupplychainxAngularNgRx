import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../../shared/services/toast.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const toastService = inject(ToastService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        const requiredRoles = route.data['roles'] as Array<string>;

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        if (authService.hasAnyRole(requiredRoles)) {
            return true;
        }

        toastService.error('Access Denied: You do not have permission to view this page.');
        return false;
    }

    // If access token is expired but refresh token is valid, try to refresh
    if (authService.canRefresh()) {
        return authService.refreshToken().pipe(
            map(() => {
                // Re-check authentication and roles after refresh
                if (authService.isAuthenticated()) {
                    const requiredRoles = route.data['roles'] as Array<string>;
                    if (!requiredRoles || requiredRoles.length === 0 || authService.hasAnyRole(requiredRoles)) {
                        return true;
                    }
                    toastService.error('Access Denied: You do not have permission to view this page.');
                    return false;
                }
                authService.purgeAuth();
                router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                return false;
            }),
            catchError(() => {
                authService.purgeAuth();
                router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
                return of(false);
            })
        );
    }

    // Both tokens expired or invalid
    authService.purgeAuth();
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
};
