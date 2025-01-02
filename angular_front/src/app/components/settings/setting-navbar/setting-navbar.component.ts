import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-setting-navbar',
  templateUrl: './setting-navbar.component.html',
  styleUrl: './setting-navbar.component.scss'
})
export class SettingNavbarComponent {

    @Input() page!: string;
    @Output() pageChange = new EventEmitter<string>();

    constructor(
        private svAUth: AuthService,
        private router: Router
    ) { }

    emailPicture: string = "";
    emailName: string = "";

    ngOnInit() {
        this.svAUth.getUserEmail().subscribe((data: any) => {
            this.emailName = data;
            this.svAUth.getUserPictureByEmail(this.emailName).then((picture: any) => {
                this.emailPicture = picture;
            });
        });
    }

    goTo(path : string) {
        this.router.navigate(['/settings/' + path]);
        this.page = path;
        this.pageChange.emit(path);
    }
}
