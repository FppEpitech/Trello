import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

    constructor(
        private svAuth: AuthService
    ) { }

    userName: string | null = null;
    userBio: string | null = null;

    ngOnInit() {
        this.svAuth.getUserName().subscribe((name) => {
            this.userName = name;
        });
        this.svAuth.getUserBio().subscribe((bio) => {
            this.userBio = bio;
        });
    }

    saveProfile() {
        if (this.userName != null) {
            this.svAuth.setUserName(this.userName);
        }
        if (this.userBio != null) {
            this.svAuth.setUserBio(this.userBio);
        }
    }
}
