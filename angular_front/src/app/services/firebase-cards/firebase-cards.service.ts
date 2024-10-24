import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCardsService {

    constructor(private fs:AngularFirestore) { }

    getCards(boardId: string, listId: string): Observable<any[]> {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).snapshotChanges().pipe(
        map(actions => actions.map(card => ({
            id: card.payload.doc.id,
            ...card.payload.doc.data() as object
        })))
        );
    }

    addCardToList(boardId: string, listId: string, name: string) {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).add({name:name});
    }

    deleteCardFromList(boardId: string, listId: string, cardId: string) {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).delete();
    }
}
