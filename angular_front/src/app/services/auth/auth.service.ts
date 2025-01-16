import { NotificationSettings } from './../firebase-notifications/firebase-notifications.service';
import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider } from "@firebase/auth";
import { map, Observable, of, switchMap, take } from 'rxjs';

interface User {
    id: string;
    picture: string;
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

    deleteAccount() {
        this.auth.authState.pipe(take(1)).subscribe((user) => {
            if (user && user.email) {
                this.fs.collection('users').doc(user.email).delete();
                this.logout();
            }
        });
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

    getUserName(): Observable<string | null> {
        return this.auth.authState.pipe(
            switchMap((user) => {
                if (user?.email) {
                    return this.fs.collection('users').doc(user.email).valueChanges().pipe(
                        map((userDoc: any) => userDoc?.displayName || null)
                    );
                }
                return of(null);
            })
        );
    }

    getUserId(): Observable<string | null> {
        return this.auth.authState.pipe(
            map(user => user?.uid || null)
        );
    }

    getUserBio(): Observable<string | null> {
        return this.auth.authState.pipe(
            switchMap((user) => {
                if (user?.email) {
                    return this.fs.collection('users').doc(user.email).valueChanges().pipe(
                        map((userDoc: any) => userDoc?.bio || null)
                    );
                }
                return of(null);
            })
        );
    }

    setUserName(name: string) {
        this.auth.authState.subscribe((user) => {
            if (user && user.email) {
                this.fs.collection('users').doc(user.email).update({
                    displayName: name,
                });
            }
        });
    }

    setUserBio(bio: string) {
        this.auth.authState.subscribe((user) => {
            if (user && user.email) {
                this.fs.collection('users').doc(user.email).update({
                    bio: bio,
                });
            }
        });
    }

    syncUserToFirestore() {
        this.auth.authState.subscribe((user) => {
          if (user && user.email) {
            const email: string = user.email;
            this.fs.collection('users').doc(email).set({
                id: user.uid,
                email: email,
                displayName: user.displayName,
                picture: user.photoURL || 'Anonymous',
                createdAt: new Date(),
                bio: '',
                notificationSettings: {
                    workspace: true,
                    card: true,
                }
            });
          } else {
            console.log('No user logged in or email is null');
          }
        });
    }

    async getUserIdByEmail(email: string): Promise<string | null> {
        try {
            const snapshot = await this.fs.collection('users', ref => ref.where('email', '==', email)).get().toPromise();

            if (snapshot && !snapshot.empty) {
                const userData = snapshot.docs[0].data() as User;
                return userData['id'] || null;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user by email:', error);
            return null;
        }
    }

    async getUserPictureByEmail(email: string): Promise<string | null> {
        try {
            const snapshot = await this.fs.collection('users', ref => ref.where('email', '==', email)).get().toPromise();

            if (snapshot && !snapshot.empty) {
                const userData = snapshot.docs[0].data() as User;
                return userData['picture'] || null;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user by email:', error);
            return null;
        }
    }
}
