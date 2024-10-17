import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseCardsService {

    constructor(private fs:AngularFirestore) { }

    getLists(): Observable<any[]> {
        return this.fs.collection('lists').valueChanges();
    }

    addList(name:string) {
        return this.fs.collection('lists').add({name:name});
    }

    deleteList(cardId: string) {
        return this.fs.collection('lists').doc(cardId).delete();
    }
}
