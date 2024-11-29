import { Component } from '@angular/core';

@Component({
  selector: 'app-board-navbar',
  templateUrl: './board-navbar.component.html',
  styleUrl: './board-navbar.component.scss'
})
export class BoardNavbarComponent {

    constructor() {}

    backgroundColors: string[] = [
        "#b9f3db", "#f8e5a0", "#fedec9", "#fed5d1", "#ded8fc",
        "#4bce98", "#f5cd47", "#ffa362", "#f77168", "#9f90ef",
        "#1f845a", "#946e00", "#c25200", "#c9362c", "#6e5dc7",
        "#cce1ff", "#c6edfc", "#d3f1a7", "#fdd1ec", "#dcdfe4",
        "#579dff", "#6cc3df", "#94c748", "#e773ba", "#8590a2",
        "#0c65e3", "#227d9a", "#5b7f25", "#ad4788", "#636f87"
    ];

    onAttachmentSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            for (let i = 0; i < input.files.length; i++) {
                const file = input.files[i];

                // const reader = new FileReader();
                // reader.onload = () => {
                //     const fileContent = reader.result as string;
                //     const newId = uuidv4();

                //     const attachment: Attachment = {
                //         id: newId,
                //         name: file.name,
                //         content: fileContent
                //     }

                //     if (this.boardId && this.workspaceId)
                //         this.svCard.addAttachmentToCard(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, attachment);
                // };
                // reader.readAsDataURL(file);
            }
        }
    }

}
