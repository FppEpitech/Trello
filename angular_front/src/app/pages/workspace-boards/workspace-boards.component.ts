import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseWorkspacesService } from '../../services/firebase-workspaces/firebase-workspaces.service';
import { FirebaseBoardsService } from '../../services/firebase-boards/firebase-boards.service';
import { Picture, UnsplashService } from '../../services/unsplash/unsplash.service';
import { AuthService } from '../../services/auth/auth.service';
import { FirebaseNotificationsService, Notification } from '../../services/firebase-notifications/firebase-notifications.service';

@Component({
  selector: 'app-workspace-boards',
  templateUrl: './workspace-boards.component.html',
  styleUrl: './workspace-boards.component.scss'
})
export class WorkspaceBoardsComponent {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private svWorkspaces: FirebaseWorkspacesService,
        private svBoards:FirebaseBoardsService,
        private svAuth: AuthService,
        private svNotifications: FirebaseNotificationsService
    ) { }

    workspaceId: string | null = null;
    workspace: any;
    workspaceName: string = '';
    workspaceDescription: string = '';
    workspacePicture: string = '';
    workspaceColor: string = '';
    boards: any[] = [];

    emailToAdd: string = '';

    boardNameToAdd: string = "";

    ngOnInit() {
        this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
        if (this.workspaceId) {
            this.svWorkspaces.getWorkspace(this.workspaceId).subscribe((data) => {
                this.workspace = data;
                this.workspaceName = this.workspace.name;
                this.workspaceDescription = this.workspace.description;
                this.workspacePicture = this.workspace.picture;
                this.workspaceColor = this.workspace.color;
            });
            this.svBoards.getBoards(this.workspaceId).subscribe((data)=>{
                this.boards = data;
            })
        }
    }

    goToBoard(boardId: string) {
        this.router.navigate(['/workspace', this.workspaceId, 'board', boardId]);
    }

    async addNewUser() {
        if (this.emailToAdd == '')
            return;
        this.svAuth.getUserEmail().subscribe(senderEmail => {
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
                texts: [this.workspace?.name || ""]
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

            const userId = await this.svAuth.getUserIdByEmail(emailToAdd);
            const userPicture = await this.svAuth.getUserPictureByEmail(emailToAdd);

            if (userId && userPicture) {
                await this.svWorkspaces.addMemberToWorkspace(this.workspaceId, userId, userPicture, emailToAdd);
            } else {
                console.error('User not found or missing details.');
            }
        } catch (error) {
            console.error('Error adding member:', error);
        }
    }

    createBoard() {
        if (this.workspaceId && this.boardNameToAdd != '') {
            this.svBoards.addBoard(this.workspaceId, this.boardNameToAdd);
            this.boardNameToAdd = '';
        }
    }
}
