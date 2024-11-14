import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';
import firebase from 'firebase/compat/app'; // Import from compat

export interface Label {
    id: string;
    name: string;
    color: string;
    isCheck: boolean;
}

export interface Check {
    id: string;
    name: string;
    state: boolean;
}

export interface Checklists {
    id: string;
    name: string;
    checks: [Check];
}

export interface Member {
    name: string;
    profile: string;
}

export interface Card {
    id: string;
    name: string;
    description: string;
    members: Member[];
    notifications: string[];
    labels: Label[];
    checklists: Checklists[];
    date: Date | null;
    attachment: string[];
    cover: string;
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

    addMemberToCard(boardId: string, listId: string, cardId: string, newMember: Member) {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
            members: firebase.firestore.FieldValue.arrayUnion(newMember)
        });
    }

    deleteMemberFromCard(boardId: string, listId: string, cardId: string, memberToRemove: Member) {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
            members: firebase.firestore.FieldValue.arrayRemove(memberToRemove)
        });
    }

    getCardMembers(boardId: string, listId: string, cardId: string): Observable<Member[]> {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).snapshotChanges().pipe(
            map(action => {
                const data = action.payload.data() as Card | undefined;
                return data?.members || [];
            })
        );
    }
}
