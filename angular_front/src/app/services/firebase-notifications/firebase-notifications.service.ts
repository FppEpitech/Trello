import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface Notification {
  id?: string;
  senderEmail: string;
  recipientEmail: string;
  message: string;
  timestamp: Date;
  status: 'unread' | 'read';
}

@Injectable({
  providedIn: 'root',
})
export class FirebaseNotificationsService {
    private notificationsCollection = this.firestore.collection<Notification>('notifications');

    constructor(private firestore: AngularFirestore,
        private svAuth: AuthService
    ) {}

    // Send a notification
    sendNotification(notification: Omit<Notification, 'id'>): Promise<void> {
        const id = this.firestore.createId();
        return this.notificationsCollection.doc(id).set({ ...notification, timestamp: new Date() });
    }

    // Get notification of the actual user
    getNotifications(): Observable<any[]> {
        return this.svAuth.authState$.pipe(
            switchMap(user => {
                if (user && user.email) {
                    return this.firestore.collection('notifications', ref =>
                        ref.where('recipientEmail', '==', user.email)
                    ).valueChanges();
                } else {
                    return [];
                }
            })
        );
    }

    // Mark a notification as read
    markAsRead(notificationId: string): Promise<void> {
        return this.notificationsCollection.doc(notificationId).update({ status: 'read' });
    }
}
