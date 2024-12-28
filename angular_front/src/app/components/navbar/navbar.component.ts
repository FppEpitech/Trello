import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FirebaseNotificationsService } from '../../services/firebase-notifications/firebase-notifications.service';
import { FirebaseWorkspacesService } from '../../services/firebase-workspaces/firebase-workspaces.service';
import { FirebaseBoardsService } from '../../services/firebase-boards/firebase-boards.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

    constructor(
        public router:Router,
        private svAuth: AuthService,
        private svNotif : FirebaseNotificationsService,
        private authService : AuthService,
        private svWorkspaces: FirebaseWorkspacesService,
        private svBoards: FirebaseBoardsService,
    ) {}

    workspaces: any[] = [];
    starredBoards: any[] = [];

    notifications: any[] = [];

    logout() {
        this.svAuth.logout();
    }

    ngOnInit() {
        this.svNotif.getNotifications().subscribe(notifs => {
            this.notifications = notifs;
        });

        this.authService.authState$.subscribe(user => {
            if (user) {
                this.svWorkspaces.getWorkspaces(user.uid).subscribe((workspaces) => {
                    this.workspaces = workspaces;
                    this.starredBoards = [];

                    workspaces.forEach(workspace => {
                        this.svBoards.getBoards(workspace.id).subscribe((boards) => {
                            workspace.boards = boards;

                            boards.forEach(board => {
                                if (board.stars && board.stars.includes(user.email)) {
                                    if (!this.starredBoards.some(starredBoard =>
                                        starredBoard.id === board.id && starredBoard.workspaceId === workspace.id
                                    )) {
                                        this.starredBoards.push({
                                            ...board,
                                            workspaceId: workspace.id
                                        });
                                    }
                                }
                            });
                        });
                    });
                });
            }
        });
    }

    goToBoard(workspaceId: string, boardId:string) {
        this.router.navigate([`/workspace/${workspaceId}/board/${boardId}`]);
    }

    goToWorkspaceSettings(workspaceId: string) {
        this.router.navigate([`/workspace/${workspaceId}/settings`]);
    }
}
