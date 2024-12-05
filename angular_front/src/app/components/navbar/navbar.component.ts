import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FirebaseNotificationsService } from '../../services/firebase-notifications/firebase-notifications.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

    constructor(
        public router:Router,
        private svAuth: AuthService,
        private svNotif : FirebaseNotificationsService
    ) {}

    notifications: any[] = [];

    logout() {
        this.svAuth.logout();
    }

    ngOnInit() {
        this.svNotif.getNotifications().subscribe(notifs => {
            this.notifications = notifs;
        });
    }
}
