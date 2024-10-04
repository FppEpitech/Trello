import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider } from "@firebase/auth";
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private auth: AngularFireAuth = inject(AngularFireAuth);
    authState$ = this.auth.authState;

    constructor(private angularFireAuth: AngularFireAuth, private router:Router) {}

    async GoogleAuth() {
        const creds = await this.angularFireAuth.signInWithPopup(
            new GoogleAuthProvider(),
        );
        this.router.navigate(['/home']);
    }

    logout() {
        this.angularFireAuth.signOut().then(() => {
            this.router.navigate(['/login']);
        });
    }

    // Returns true if user is logged in, false otherwise
    isLogged(): Observable<boolean> {
        return this.authState$.pipe(
          map(user => {
            if (user != null) {
                return true;
            } else {
                this.router.navigate(['/login']);
                return false;
            }}
        ));
    }

    // AuthLogin(provider : any) {
    //   return signInWithPopup(provider).then((result) => {
    //     console.log("User logged in.");
    //     this.router.navigate(['/home']);
    //   });
    // }
}
