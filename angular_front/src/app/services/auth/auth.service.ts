import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider } from "@firebase/auth";
import { map, Observable } from 'rxjs';

interface User {
    id: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private auth: AngularFireAuth = inject(AngularFireAuth);
    authState$ = this.auth.authState;

    constructor(private angularFireAuth: AngularFireAuth,
        private fs: AngularFirestore,
        private router:Router) {}

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

    // Returns false if user is logged in, true otherwise
    isNotLogged(): Observable<boolean> {
        return this.authState$.pipe(
          map(user => {
            if (user != null) {
                return false;
            } else {
                return true;
            }}
        ));
    }

    getUserEmail(): Observable<string | null> {
        return this.authState$.pipe(
            map(user => user ? user.email : null)
        );
    }

    getUserProfileImage(): Observable<string | null> {
        return this.angularFireAuth.authState.pipe(
          map(user => user?.photoURL || null)
        );
    }

    syncUserToFirestore() {
        this.auth.authState.subscribe((user) => {
          if (user && user.email) {
            const email: string = user.email;
            this.fs.collection('users').doc(email).set({ id: user.uid, email: email, displayName: user.displayName || 'Anonymous', createdAt: new Date() });
          } else {
            console.log('No user logged in or email is null');
          }
        });
    }

    // async getUserIdByEmail(email: string): Promise<string | null> {
    //     try {
    //         const snapshot = await this.fs.collection('users', ref => ref.where('email', '==', email)).get().toPromise();
    //         if (snapshot && !snapshot.empty) {
    //             return snapshot.docs[0].id;
    //         }
    //         return null;
    //     } catch (error) {
    //         console.error('Error fetching user by email:', error);
    //         return null;
    //     }
    // }

    async getUserIdByEmail(email: string): Promise<string | null> {
        try {
            const snapshot = await this.fs.collection('users', ref => ref.where('email', '==', email)).get().toPromise();

            if (snapshot && !snapshot.empty) {
                const userData = snapshot.docs[0].data() as User;
                return userData['id'] || null;
            }
            return null; // If no user with the email is found
        } catch (error) {
            console.error('Error fetching user by email:', error);
            return null;
        }
    }


}
