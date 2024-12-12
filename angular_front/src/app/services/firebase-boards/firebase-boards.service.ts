import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import firebase from 'firebase/compat/app'; // Import from compat

export interface Background {
    picture: string | null;
    color: string | null;
}

export interface NameBoard {
    name: string | null;
}

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

    getBoardBackground(workspaceId: string, boardId: string): Observable<Background> {
        return this.fs.collection(`workspaces/${workspaceId}/boards`)
            .doc(boardId)
            .valueChanges() as Observable<Background>;
    }

    addBackgroundToBoard(workspaceId: string, boardId: string, newBackground: Background) {
        return this.fs.collection(`workspaces/${workspaceId}/boards`)
            .doc(boardId)
            .update({
                picture: newBackground.picture,
                color: newBackground.color,
            });
    }

    getBoardName(workspaceId: string, boardId: string): Observable<NameBoard> {
        return this.fs.collection(`workspaces/${workspaceId}/boards`)
            .doc(boardId)
            .valueChanges() as Observable<NameBoard>;
    }
}
