import { Component, Input } from '@angular/core';
import { FirebaseCardsService } from '../../../../services/firebase-cards/firebase-cards.service';
import { v4 as uuidv4 } from 'uuid';

declare var bootstrap: any;

@Component({
  selector: 'app-label-creation',
  templateUrl: './label-creation.component.html',
  styleUrl: './label-creation.component.scss'
})
export class LabelCreationComponent {

    @Input() workspaceId:string | null = null;
    @Input() boardId:string | null = null;
    @Input() listId:string | null = null;
    @Input() cardId:string | null = null;


    title: string = "";
    idxColor: number = 0;

    colors: string[] = [
        "#b9f3db", "#f8e5a0", "#fedec9", "#fed5d1", "#ded8fc",
        "#4bce98", "#f5cd47", "#ffa362", "#f77168", "#9f90ef",
        "#1f845a", "#946e00", "#c25200", "#c9362c", "#6e5dc7",
        "#cce1ff", "#c6edfc", "#d3f1a7", "#fdd1ec", "#dcdfe4",
        "#579dff", "#6cc3df", "#94c748", "#e773ba", "#8590a2",
        "#0c65e3", "#227d9a", "#5b7f25", "#ad4788", "#636f87"
    ];
    colorPreview: string = this.colors[0];

    constructor(
        private svCard: FirebaseCardsService,
    ){}

    closeDropdown() {
        const dropdownElement = document.getElementById('createLabelDropdown');
        if (dropdownElement) {
          const dropdown = bootstrap.Dropdown.getInstance(dropdownElement);
          dropdown.hide();
        }
    }

    chooseColor(colorLabel: string) {
        this.colorPreview = colorLabel;
    }

    createLabel() {
        if (this.boardId && this.title !== "" && this.colorPreview !== "" && this.listId && this.cardId && this.workspaceId) {
            const newId = uuidv4();
            this.svCard.addLabelToCard(this.workspaceId, this.boardId, this.listId, this.cardId, {
                id: newId,
                name: this.title,
                color: this.colorPreview,
                isCheck: true
            });
        }
        this.closeDropdown();
    }
}
