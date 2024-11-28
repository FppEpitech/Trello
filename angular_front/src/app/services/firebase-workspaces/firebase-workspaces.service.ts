import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseWorkspacesService {

    constructor(private fs:AngularFirestore) { }

    // getWorkspaces(): Observable<any[]> {
    //     return this.fs.collection('workspaces').valueChanges({ idField: 'id' });
    // }

    // addWorkspace(name:string) {
    //     return this.fs.collection('workspaces').add({name:name});
    // }

    getWorkspaces(userId: string): Observable<any[]> {
        return this.fs.collection('workspaces', ref => ref.where('members', 'array-contains', userId))
          .valueChanges({ idField: 'id' });
      }

    addWorkspace(name: string, userId: string) {
        return this.fs.collection('workspaces').add({
          name: name,
          owner: userId,
          members: [userId], // Add the creator as a member
        });
      }

    deleteWorkspace(workspaceId: string) {
        return this.fs.collection('workspaces').doc(workspaceId).delete();
    }
}


// import { AuthService } from './../auth/auth.service';
// import { Injectable } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// // import { AuthService } from './auth.service';  // Import AuthService
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class FirebaseWorkspacesService {

//   constructor(
//     private fs: AngularFirestore,
//     private authService: AuthService  // Inject AuthService to get user data
//   ) {}

//   getWorkspaces(): Observable<any[]> {
//     return this.fs.collection('workspaces').valueChanges({ idField: 'id' });
//   }

//   // Updated method to add a workspace with the user who created it
//   addWorkspace(name: string) {
//     return this.authService.authState$.pipe(
//       map(user => {
//         console.log("aaaaa")
//         if (user) {
//           const userId = user.uid; // Get the user ID from auth state
//           const workspaceData = {
//             name: name,
//             users: { [userId]: true }, // Add the user as the first authorized user
//             createdAt: new Date(),
//           };
//           // Add the workspace to Firestore with the user data
//           return this.fs.collection('workspaces').add(workspaceData);
//         } else {
//           throw new Error('User is not authenticated');
//         }
//       })
//     );
//   }

//   deleteWorkspace(workspaceId: string) {
//     return this.fs.collection('workspaces').doc(workspaceId).delete();
//   }
// }
