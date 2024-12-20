import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseWorkspacesService } from '../../../services/firebase-workspaces/firebase-workspaces.service';

@Component({
  selector: 'app-board-sidebar',
  templateUrl: './board-sidebar.component.html',
  styleUrl: './board-sidebar.component.scss'
})
export class BoardSidebarComponent {

    workspaceId: string | null = null;
    boardId: string | null = null;

    workspace: any;

    constructor(
        private router:Router,
        private route: ActivatedRoute,
        private svWorkspace: FirebaseWorkspacesService
    ) {}

    ngOnInit() {
        this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
        this.boardId = this.route.snapshot.paramMap.get('boardId');

        if (this.workspaceId) {
            this.svWorkspace.getWorkspace(this.workspaceId).subscribe((workspace) => {
                this.workspace = workspace;
            });
        }
    }

    goToCalendar() {
        if (this.boardId && this.workspaceId)
            this.router.navigate([`/workspace/${this.workspaceId}/calendar/${this.boardId}`]);
    }

    goToTable() {
        if (this.boardId && this.workspaceId)
            this.router.navigate([`/workspace/${this.workspaceId}/table/${this.boardId}`]);
    }

    goToBoard() {
        if (this.boardId && this.workspaceId)
            this.router.navigate([`/workspace/${this.workspaceId}/board/${this.boardId}`]);
    }

    goToWhiteBoard() {
        if (this.boardId && this.workspaceId)
            this.router.navigate([`/workspace/${this.workspaceId}/whiteboard/${this.boardId}`]);
    }
}
