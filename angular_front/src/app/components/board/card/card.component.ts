import { Component, Input } from '@angular/core';
import { FirebaseCardsService } from '../../../services/firebase-cards.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

    @Input() list:any;

    constructor(private cardsSv:FirebaseCardsService) { }

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
        if (this.cardNameToAdd.trim()) {
            this.cardsSv.addCardToList(this.list.id, {name:this.cardNameToAdd}).then((data)=>{
                this.closeCreationCardPanel();
            })
        }
    }

    deleteList() {
        this.cardsSv.deleteList(this.list.id);
    }

    deleteCard(card: any) {
        console.log(card)
        this.cardsSv.deleteCardFromList(this.list.id, card.id)
    }

    ngOnInit() {
        this.cards = this.cardsSv.getCards(this.list.id)
    }
}
