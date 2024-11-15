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
    checks: Check[];
}

export interface Member {
    name: string;
    profile: string;
}

export interface Cover {
    image: string | null;
    color: string | null;
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
    cover: Cover | null;
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

    addLabelToCard(boardId: string, listId: string, cardId: string, newLabel: Label) {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
            labels: firebase.firestore.FieldValue.arrayUnion(newLabel)
        });
    }

    deleteLabelFromCard(boardId: string, listId: string, cardId: string, labelId: string) {
        this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).get().toPromise().then(doc => {
            if (doc && doc.exists) {
                const data = doc.data() as Card;
                if (data && data.labels) {
                    const updatedLabels = data.labels.filter(label => label.id !== labelId);
                    return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
                        labels: updatedLabels
                    });
                }
            }
            return Promise.resolve();
        }).catch(error => {
            console.error("Error deleting label: ", error);
        });
    }

    getCardLabels(boardId: string, listId: string, cardId: string): Observable<Label[]> {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).snapshotChanges().pipe(
            map(action => {
                const data = action.payload.data() as Card | undefined;
                return data?.labels || [];
            })
        );
    }

    updateLabelIsCheck(boardId: string, listId: string, cardId: string, labelId: string, newIsCheckValue: boolean) {
        this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).get().toPromise().then(doc => {
            if (doc && doc.exists) {
                const data = doc.data() as Card;
                if (data && data.labels) {
                    const updatedLabels = data.labels.map(label => {
                        if (label.id === labelId) {
                            return { ...label, isCheck: newIsCheckValue };
                        }
                        return label;
                    });
                    return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
                        labels: updatedLabels
                    });
                }
            }
            return Promise.resolve();
        }).catch(error => {
            console.error("Error updating label's isCheck state: ", error);
        });
    }

    addCheckListToCard(boardId: string, listId: string, cardId: string, newChecklist: Checklists) {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
            checklists: firebase.firestore.FieldValue.arrayUnion(newChecklist)
        });
    }

    deleteCheckListFromCard(boardId: string, listId: string, cardId: string, checkListId: string) {
        this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).get().toPromise().then(doc => {
            if (doc && doc.exists) {
                const data = doc.data() as Card;
                if (data && data.checklists) {
                    const updatedChecklists = data.checklists.filter(checklists => checklists.id !== checkListId);
                    return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
                        checklists: updatedChecklists
                    });
                }
            }
            return Promise.resolve();
        }).catch(error => {
            console.error("Error deleting checklists: ", error);
        });
    }

    getCardCheckLists(boardId: string, listId: string, cardId: string): Observable<Checklists[]> {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).snapshotChanges().pipe(
            map(action => {
                const data = action.payload.data() as Card | undefined;
                return data?.checklists || [];
            })
        );
    }

    addCheckToCheckList(boardId: string, listId: string, cardId: string, checklistId: string, newCheck: Check) {
        this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).get().toPromise().then(doc => {
            if (doc && doc.exists) {
                const data = doc.data() as Card;
                if (data && data.checklists) {
                    const updatedChecklists = data.checklists.map(checklist => {
                        if (checklist.id === checklistId) {
                            checklist.checks.push(newCheck);
                        }
                        return checklist;
                    });
                    return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
                        checklists: updatedChecklists
                    });
                }
            }
            return Promise.resolve();
        }).catch(error => {
            console.error("Error adding check to checklist: ", error);
        });
    }

    deleteCheckFromCheckList(boardId: string, listId: string, cardId: string, checklistId: string, checkId: string) {
        this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).get().toPromise().then(doc => {
            if (doc && doc.exists) {
                const data = doc.data() as Card;
                if (data && data.checklists) {
                    const updatedChecklists = data.checklists.map(checklist => {
                        if (checklist.id === checklistId) {
                            checklist.checks = checklist.checks.filter(check => check.id !== checkId);
                        }
                        return checklist;
                    });
                    return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
                        checklists: updatedChecklists
                    });
                }
            }
            return Promise.resolve();
        }).catch(error => {
            console.error("Error deleting check from checklist: ", error);
        });
    }

    updateCheckInCheckList(boardId: string, listId: string, cardId: string, checklistId: string, updatedCheck: Check) {
        this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).get().toPromise().then(doc => {
            if (doc && doc.exists) {
                const data = doc.data() as Card;
                if (data && data.checklists) {
                    const updatedChecklists = data.checklists.map(checklist => {
                        if (checklist.id === checklistId) {
                            checklist.checks = checklist.checks.map(check =>
                                check.id === updatedCheck.id ? { ...check, ...updatedCheck } : check
                            );
                        }
                        return checklist;
                    });
                    return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
                        checklists: updatedChecklists
                    });
                }
            }
            return Promise.resolve();
        }).catch(error => {
            console.error("Error updating check in checklist: ", error);
        });
    }

    getDateOfCard(boardId: string, listId: string, cardId: string): Observable<Date | null> {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).snapshotChanges().pipe(
            map(action => {
                const data = action.payload.data() as Card | undefined;
                if (data?.date instanceof firebase.firestore.Timestamp) {
                    return data.date.toDate();
                }
                return null;
            })
        );
    }

    addDateToCard(boardId: string, listId: string, cardId: string, date: Date | null) {
        const firestoreDate = date ? firebase.firestore.Timestamp.fromDate(date) : null;
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
            date: date
        });
    }

    deleteDateFromCard(boardId: string, listId: string, cardId: string) {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
            date: null
        });
    }

    addOrUpdateCover(boardId: string, listId: string, cardId: string, cover: Cover) {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
            cover: cover
        });
    }

    deleteCoverFromCard(boardId: string, listId: string, cardId: string) {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
            cover: null
        });
    }

    getCardCover(boardId: string, listId: string, cardId: string): Observable<Cover | null> {
        return this.fs.collection(`boards/${boardId}/lists/${listId}/cards`).doc(cardId).snapshotChanges().pipe(
            map(action => {
                const data = action.payload.data() as Card | undefined;
                return data?.cover || null;
            })
        );
    }
}
