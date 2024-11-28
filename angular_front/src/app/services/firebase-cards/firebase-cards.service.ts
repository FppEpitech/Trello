import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom, forkJoin, map, Observable, of, switchMap } from 'rxjs';
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

export interface Attachment {
    id: string;
    name: string;
    content: string | null;
}

interface DueDate {
    date: firebase.firestore.Timestamp;
    cardName: string;
    listId: string;
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
    attachment: Attachment[];
    cover: Cover | null;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseCardsService {

    constructor(private fs:AngularFirestore) { }

    getCards(workspaceId: string, boardId: string, listId: string): Observable<any[]> {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).snapshotChanges().pipe(
            map(actions => actions.map(card => {
                const cardData = card.payload.doc.data() as Omit<Card, 'id'>;
                return {
                    id: card.payload.doc.id,
                    ...cardData
                };
            }))
        );
    }

    getCardById(workspaceId: string, boardId: string, listId: string, cardId: string): Observable<Card | null> {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).snapshotChanges().pipe(
            map(action => {
                const data = action.payload.data() as Omit<Card, 'id'> | undefined;
                if (data) {
                    return { ...data, id: cardId };
                }
                return null;
            })
        );
    }

    async addCardToList(workspaceId: string, boardId: string, listId: string, card: Card): Promise<void> {
        const cardData = {
            name: card.name,
            description: card.description,
            members: card.members || [],
            notifications: card.notifications || [],
            labels: card.labels || [],
            checklists: card.checklists || [],
            date: card.date || null,
            attachment: card.attachment || [],
            cover: card.cover || null
        };
        const docRef = await this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).add(cardData);
        if (card.date) {
            if (cardData?.date) {
                let firestoreDate: firebase.firestore.Timestamp;

                if (cardData.date instanceof firebase.firestore.Timestamp) {
                    firestoreDate = cardData.date;
                } else {
                    const date = cardData.date instanceof Date ? cardData.date : new Date(cardData.date);
                    firestoreDate = firebase.firestore.Timestamp.fromDate(date);
                }
                await this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/dates`).doc(docRef.id).set({
                    date: firestoreDate,
                    cardName: card.name,
                    listId: listId
                });
            }
        }
    }

    async deleteCardFromList(workspaceId: string, boardId: string, listId: string, cardId: string): Promise<void> {
        try {
            const cardRef = this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId);
            const cardSnapshot = await firstValueFrom(cardRef.get());
            if (cardSnapshot.exists) {
                const cardData = cardSnapshot.data() as Card;
                if (cardData?.date) {
                    await this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/dates`).doc(cardId).delete();
                }
                await cardRef.delete();
            } else {
                console.warn(`Card with ID ${cardId} does not exist in list ${listId}.`);
            }
        } catch (error) {
            console.error("Error deleting card from list:", error);
            throw error;
        }
    }

    addName(workspaceId: string, boardId: string, listId: string, cardId: string, name: string) {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({ name });
    }

    addDescription(workspaceId: string, boardId: string, listId: string, cardId: string, description: string) {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({ description });
    }

    getDescription(workspaceId: string, boardId: string, listId: string, cardId: string): Observable<string | null> {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).snapshotChanges().pipe(
            map(action => {
                const data = action.payload.data() as { description?: string };
                return data ? data.description ?? null : null;
            })
        );
    }

    addMemberToCard(workspaceId: string, boardId: string, listId: string, cardId: string, newMember: Member) {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
            members: firebase.firestore.FieldValue.arrayUnion(newMember)
        });
    }

    deleteMemberFromCard(workspaceId: string, boardId: string, listId: string, cardId: string, memberToRemove: Member) {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
            members: firebase.firestore.FieldValue.arrayRemove(memberToRemove)
        });
    }

    getCardMembers(workspaceId: string, boardId: string, listId: string, cardId: string): Observable<Member[]> {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).snapshotChanges().pipe(
            map(action => {
                const data = action.payload.data() as Card | undefined;
                return data?.members || [];
            })
        );
    }

    addLabelToCard(workspaceId: string, boardId: string, listId: string, cardId: string, newLabel: Label) {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
            labels: firebase.firestore.FieldValue.arrayUnion(newLabel)
        });
    }

    deleteLabelFromCard(workspaceId: string, boardId: string, listId: string, cardId: string, labelId: string) {
        this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).get().toPromise().then(doc => {
            if (doc && doc.exists) {
                const data = doc.data() as Card;
                if (data && data.labels) {
                    const updatedLabels = data.labels.filter(label => label.id !== labelId);
                    return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
                        labels: updatedLabels
                    });
                }
            }
            return Promise.resolve();
        }).catch(error => {
            console.error("Error deleting label: ", error);
        });
    }

    getCardLabels(workspaceId: string, boardId: string, listId: string, cardId: string): Observable<Label[]> {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).snapshotChanges().pipe(
            map(action => {
                const data = action.payload.data() as Card | undefined;
                return data?.labels || [];
            })
        );
    }

    updateLabelIsCheck(workspaceId: string, boardId: string, listId: string, cardId: string, labelId: string, newIsCheckValue: boolean) {
        this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).get().toPromise().then(doc => {
            if (doc && doc.exists) {
                const data = doc.data() as Card;
                if (data && data.labels) {
                    const updatedLabels = data.labels.map(label => {
                        if (label.id === labelId) {
                            return { ...label, isCheck: newIsCheckValue };
                        }
                        return label;
                    });
                    return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
                        labels: updatedLabels
                    });
                }
            }
            return Promise.resolve();
        }).catch(error => {
            console.error("Error updating label's isCheck state: ", error);
        });
    }

    addCheckListToCard(workspaceId: string, boardId: string, listId: string, cardId: string, newChecklist: Checklists) {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
            checklists: firebase.firestore.FieldValue.arrayUnion(newChecklist)
        });
    }

    deleteCheckListFromCard(workspaceId: string, boardId: string, listId: string, cardId: string, checkListId: string) {
        this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).get().toPromise().then(doc => {
            if (doc && doc.exists) {
                const data = doc.data() as Card;
                if (data && data.checklists) {
                    const updatedChecklists = data.checklists.filter(checklists => checklists.id !== checkListId);
                    return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
                        checklists: updatedChecklists
                    });
                }
            }
            return Promise.resolve();
        }).catch(error => {
            console.error("Error deleting checklists: ", error);
        });
    }

    getCardCheckLists(workspaceId: string, boardId: string, listId: string, cardId: string): Observable<Checklists[]> {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).snapshotChanges().pipe(
            map(action => {
                const data = action.payload.data() as Card | undefined;
                return data?.checklists || [];
            })
        );
    }

    addCheckToCheckList(workspaceId: string, boardId: string, listId: string, cardId: string, checklistId: string, newCheck: Check) {
        this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).get().toPromise().then(doc => {
            if (doc && doc.exists) {
                const data = doc.data() as Card;
                if (data && data.checklists) {
                    const updatedChecklists = data.checklists.map(checklist => {
                        if (checklist.id === checklistId) {
                            checklist.checks.push(newCheck);
                        }
                        return checklist;
                    });
                    return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
                        checklists: updatedChecklists
                    });
                }
            }
            return Promise.resolve();
        }).catch(error => {
            console.error("Error adding check to checklist: ", error);
        });
    }

    deleteCheckFromCheckList(workspaceId: string, boardId: string, listId: string, cardId: string, checklistId: string, checkId: string) {
        this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).get().toPromise().then(doc => {
            if (doc && doc.exists) {
                const data = doc.data() as Card;
                if (data && data.checklists) {
                    const updatedChecklists = data.checklists.map(checklist => {
                        if (checklist.id === checklistId) {
                            checklist.checks = checklist.checks.filter(check => check.id !== checkId);
                        }
                        return checklist;
                    });
                    return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
                        checklists: updatedChecklists
                    });
                }
            }
            return Promise.resolve();
        }).catch(error => {
            console.error("Error deleting check from checklist: ", error);
        });
    }

    updateCheckInCheckList(workspaceId: string, boardId: string, listId: string, cardId: string, checklistId: string, updatedCheck: Check) {
        this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).get().toPromise().then(doc => {
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
                    return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
                        checklists: updatedChecklists
                    });
                }
            }
            return Promise.resolve();
        }).catch(error => {
            console.error("Error updating check in checklist: ", error);
        });
    }

    getDateOfCard(workspaceId: string, boardId: string, listId: string, cardId: string): Observable<Date | null> {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).snapshotChanges().pipe(
            map(action => {
                const data = action.payload.data() as Card | undefined;
                if (data?.date instanceof firebase.firestore.Timestamp) {
                    return data.date.toDate();
                }
                return null;
            })
        );
    }

    addDateToCard(workspaceId: string, boardId: string, listId: string, cardId: string, date: Date | null) {
        const firestoreDate = date ? firebase.firestore.Timestamp.fromDate(date) : null;
        const cardRef = this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId);
        const dateRef = this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/dates`).doc(cardId);
        return this.fs.firestore.runTransaction(async (transaction) => {
            const cardDoc = await transaction.get(cardRef.ref);
            if (!cardDoc.exists) {
                throw new Error('Card not found');
            }
            const cardData = cardDoc.data() as Card;
            const cardName = cardData?.name || 'Unnamed Card';
            transaction.update(cardRef.ref, {
                date: firestoreDate
            });
            transaction.set(dateRef.ref, {
                date: firestoreDate,
                cardName: cardName,
                listId: listId
            });
            return Promise.resolve();
        });
    }

    deleteDateFromCard(workspaceId: string, boardId: string, listId: string, cardId: string) {
        const cardRef = this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId);
        const dateRef = this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/dates`).doc(cardId);
        return this.fs.firestore.runTransaction(async (transaction) => {
            transaction.update(cardRef.ref, {
                date: null
            });
            transaction.delete(dateRef.ref);
            return Promise.resolve();
        });
    }

    getAllDueDates(workspaceId: string, boardId: string): Observable<{ cardId: string; listId: string; dueDate: Date | null; cardName: string }[]> {
    return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/dates`).snapshotChanges().pipe(
        map(snapshot =>
            snapshot.map(doc => {
                const data = doc.payload.doc.data() as DueDate;
                const cardId = doc.payload.doc.id;
                const dueDate = data.date ? data.date.toDate() : null;
                const cardName = data.cardName || 'Unnamed Card';
                const listId = data.listId;
                return { cardId, listId, dueDate, cardName };
            })
        ));
    }

    addOrUpdateCover(workspaceId: string, boardId: string, listId: string, cardId: string, cover: Cover) {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
            cover: cover
        });
    }

    deleteCoverFromCard(workspaceId: string, boardId: string, listId: string, cardId: string) {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
            cover: null
        });
    }

    getCardCover(workspaceId: string, boardId: string, listId: string, cardId: string): Observable<Cover | null> {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).snapshotChanges().pipe(
            map(action => {
                const data = action.payload.data() as Card | undefined;
                return data?.cover || null;
            })
        );
    }

    addAttachmentToCard(workspaceId: string, boardId: string, listId: string, cardId: string, newAttachment: Attachment) {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
            attachment: firebase.firestore.FieldValue.arrayUnion(newAttachment)
        });
    }

    deleteAttachmentFromCard(workspaceId: string, boardId: string, listId: string, cardId: string, attachmentId: string) {
        this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).get().toPromise().then(doc => {
            if (doc && doc.exists) {
                const data = doc.data() as Card;
                if (data && data.attachment) {
                    const updatedAttachments = data.attachment.filter(att => att.id !== attachmentId);
                    return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).update({
                        attachment: updatedAttachments
                    });
                }
            }
            return Promise.resolve();
        }).catch(error => {
            console.error("Error deleting attachment: ", error);
        });
    }

    getCardAttachments(workspaceId: string, boardId: string, listId: string, cardId: string): Observable<Attachment[]> {
        return this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).snapshotChanges().pipe(
            map(action => {
                const data = action.payload.data() as Card | undefined;
                return data?.attachment || [];
            })
        );
    }

    downloadAttachment(workspaceId: string, boardId: string, listId: string, cardId: string, attachmentId: string): void {
        this.fs.collection(`workspaces/${workspaceId}/boards/${boardId}/lists/${listId}/cards`).doc(cardId).get().toPromise().then(doc => {
            if (doc && doc.exists) {
                const data = doc.data() as { attachment: Attachment[] };
                const attachment = data?.attachment?.find(att => att.id === attachmentId);

                if (attachment && attachment.content) {
                const fileBlob = this.base64ToBlob(attachment.content);
                this.downloadBlob(fileBlob, attachment.name);
                }
            }
        }).catch(error => {
            console.error("Error downloading attachment: ", error);
        });
    }

    private base64ToBlob(base64: string): Blob {
        const byteCharacters = atob(base64.split(',')[1]);
        const byteArrays = new Uint8Array(byteCharacters.length);

        for (let offset = 0; offset < byteCharacters.length; offset++) {
            byteArrays[offset] = byteCharacters.charCodeAt(offset);
        }

        return new Blob([byteArrays], { type: 'application/octet-stream' });
    }

    private downloadBlob(blob: Blob, fileName: string): void {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }
}
