import { AuthService } from './../../services/auth/auth.service';
import { Component } from '@angular/core';
import { FirebaseWorkspacesService } from '../../services/firebase-workspaces/firebase-workspaces.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

    constructor(
        private svWorkspaces:FirebaseWorkspacesService,
        private authService:AuthService
    ) {}

    workspaces: any[] = [];
    boards: any[] = [];
    workspaceNameToAdd: string = "";
    workspaceDescriptionToAdd: string = "";

    refreshWorkspaces() {
        this.authService.authState$.subscribe(user => {
            if (user) {
              this.svWorkspaces.getWorkspaces(user.uid).subscribe((data)=>{
                  this.workspaces = data;
              })
            }
        });
    }

    createWorkspace() {
        if (this.workspaceNameToAdd != "")
            this.authService.authState$.subscribe(user => {
                if (user) {
                  this.svWorkspaces.addWorkspace(this.workspaceNameToAdd, this.workspaceDescriptionToAdd, user.uid);
                  this.workspaceNameToAdd = "";
                  this.workspaceDescriptionToAdd
                }
              });
    }

    ngOnInit() {
        this.refreshWorkspaces();
    }
}
