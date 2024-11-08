import { FirebaseCardsService } from './../../../services/firebase-cards/firebase-cards.service';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { OpenCardService } from '../../../services/open-card/open-card.service';

@Component({
  selector: 'app-open-card',
  templateUrl: './open-card.component.html',
  styleUrl: './open-card.component.scss'
})
export class OpenCardComponent {

    @ViewChild('cardElement', { static: false }) cardElement!: ElementRef;
    @Input() boardId:string | null = null;
    isOpenCard: boolean = false;

    description: string = "";
    initialDescription: string = "";
    isEditingCardName: boolean = false;
    cardName: string = "";

    constructor (
        public svOpenCard: OpenCardService,
        private svCard: FirebaseCardsService
    ) {}

    closeOpenCard() {
        this.svOpenCard.toggleOpenCard();
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent): void {
        const clickedInside = this.cardElement.nativeElement.contains(event.target);
        if (!clickedInside && this.isOpenCard) {
            this.closeOpenCard();
        }
        this.isOpenCard = !this.isOpenCard;
    }

    ngOnInit() {
        this.cardName = this.svOpenCard._card.name;
        if (this.boardId)
            this.svCard.getDescription(this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id).subscribe((data)=>{
                if (data) {
                    this.initialDescription = data;
                    this.description = data;
                }
            });
    }

    toggleEditCardName() {
        this.isEditingCardName = true;
    }

    saveNameCard() {
        if (this.cardName != this.svOpenCard._card.name && this.cardName != "" && this.boardId) {
            this.svCard.addName(this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, this.cardName);
            this.svOpenCard._card.name = this.cardName;
        }
        this.isEditingCardName = false;
    }

    saveDescription() {
        if (this.boardId) {
            this.svCard.addDescription(this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, this.description);
            this.initialDescription = this.description;
        }
    }

    cancelDescription() {
        this.description = this.initialDescription
    }

    join() {

    }

    members() {

    }

    labels() {

    }

    checklist() {

    }

    dates() {

    }

    attachment() {

    }

    cover() {

    }

    customFields() {

    }

    move() {

    }

    copy() {

    }

    makeTemplate() {

    }

    delete() {
        if (this.boardId) {
            this.svCard.deleteCardFromList(this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id);
            this.closeOpenCard();
        }
    }

    share() {

    }
}
