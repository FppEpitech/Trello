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
                    ...board.payload.doc.data() as any
                }))),
                map(boards => boards.filter(board => board.closed !== true))
            );
    }

    getBoardsWithClosed(workspaceId: string): Observable<any[]> {
        return this.fs.collection(this.workspaceCollection)
            .doc(workspaceId)
            .collection('boards')
            .snapshotChanges()
            .pipe(
                map(boards => boards.map(board => ({
                    id: board.payload.doc.id,
                    ...board.payload.doc.data() as any
                }))),
                map(boards => boards.filter(board => board.closed && board.closed !== false))
            );
    }

    getBoardById(workspaceId: string, boardId: string): Observable<any> {
        return this.fs.collection(this.workspaceCollection)
            .doc(workspaceId)
            .collection('boards')
            .doc(boardId)
            .valueChanges();
    }

    addBoard(workspaceId: string, name: string) {
        return this.fs.collection(this.workspaceCollection)
            .doc(workspaceId)
            .collection('boards')
            .add({ name: name, createdAt: new Date() });
    }

    createFromTemplate(workspaceId: string, boardId: string, name: string) {
        this.fs.collection('templates').doc(boardId).get().subscribe((boardSnapshot: any) => {
            if (boardSnapshot.exists) {
                const boardData = boardSnapshot.data();
                const newBoardData = {
                    ...boardData,
                    name: name
                };

                this.fs
                    .collection(this.workspaceCollection)
                    .doc(workspaceId)
                    .collection('boards')
                    .add(newBoardData);
            } else {
                console.error('Board template not found.');
            }
        });
    }


    deleteBoard(workspaceId: string, boardId: string) {
        return this.fs.collection(this.workspaceCollection)
            .doc(workspaceId)
            .collection('boards')
            .doc(boardId)
            .delete();
    }

    setBoardClosed(workspaceId: string, boardId: string, closed: boolean) {
        return this.fs.collection(this.workspaceCollection)
            .doc(workspaceId)
            .collection('boards')
            .doc(boardId)
            .update({
                closed: closed
            });
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

    starBoard(workspaceId: string, boardId: string, userId: string) {
        return this.fs.collection(`workspaces/${workspaceId}/boards`)
            .doc(boardId)
            .update({
                stars: firebase.firestore.FieldValue.arrayUnion(userId)
            });
    }

    unstarBoard(workspaceId: string, boardId: string, userId: string) {
        return this.fs.collection(`workspaces/${workspaceId}/boards`)
            .doc(boardId)
            .update({
                stars: firebase.firestore.FieldValue.arrayRemove(userId)
            });
    }

    setRecentOpen(workspaceId: string, boardId: string) {
        // Set the date of the last open board
        return this.fs.collection(this.workspaceCollection)
            .doc(workspaceId)
            .collection('boards')
            .doc(boardId)
            .update({
                lastOpen: new Date()
            });
    }
}
