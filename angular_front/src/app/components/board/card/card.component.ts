import { Component, Input } from '@angular/core';
import { Card, FirebaseCardsService } from '../../../services/firebase-cards/firebase-cards.service';
import { FirebaseListsService } from '../../../services/firebase-lists/firebase-lists.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { OpenCardService } from '../../../services/open-card/open-card.service';
import { FirebaseActivitiesService } from '../../../services/firebase-activities/firebase-activities.service';
import { AuthService } from '../../../services/auth/auth.service';

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
    activities: [],
    cover: null,
};

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

    @Input() list:any;
    @Input() workspaceId:string | null = null;
    @Input() boardId:string | null = null;
    @Input() connectedLists: string[] = [];

    constructor(
        private svCards:FirebaseCardsService,
        private svLists:FirebaseListsService,
        private svOpenCard: OpenCardService,
        private svActivities: FirebaseActivitiesService,
        private svAuth: AuthService,
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
        if (this.cardNameToAdd.trim() && this.boardId && this.workspaceId) {
            newCard.name = this.cardNameToAdd;
            this.svCards.addCardToList(this.workspaceId, this.boardId, this.list.id, newCard).then((data)=>{
                this.closeCreationCardPanel();
            })

            this.svAuth.getUserId().subscribe(userId => {
                if (userId)
                    this.svActivities.setActivity(userId, `created the card \'${this.cardNameToAdd}\' in the list \'${this.list.name}\'`);
            });
        }
    }

    deleteList() {
        if (this.boardId && this.workspaceId) {
            this.svLists.deleteList(this.workspaceId, this.boardId, this.list.id);

            this.svAuth.getUserId().subscribe(userId => {
                if (userId)
                    this.svActivities.setActivity(userId, `Delete the list \'${this.list.name}\'`);
            });
        }
    }

    deleteCard(card: any) {
        if (this.boardId && this.workspaceId)
            this.svCards.deleteCardFromList(this.workspaceId, this.boardId, this.list.id, card.id)
    }

    ngOnInit() {
        if (this.boardId && this.workspaceId) {
            this.svCards.getCards(this.workspaceId, this.boardId, this.list.id).subscribe(
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

            this.svAuth.getUserId().subscribe(userId => {
                if (userId)
                    this.svActivities.setActivity(userId, `Move the card \'${movedCard.name}\'`);
            });

            if (this.boardId && this.workspaceId) {
                this.svCards.deleteCardFromList(this.workspaceId, this.boardId, event.previousContainer.id.substring(5), movedCard.id)
                this.svCards.addCardToList(this.workspaceId, this.boardId, event.container.id.substring(5), movedCard)
            }
        }
    }

    openCardPanel(card: any) {
        this.svOpenCard.toggleOpenCard();
        this.svOpenCard.setCard(card);
        this.svOpenCard.setList(this.list);
    }
}
