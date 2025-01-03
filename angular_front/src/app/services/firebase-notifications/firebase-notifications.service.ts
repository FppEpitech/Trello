import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface Notification {
  id?: string;
  senderEmail: string;
  recipientEmail: string;
  message: string;
  timestamp: Date;
  status: 'unread' | 'read';
  type: string;
  texts: string[];
}

export interface NotificationSettings {
    workspace: boolean;
    card: boolean;
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
                    return this.getNotificationsSettings(user.email).pipe(
                        switchMap(settings => {
                            if (settings.workspace && settings.card) {
                                return this.firestore.collection('notifications', ref =>
                                    ref.where('recipientEmail', '==', user.email)
                                ).valueChanges();
                            }
                            if (settings.workspace && !settings.card) {
                                return this.firestore.collection('notifications', ref =>
                                    ref.where('recipientEmail', '==', user.email).where('type', '==', 'workspace')
                                ).valueChanges();
                            }
                            if (!settings.workspace && settings.card) {
                                return this.firestore.collection('notifications', ref =>
                                    ref.where('recipientEmail', '==', user.email).where('type', '==', 'card')
                                ).valueChanges();
                            }
                            return of([]);
                        })
                    );
                } else {
                    return of([]);
                }
            })
        );
    }


    // Mark a notification as read
    markAsRead(notificationId: string): Promise<void> {
        return this.notificationsCollection.doc(notificationId).update({ status: 'read' });
    }

    // Change the notification settings of the actual user
    setNotificationsSettings(email: string, settings: NotificationSettings): Promise<void> {
        return this.firestore.collection('users').doc(email).update({ notificationSettings: settings });
    }

    // Get the notification settings of the actual user
    getNotificationsSettings(email: string): Observable<NotificationSettings> {
        return this.firestore.collection('users').doc(email).valueChanges().pipe(
            map((user: any) => {
                if (user && user.notificationSettings) {
                    return {
                        workspace: user.notificationSettings.workspace ?? true,
                        card: user.notificationSettings.card ?? true,
                    };
                } else {
                    return { workspace: true, card: true };
                }
            })
        );
    }
}
