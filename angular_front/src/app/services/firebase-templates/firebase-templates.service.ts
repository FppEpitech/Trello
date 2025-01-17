import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class FirebaseTemplatesService {

    private templateCollection = 'templates';

    constructor(private fs: AngularFirestore) { }

    createTemplate(workspaceId: string, boardId: string) {
        this.fs.collection('workspaces')
            .doc(workspaceId)
            .collection('boards')
            .doc(boardId)
            .get()
            .subscribe(boardDoc => {
                if (!boardDoc.exists) {
                    console.error('Board does not exist');
                    return;
                }

                const boardData = boardDoc.data() || {};

                this.fs.collection(this.templateCollection).add(boardData)
                    .then(newBoardDoc => {
                        const newBoardId = newBoardDoc.id;

                        this.fs.collection('workspaces')
                            .doc(workspaceId)
                            .collection('boards')
                            .doc(boardId)
                            .collection('lists')
                            .get()
                            .subscribe(listsSnapshot => {
                                listsSnapshot.forEach(listDoc => {
                                    const listData = listDoc.data();
                                    const listId = listDoc.id;

                                    this.fs.collection(this.templateCollection)
                                        .doc(newBoardId)
                                        .collection('lists')
                                        .doc(listId)
                                        .set(listData);

                                    this.fs.collection('workspaces')
                                        .doc(workspaceId)
                                        .collection('boards')
                                        .doc(boardId)
                                        .collection('lists')
                                        .doc(listId)
                                        .collection('cards')
                                        .get()
                                        .subscribe(cardsSnapshot => {
                                            cardsSnapshot.forEach(cardDoc => {
                                                const cardData = cardDoc.data();
                                                const cardId = cardDoc.id;

                                                this.fs.collection(this.templateCollection)
                                                    .doc(newBoardId)
                                                    .collection('lists')
                                                    .doc(listId)
                                                    .collection('cards')
                                                    .doc(cardId)
                                                    .set(cardData);
                                            });
                                        });
                                });
                            });
                    })
                    .catch(error => console.error('Error creating template:', error));
            });
    }


    getTemplates() {
        return this.fs.collection(this.templateCollection).valueChanges({ idField: 'id' });
    }
}
