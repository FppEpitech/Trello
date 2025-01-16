import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; // Import from compat

@Injectable({
  providedIn: 'root'
})
export class FirebaseActivitiesService {

    private activityCollection = 'activities';

    constructor(private fs: AngularFirestore) { }

    //set activity for a user
    setActivity(userId: string, activity: string) {
        const activityData = { activity: activity, createdAt: new Date() };
        return this.fs.collection(this.activityCollection)
            .doc(userId)
            .set({
                activities: firebase.firestore.FieldValue.arrayUnion(activityData)
            }, { merge: true });
    }

    //get activities for a user
    getActivities(userId: string) {
        return this.fs.collection(this.activityCollection)
            .doc(userId)
            .snapshotChanges();
    }
}
