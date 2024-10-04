// auth.guard.ts
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { inject } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AuthService } from "../services/auth.service";
import { map, Observable } from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);

    return authService.isLogged();
};
