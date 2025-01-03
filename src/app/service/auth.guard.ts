import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route, state): Observable<boolean | import('@angular/router').UrlTree> => {
  /**
  * Guard function to protect routes from unauthenticated access.
  * @param route - The activated route snapshot.
  * @param state - The router state snapshot.
  * @returns An observable that resolves to true if the user is authenticated, or redirects to the login page if not.
  */
  const router = inject(Router);
  const authService = inject(AuthService);
  // const isAuthenticated = authService.isAuthenticated();

  return authService.isAuthenticated().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      } else {
        return router.createUrlTree(['/login']);
      }
    })
  );
};

