import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent {

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) { }

    page: string = '';

    ngOnInit() {
        this.page = this.route.snapshot.paramMap.get('page') || '';
    }
}
