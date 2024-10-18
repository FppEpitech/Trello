import { Component, Input } from '@angular/core';
import { FirebaseCardsService } from '../../../services/firebase-cards/firebase-cards.service';
import { FirebaseListsService } from '../../../services/firebase-lists/firebase-lists.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

    @Input() list:any;
    @Input() boardId:string | null = null;

    constructor(
        private svCards:FirebaseCardsService,
        private svLists:FirebaseListsService
    ) { }

    isCreatingCard: boolean = false;
    cardNameToAdd: string = "";
    cards: any;

    openCreationCardPanel() {
        this.isCreatingCard = !this.isCreatingCard
    }

    closeCreationCardPanel() {
        this.isCreatingCard = !this.isCreatingCard;
        this.cardNameToAdd = "";
    }

    createCard() {
        if (this.cardNameToAdd.trim() && this.boardId) {
            this.svCards.addCardToList(this.boardId, this.list.id, this.cardNameToAdd).then((data)=>{
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
        if (this.boardId)
            this.cards = this.svCards.getCards(this.boardId, this.list.id)
    }
}
