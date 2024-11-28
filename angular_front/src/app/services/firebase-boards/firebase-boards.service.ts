import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseBoardsService {

    private workspaceCollection = 'workspaces';

    constructor(private fs: AngularFirestore) { }

    getBoards(workspaceId: string): Observable<any[]> {
        return this.fs.collection(this.workspaceCollection)
            .doc(workspaceId)
            .collection('boards')
            .snapshotChanges()
            .pipe(
                map(boards => boards.map(board => ({
                    id: board.payload.doc.id,
                    ...board.payload.doc.data() as object
                })))
            );
    }

    addBoard(workspaceId: string, name: string) {
        return this.fs.collection(this.workspaceCollection)
            .doc(workspaceId)
            .collection('boards')
            .add({ name: name, createdAt: new Date() });
    }

    deleteBoard(workspaceId: string, boardId: string) {
        return this.fs.collection(this.workspaceCollection)
            .doc(workspaceId)
            .collection('boards')
            .doc(boardId)
            .delete();
    }
}
