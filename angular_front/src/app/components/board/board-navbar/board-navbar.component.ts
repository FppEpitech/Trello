import { Component, Input } from '@angular/core';
import { FirebaseBoardsService } from '../../../services/firebase-boards/firebase-boards.service';
import { Picture, UnsplashService } from '../../../services/unsplash/unsplash.service';



@Component({
  selector: 'app-board-navbar',
  templateUrl: './board-navbar.component.html',
  styleUrl: './board-navbar.component.scss'
})
export class BoardNavbarComponent {

    @Input() workspaceId:string | null = null;
    @Input() boardId:string | null = null;

    constructor(
        private svBoard: FirebaseBoardsService,
        private svUnsplash: UnsplashService
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
}
