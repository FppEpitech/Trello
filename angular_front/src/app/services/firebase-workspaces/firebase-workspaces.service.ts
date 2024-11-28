import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseWorkspacesService {

    constructor(private fs:AngularFirestore) { }

    getWorkspaces(): Observable<any[]> {
        return this.fs.collection('workspaces').valueChanges({ idField: 'id' });
    }

    addWorkspace(name:string) {
        return this.fs.collection('workspaces').add({name:name});
    }

    deleteWorkspace(workspaceId: string) {
        return this.fs.collection('workspaces').doc(workspaceId).delete();
    }
}
