import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCardsService {

    constructor(private fs:AngularFirestore) { }

    getLists(): Observable<any[]> {
        return this.fs.collection('lists').snapshotChanges().pipe(
        map(lists => lists.map(list => ({
            id: list.payload.doc.id,
            ...list.payload.doc.data() as object,
            cards: this.fs.collection(`lists/${list.payload.doc.id}/cards`).valueChanges()
        })))
        );
    }

    addList(name:string) {
        return this.fs.collection('lists').add({name:name});
    }

    deleteList(cardId: string) {
        return this.fs.collection('lists').doc(cardId).delete();
    }

    addCardToList(listId: string, card: { name: string }) {
        return this.fs.collection(`lists/${listId}/cards`).add(card);
    }

    deleteCardFromList(listId: string, cardId: string) {
        return this.fs.collection(`lists/${listId}/cards`).doc(cardId).delete();
    }
}
