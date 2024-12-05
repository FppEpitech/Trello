import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom, map, Observable } from 'rxjs';
import firebase from 'firebase/compat/app'; // Import from compat
import { AuthService } from '../auth/auth.service';

interface Member {
    id: string;
    picture: string | null;
}

interface Workspace {
    id: string;
    name: string;
    owner: string;
    members: Member[];
    memberIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseWorkspacesService {

    constructor(
        private fs:AngularFirestore,
        private svAuth: AuthService

    ) { }

    getWorkspaces(userId: string): Observable<any[]> {
        return this.fs.collection('workspaces', ref => ref.where('memberIds', 'array-contains', userId))
          .valueChanges({ idField: 'id' });
      }

    async addWorkspace(name: string, userId: string) {
        try {
            const userPicture = await firstValueFrom(this.svAuth.getUserProfileImage());
            const userEmail = await firstValueFrom(this.svAuth.getUserEmail());
            await this.fs.collection('workspaces').add({
                name: name,
                owner: userId,
                members: [{ id: userId, picture: userPicture, email: userEmail }], // Add creator as a member
                memberIds: [userId] // Add creator's ID to memberIds
            });
        } catch (error) {
            console.error('Error creating workspace:', error);
            throw error;
        }
    }

    deleteWorkspace(workspaceId: string) {
        return this.fs.collection('workspaces').doc(workspaceId).delete();
    }

    async addMemberToWorkspace(workspaceId: string, userId: string, userPicture: string, email: string): Promise<void> {
        try {
            const workspaceDocRef = this.fs.collection('workspaces').doc(workspaceId);
            const workspaceSnapshot = await workspaceDocRef.get().toPromise();
            if (!workspaceSnapshot?.exists) {
                throw new Error('Workspace does not exist');
            }
            await workspaceDocRef.update({
                members: firebase.firestore.FieldValue.arrayUnion({ id: userId, picture: userPicture, email: email }),
                memberIds: firebase.firestore.FieldValue.arrayUnion(userId)
            });
        } catch (error) {
            console.error('Error adding member to workspace:', error);
            throw error;
        }
    }

    getMemberOfWorkspace(workspaceId: string) {
        return this.fs.collection('workspaces').doc(workspaceId).valueChanges().pipe(
            map((workspace: any) => workspace?.members || [])
        );
    }
}
