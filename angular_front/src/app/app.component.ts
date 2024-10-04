import { map, Observable, of } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
    title = 'angular_front';
    isLoggedIn$: Observable<boolean> = of(false);

    constructor(public _auth:AuthService){}

    ngOnInit(): void {
        this.isLoggedIn$ = this._auth.isLogged();
    }
}
