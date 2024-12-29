import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FirebaseNotificationsService } from '../../services/firebase-notifications/firebase-notifications.service';
import { FirebaseWorkspacesService } from '../../services/firebase-workspaces/firebase-workspaces.service';
import { FirebaseBoardsService } from '../../services/firebase-boards/firebase-boards.service';
import { Picture, UnsplashService } from '../../services/unsplash/unsplash.service';

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
        private svUnsplash: UnsplashService,
    ) {}

    workspaces: any[] = [];
    starredBoards: any[] = [];
    boards: any[] = [];

    notifications: any[] = [];

    boardNameToAdd: string = '';
    WorkspaceToAddBoard: any = null;

    searchValue: string = '';
    boardSearchResults: any[] = [];

    userEmail = "";

    workspacePictureToAdd: string = "";
    workspaceColorToAdd: string = "";
    workspaceNameToAdd: string = "";
    workspaceDescriptionToAdd: string = "";
    backgroundColors: string[] = [
        "#b9f3db", "#f8e5a0", "#fedec9", "#fed5d1", "#ded8fc",
        "#4bce98", "#f5cd47", "#ffa362", "#f77168", "#9f90ef",
        "#1f845a", "#946e00", "#c25200", "#c9362c", "#6e5dc7",
        "#cce1ff", "#c6edfc", "#d3f1a7", "#fdd1ec", "#dcdfe4",
        "#579dff", "#6cc3df", "#94c748", "#e773ba", "#8590a2",
        "#0c65e3", "#227d9a", "#5b7f25", "#ad4788", "#636f87"
    ];
    backgroundPictures: Picture[] = [];

    logout() {
        this.svAuth.logout();
    }

    ngOnInit() {
        this.svNotif.getNotifications().subscribe(notifs => {
            this.notifications = notifs;
        });

        this.authService.getUserEmail().subscribe(email => {
            if (email)
                this.userEmail = email;
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
                                if (!this.boards.some(b => b.id === board.id && b.workspaceId === workspace.id)) {
                                    this.boards.push({...board, workspaceId: workspace.id});
                                    this.boardSearchResults.push({...board, workspaceId: workspace.id});
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

    createBoard() {
        if (this.WorkspaceToAddBoard && this.boardNameToAdd.trim()) {
            this.svBoards.addBoard(this.WorkspaceToAddBoard.id, this.boardNameToAdd);
            this.boardNameToAdd = '';
            this.WorkspaceToAddBoard = null;
        }
    }

    onRadioChangeCopy(workpsace: any) {
        this.WorkspaceToAddBoard = workpsace;
    }

    search() {
        if (this.searchValue == '')
            this.boardSearchResults = this.boards;

        if (this.searchValue.trim()) {
            this.boardSearchResults = this.boards.filter(board =>
                board.name.toLowerCase().includes(this.searchValue.toLowerCase())
            );
        }
    }

    createWorkspace() {

        this.svAuth.getUserIdByEmail(this.userEmail).then(userId => {
            if (this.workspaceNameToAdd.trim() && userId) {
                this.svWorkspaces.addWorkspace(this.workspaceNameToAdd, this.workspaceDescriptionToAdd, this.workspaceColorToAdd, this.workspacePictureToAdd, userId);
                this.workspaceNameToAdd = "";
                this.workspaceDescriptionToAdd = "";
                this.workspaceColorToAdd = "";
                this.workspacePictureToAdd = "";
            }
        });


    }

    openPanelPictureBackground() {
        this.svUnsplash.getRandomPhotos().subscribe(data => {
            this.backgroundPictures = data;
        })
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
        this.workspaceColorToAdd = "";
        this.workspacePictureToAdd = "";
    }

    changeBackgroundColor(color: string) {
        this.workspaceColorToAdd = color;
    }

    changeBackgroundPicture(picture: string) {
        this.workspacePictureToAdd = picture;
    }
}
