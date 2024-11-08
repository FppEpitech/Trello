import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

export interface Card {
    id: string;
    name: string;
    description: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseCardsService {

    constructor(private fs:AngularFirestore) { }

    getCards(boardId: string, listId: string): Observable<any[]> {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).snapshotChanges().pipe(
            map(actions => actions.map(card => {
                const cardData = card.payload.doc.data() as Omit<Card, 'id'>;
                return {
                    id: card.payload.doc.id,
                    ...cardData
                };
            }))
        );
    }

    addCardToList(boardId: string, listId: string, card: Card) {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).add({name:card.name, description:card.description});
    }

    deleteCardFromList(boardId: string, listId: string, cardId: string) {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).delete();
    }

    addName(boardId: string, listId: string, cardId: string, name: string) {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({ name });
    }

    addDescription(boardId: string, listId: string, cardId: string, description: string) {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({ description });
    }

    getDescription(boardId: string, listId: string, cardId: string): Observable<string | null> {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).snapshotChanges().pipe(
            map(action => {
                const data = action.payload.data() as { description?: string };
                return data ? data.description ?? null : null;
            })
        );
    }
}
