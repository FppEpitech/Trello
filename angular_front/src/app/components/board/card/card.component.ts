import { Component, Input } from '@angular/core';
import { Card, FirebaseCardsService } from '../../../services/firebase-cards/firebase-cards.service';
import { FirebaseListsService } from '../../../services/firebase-lists/firebase-lists.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { OpenCardService } from '../../../services/open-card/open-card.service';

const newCard: Card = {
    id: '',
    name: '',
    description: '',
    members: [],
    notifications: [],
    labels: [],
    checklists: [],
    date: null,
    attachment: [],
    cover: '',
};

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

    @Input() list:any;
    @Input() boardId:string | null = null;
    @Input() connectedLists: string[] = [];

    constructor(
        private svCards:FirebaseCardsService,
        private svLists:FirebaseListsService,
        private svOpenCard: OpenCardService
    ) { }

    isCreatingCard: boolean = false;
    cardNameToAdd: string = "";
    cards: any[] = [];

    openCreationCardPanel() {
        this.isCreatingCard = !this.isCreatingCard
    }

    closeCreationCardPanel() {
        this.isCreatingCard = !this.isCreatingCard;
        this.cardNameToAdd = "";
    }

    createCard() {
        if (this.cardNameToAdd.trim() && this.boardId) {
            newCard.name = this.cardNameToAdd;
            this.svCards.addCardToList(this.boardId, this.list.id, newCard).then((data)=>{
                this.closeCreationCardPanel();
            })
        }
    }

    deleteList() {
        if (this.boardId)
            this.svLists.deleteList(this.boardId, this.list.id);
    }

    deleteCard(card: any) {
        if (this.boardId)
            this.svCards.deleteCardFromList(this.boardId, this.list.id, card.id)
    }

    ngOnInit() {
        if (this.boardId) {
            this.svCards.getCards(this.boardId, this.list.id).subscribe(
                cards => this.cards = cards,
                error => console.error('Error fetching cards:', error)
            );
        }
    }

    drop(event: CdkDragDrop<Card[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            const movedCard = event.previousContainer.data[event.previousIndex];

            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );

            if (this.boardId) {
                this.svCards.deleteCardFromList(this.boardId, event.previousContainer.id.substring(5), movedCard.id)
                this.svCards.addCardToList(this.boardId, event.container.id.substring(5), movedCard)
            }
        }
    }

    openCardPanel(card: any) {
        this.svOpenCard.toggleOpenCard();
        this.svOpenCard.setCard(card);
        this.svOpenCard.setList(this.list);
    }
}
