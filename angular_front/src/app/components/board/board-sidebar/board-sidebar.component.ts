import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseWorkspacesService } from '../../../services/firebase-workspaces/firebase-workspaces.service';
import { AuthService } from '../../../services/auth/auth.service';
import { FirebaseNotificationsService, Notification } from '../../../services/firebase-notifications/firebase-notifications.service';
import { FirebaseBoardsService } from '../../../services/firebase-boards/firebase-boards.service';

@Component({
  selector: 'app-board-sidebar',
  templateUrl: './board-sidebar.component.html',
  styleUrl: './board-sidebar.component.scss'
})
export class BoardSidebarComponent {

    workspaceId: string | null = null;
    boardId: string | null = null;

    workspace: any;
    board: any;

    emailToAdd: string = '';

    constructor(
        private router:Router,
        private route: ActivatedRoute,
        private svWorkspace: FirebaseWorkspacesService,
        private svAUth: AuthService,
        private svNotifications: FirebaseNotificationsService,
        private svBoard: FirebaseBoardsService,
    ) {}

    ngOnInit() {
        this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
        this.boardId = this.route.snapshot.paramMap.get('boardId');

        if (this.workspaceId) {
            this.svWorkspace.getWorkspace(this.workspaceId).subscribe((workspace) => {
                this.workspace = workspace;
            });
        }
        if (this.boardId && this.workspaceId) {
            this.svBoard.getBoardById(this.workspaceId, this.boardId).subscribe((board) => {
                this.board = board;
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

    async addNewUser() {
        if (this.emailToAdd == '')
            return;
        this.svAUth.getUserEmail().subscribe(senderEmail => {
            if (!senderEmail) {
                return;
            }
            const notification: Omit<Notification, 'id'> = {
                senderEmail: senderEmail,
                recipientEmail: this.emailToAdd,
                message: "add you to a board/workspace",
                timestamp: new Date(),
                status: 'unread',
                type: 'workspace',
                texts: [this.board.name || ""]
            };
            this.svNotifications.sendNotification(notification);
            this.addMember(this.emailToAdd);
            this.emailToAdd = '';
        });
    }

    async addMember(emailToAdd: string) {
        try {
            if (!emailToAdd || !this.workspaceId) {
                console.error('Email or workspace ID is missing.');
                return;
            }

            const userId = await this.svAUth.getUserIdByEmail(emailToAdd);
            const userPicture = await this.svAUth.getUserPictureByEmail(emailToAdd);

            if (userId && userPicture) {
                await this.svWorkspace.addMemberToWorkspace(this.workspaceId, userId, userPicture, emailToAdd);
            } else {
                console.error('User not found or missing details.');
            }
        } catch (error) {
            console.error('Error adding member:', error);
        }
    }
}
