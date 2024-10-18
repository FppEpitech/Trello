import { AuthService } from '../../services/auth/auth.service';
// signin.component.ts
import { Component } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.scss",
})
export class LoginComponent {
    constructor(public _auth:AuthService) {}
}
