import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { FirebaseNotificationsService } from '../../../services/firebase-notifications/firebase-notifications.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

    constructor(
        private svAuth: AuthService,
        private svNotif: FirebaseNotificationsService,
    ) { }

    notificationCard: boolean = true;
    notificationWorkspace: boolean = true;

    userEmail: string = '';

    ngOnInit() {
        this.svAuth.getUserEmail().subscribe((email) => {
            if (email) {
                this.svNotif.getNotificationsSettings(email).subscribe((settings) => {
                    this.notificationCard = settings.card;
                    this.notificationWorkspace = settings.workspace;
                });
                this.userEmail = email;
            }
        });
    }

    logout() {
        this.svAuth.logout();
    }

    deleteAccount() {
        this.svAuth.deleteAccount();
    }

    changeWorkspaceNotif() {
        this.svNotif.setNotificationsSettings(this.userEmail, {card: this.notificationCard, workspace: !this.notificationWorkspace});
    }

    changeCardNotif() {
        this.svNotif.setNotificationsSettings(this.userEmail, {card: !this.notificationCard, workspace: this.notificationWorkspace});
    }
}
