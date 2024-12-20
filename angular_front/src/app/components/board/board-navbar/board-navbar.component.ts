import { Component, Input } from '@angular/core';
import { FirebaseBoardsService } from '../../../services/firebase-boards/firebase-boards.service';
import { Picture, UnsplashService } from '../../../services/unsplash/unsplash.service';
import { FirebaseNotificationsService, Notification } from '../../../services/firebase-notifications/firebase-notifications.service';
import { AuthService } from '../../../services/auth/auth.service';
import { FirebaseWorkspacesService } from '../../../services/firebase-workspaces/firebase-workspaces.service';
import { map, switchMap } from 'rxjs';



@Component({
  selector: 'app-board-navbar',
  templateUrl: './board-navbar.component.html',
  styleUrl: './board-navbar.component.scss'
})
export class BoardNavbarComponent {

    @Input() workspaceId:string | null = null;
    @Input() boardId:string | null = null;

    boardName: string | null = null;
    board: any;

    isStarred: boolean = false;

    emailToAdd: string = "";

    constructor(
        private svBoard: FirebaseBoardsService,
        private svUnsplash: UnsplashService,
        private svNotifications: FirebaseNotificationsService,
        private svAUth: AuthService,
        private svWorkspace: FirebaseWorkspacesService
    ) {}

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
        if (this.workspaceId && this.boardId) {
            this.svBoard.getBoardName(this.workspaceId, this.boardId).subscribe(bName => {
                this.boardName = bName.name;
            })
            this.svBoard.getBoardById(this.workspaceId, this.boardId).pipe(
                switchMap(board => {
                  this.board = board; // Save the board data
                  return this.svAUth.getUserEmail().pipe(
                    map(userEmail => ({ board, userEmail }))
                  );
                })
              ).subscribe(({ board, userEmail }) => {
                if (userEmail) {
                  this.isStarred = board.stars.includes(userEmail);
                } else {
                  this.isStarred = false; // Handle null case if necessary
                }
              });
        }
    }

    changeBackgroundColor(color: string) {
        if (this.workspaceId && this.boardId)
            this.svBoard.addBackgroundToBoard(this.workspaceId, this.boardId, {color: color, picture: null});
    }

    changeBackgroundPicture(picture: string) {
        if (this.workspaceId && this.boardId)
            this.svBoard.addBackgroundToBoard(this.workspaceId, this.boardId, {color: null, picture: picture});
    }

    removeBackground() {
        if (this.workspaceId && this.boardId)
            this.svBoard.addBackgroundToBoard(this.workspaceId, this.boardId, {color: null, picture: null});
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

    openPanelPictureBackground() {
        this.svUnsplash.getRandomPhotos().subscribe(data => {
            this.backgroundPictures = data;
        })
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
                texts: [this.boardName || ""]
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

    async starBoard() {
        this.svAUth.getUserEmail().subscribe((userMail) => {
            if (this.workspaceId && this.boardId && userMail && !this.isStarred)
                this.svBoard.starBoard(this.workspaceId, this.boardId, userMail);
            else if (this.workspaceId && this.boardId && userMail && this.isStarred)
                this.svBoard.unstarBoard(this.workspaceId, this.boardId, userMail);
    });}
}
