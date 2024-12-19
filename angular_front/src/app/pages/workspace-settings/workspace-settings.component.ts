import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseWorkspacesService } from '../../services/firebase-workspaces/firebase-workspaces.service';
import { FirebaseBoardsService } from '../../services/firebase-boards/firebase-boards.service';

@Component({
  selector: 'app-workspace-settings',
  templateUrl: './workspace-settings.component.html',
  styleUrl: './workspace-settings.component.scss'
})
export class WorkspaceSettingsComponent {

    constructor(
        private route: ActivatedRoute,
        private svWorkspaces: FirebaseWorkspacesService,
        private svBoards:FirebaseBoardsService
    ) { }

    workspaceId: string | null = null;
    workspace: any;
    workspaceName: string = '';
    boards: any[] = [];

    ngOnInit() {
        this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
        if (this.workspaceId) {
            this.svWorkspaces.getWorkspace(this.workspaceId).subscribe((data) => {
                this.workspace = data;
                this.workspaceName = this.workspace.name;
            });
            this.svBoards.getBoards(this.workspaceId).subscribe((data)=>{
                this.boards = data;
            })
        }
    }

    saveName() {
        if (this.workspaceId && this.workspaceName !== "")
            this.svWorkspaces.updateWorkspaceName(this.workspaceId, this.workspaceName);
    }

    cancelName() {
        this.workspaceName = this.workspace.name;
    }
}
