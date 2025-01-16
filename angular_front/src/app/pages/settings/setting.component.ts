import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent {

    constructor(
        private route: ActivatedRoute,
        private svAuth: AuthService
    ) { }

    page: string = '';

    userName: string | null = null;

    ngOnInit() {
        this.page = this.route.snapshot.paramMap.get('page') || '';
    }
}
