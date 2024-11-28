import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseListsService {

    private workspaceCollection = 'workspaces';

    constructor(private fs: AngularFirestore) {}

    getLists(workspaceId: string, boardId: string): Observable<any[]> {
        return this.fs.collection(`${this.workspaceCollection}/${workspaceId}/boards/${boardId}/lists`)
            .snapshotChanges()
            .pipe(
                map(lists => lists.map(list => ({
                    id: list.payload.doc.id,
                    ...list.payload.doc.data() as object
                })))
            );
    }

    getListById(workspaceId: string, boardId: string, listId: string): Observable<any> {
        return this.fs.collection(`${this.workspaceCollection}/${workspaceId}/boards/${boardId}/lists`)
            .doc(listId)
            .snapshotChanges()
            .pipe(
                map(snapshot => {
                    const data = snapshot.payload.data();
                    return data ? { id: snapshot.payload.id, ...data as object } : null;
                })
            );
    }

    addList(workspaceId: string, boardId: string, name: string): Promise<any> {
        return this.fs.collection(`${this.workspaceCollection}/${workspaceId}/boards/${boardId}/lists`)
            .add({ name: name, createdAt: new Date() });
    }

    deleteList(workspaceId: string, boardId: string, listId: string): Promise<void> {
        return this.fs.collection(`${this.workspaceCollection}/${workspaceId}/boards/${boardId}/lists`)
            .doc(listId)
            .delete();
    }
}
