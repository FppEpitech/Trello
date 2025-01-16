import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseTemplatesService {

    private templateCollection = 'templates';

    constructor(private fs: AngularFirestore) { }

    createTemplate(workspaceId: string, boardId: string) {
        this.fs.collection('workspaces').doc(workspaceId).collection('boards').doc(boardId).get().subscribe(board => {
            this.fs.collection(this.templateCollection).add(board.data() || {});
        });
    }

    getTemplates() {
        return this.fs.collection(this.templateCollection).valueChanges({ idField: 'id' });
    }
}
