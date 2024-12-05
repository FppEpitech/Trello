import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app'; // Import from compat

@Injectable({
  providedIn: 'root'
})
export class FirebaseWorkspacesService {

    constructor(private fs:AngularFirestore) { }

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

    addMemberToWorkspace(workspaceId: string, userId: string): Promise<void> {
        return this.fs.collection('workspaces').doc(workspaceId).update({
            members: firebase.firestore.FieldValue.arrayUnion(userId)
        });
    }
}
