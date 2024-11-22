import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseListsService {

    constructor(private fs:AngularFirestore) { }

    getLists(boardId: string): Observable<any[]> {
        return this.fs.collection(`boards/${boardId}/lists`).snapshotChanges().pipe(
        map(lists => lists.map(list => ({
            id: list.payload.doc.id,
            ...list.payload.doc.data() as object
        })))
        );
    }

    getListById(boardId: string, listId: string): Observable<any> {
        return this.fs.collection(`boards/${boardId}/lists`).doc(listId).snapshotChanges().pipe(
            map(snapshot => {
                const data = snapshot.payload.data();
                return data ? { id: snapshot.payload.id, ...data as object } : null;
            })
        );
    }

    addList(boardId: string, name:string) {
        return this.fs.collection(`boards/${boardId}/lists`).add({name:name});
    }

    deleteList(boardId: string, listId: string) {
        return this.fs.collection(`boards/${boardId}/lists`).doc(listId).delete();
    }
}
