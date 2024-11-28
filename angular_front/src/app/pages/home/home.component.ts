import { Component } from '@angular/core';
import { FirebaseWorkspacesService } from '../../services/firebase-workspaces/firebase-workspaces.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

    constructor(
        private svWorkspaces:FirebaseWorkspacesService
    ) {}

    workspaces: any[] = [];
    boards: any[] = [];
    boardNameToAdd: string = "";

    refreshWorkspaces() {
        this.svWorkspaces.getWorkspaces().subscribe((data)=>{
            this.workspaces = data;
        })
    }

    ngOnInit() {
        this.refreshWorkspaces();
    }
}
