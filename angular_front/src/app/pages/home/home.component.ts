import { AuthService } from './../../services/auth/auth.service';
import { Component, Renderer2 } from '@angular/core';
import { FirebaseWorkspacesService } from '../../services/firebase-workspaces/firebase-workspaces.service';
import { Picture, UnsplashService } from '../../services/unsplash/unsplash.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

    constructor(
        private svWorkspaces:FirebaseWorkspacesService,
        private authService:AuthService,
        private svUnsplash: UnsplashService,
        private renderer: Renderer2
    ) {}

    workspaces: any[] = [];
    boards: any[] = [];
    workspaceNameToAdd: string = "";
    workspaceDescriptionToAdd: string = "";
    workspaceColorToAdd: string = "";
    workspacePictureToAdd: string = "";

    backgroundColors: string[] = [
        "#b9f3db", "#f8e5a0", "#fedec9", "#fed5d1", "#ded8fc",
        "#4bce98", "#f5cd47", "#ffa362", "#f77168", "#9f90ef",
        "#1f845a", "#946e00", "#c25200", "#c9362c", "#6e5dc7",
        "#cce1ff", "#c6edfc", "#d3f1a7", "#fdd1ec", "#dcdfe4",
        "#579dff", "#6cc3df", "#94c748", "#e773ba", "#8590a2",
        "#0c65e3", "#227d9a", "#5b7f25", "#ad4788", "#636f87"
    ];
    backgroundPictures: Picture[] = [];

    isCoverPanelOpen: boolean = false;

    refreshWorkspaces() {
        this.authService.authState$.subscribe(user => {
            if (user) {
              this.svWorkspaces.getWorkspaces(user.uid).subscribe((data)=>{
                  this.workspaces = data;
              })
            }
        });
    }

    createWorkspace() {
        if (this.workspaceNameToAdd != "")
            this.authService.authState$.subscribe(user => {
                if (user) {
                    this.svWorkspaces.addWorkspace(
                        this.workspaceNameToAdd,
                        this.workspaceDescriptionToAdd,
                        this.workspaceColorToAdd,
                        this.workspacePictureToAdd,
                        user.uid);
                    this.workspaceNameToAdd = "";
                    this.workspaceDescriptionToAdd
                }
            });

    }

    ngOnInit() {
        this.refreshWorkspaces();
    }

    openPanelPictureBackground() {
        this.svUnsplash.getRandomPhotos().subscribe(data => {
            this.backgroundPictures = data;
        })
    }

    changeBackgroundColor(color: string) {
        this.workspaceColorToAdd = color;
    }

    changeBackgroundPicture(picture: string) {
        this.workspacePictureToAdd = picture;
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
}
