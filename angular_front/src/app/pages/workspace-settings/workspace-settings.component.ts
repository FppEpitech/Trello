import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseWorkspacesService } from '../../services/firebase-workspaces/firebase-workspaces.service';
import { FirebaseBoardsService } from '../../services/firebase-boards/firebase-boards.service';
import { Picture, UnsplashService } from '../../services/unsplash/unsplash.service';
import { AuthService } from '../../services/auth/auth.service';
import { FirebaseNotificationsService, Notification } from '../../services/firebase-notifications/firebase-notifications.service';

@Component({
  selector: 'app-workspace-settings',
  templateUrl: './workspace-settings.component.html',
  styleUrl: './workspace-settings.component.scss'
})
export class WorkspaceSettingsComponent {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private svWorkspaces: FirebaseWorkspacesService,
        private svBoards:FirebaseBoardsService,
        private svUnsplash: UnsplashService,
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

    backgroundColors: string[] = [
        "#b9f3db", "#f8e5a0", "#fedec9", "#fed5d1", "#ded8fc",
        "#4bce98", "#f5cd47", "#ffa362", "#f77168", "#9f90ef",
        "#1f845a", "#946e00", "#c25200", "#c9362c", "#6e5dc7",
        "#cce1ff", "#c6edfc", "#d3f1a7", "#fdd1ec", "#dcdfe4",
        "#579dff", "#6cc3df", "#94c748", "#e773ba", "#8590a2",
        "#0c65e3", "#227d9a", "#5b7f25", "#ad4788", "#636f87"
    ];
    backgroundPictures: Picture[] = [];

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

    saveWorkspace() {
        if (this.workspaceId && this.workspaceName !== "") {
            this.svWorkspaces.updateWorkspaceName(this.workspaceId, this.workspaceName);
            this.svWorkspaces.updateWorkspaceDescription(this.workspaceId, this.workspaceDescription);
            this.svWorkspaces.updateWorkspacePicture(this.workspaceId, this.workspacePicture);
            this.svWorkspaces.updateWorkspaceColor(this.workspaceId, this.workspaceColor);
        }
    }

    cancelWorkspace() {
        this.workspaceName = this.workspace.name;
        this.workspaceDescription = this.workspace.description;
    }

    deleteWorkspace() {
        if (this.workspaceId) {
            this.svWorkspaces.deleteWorkspace(this.workspaceId);
            this.router.navigate(['/home']);
        }
    }

    deleteBoard(boardId: string) {
        if (this.workspaceId && boardId) {
            this.svBoards.setBoardClosed(this.workspaceId, boardId, true);
        }
    }

    // Panel to change logo workspace

    openPanelPictureBackground() {
        this.svUnsplash.getRandomPhotos().subscribe(data => {
            this.backgroundPictures = data;
        })
    }

    changeBackgroundColor(color: string) {
        this.workspaceColor = color;
    }

    changeBackgroundPicture(picture: string) {
        this.workspacePicture = picture;
    }

    onBackgroundSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            if (file.type === 'image/png' || file.type === 'image/jpeg') {
                const reader = new FileReader();
                reader.onload = () => {
                    const pictureSrc = reader.result as string;
                    this.changeBackgroundPicture(pictureSrc);
                };
                reader.readAsDataURL(file);
            } else {
                alert('Only PNG and JPG files are allowed.');
            }
        }
    }

    removeBackground() {
        this.workspaceColor = "";
        this.workspacePicture = "";
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
}
