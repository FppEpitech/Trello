import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseBoardsService {

    constructor(private fs:AngularFirestore) { }

    getBoards(): Observable<any[]> {
        return this.fs.collection('boards').snapshotChanges().pipe(
        map(boards => boards.map(board => ({
            id: board.payload.doc.id,
            ...board.payload.doc.data() as object
        }))));
    }

    addBoard(name:string) {
        return this.fs.collection('boards').add({name:name});
    }

    deleteBoard(boardId: string) {
        return this.fs.collection('boards').doc(boardId).delete();
    }
}
