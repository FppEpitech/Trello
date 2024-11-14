import { FirebaseCardsService, Member } from './../../../services/firebase-cards/firebase-cards.service';
import { Component, ElementRef, HostListener, Input, model, ViewChild } from '@angular/core';
import { OpenCardService } from '../../../services/open-card/open-card.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-open-card',
  templateUrl: './open-card.component.html',
  styleUrl: './open-card.component.scss'
})
export class OpenCardComponent {

    @ViewChild('cardElement', { static: false }) cardElement!: ElementRef;
    @Input() boardId:string | null = null;

    description: string = "";
    initialDescription: string = "";
    isEditingCardName: boolean = false;
    cardName: string = "";

    userEmail: string | null = null;
    userProfile: string | null = null;

    memberslist: Member[] | null = null;
    isMember: boolean = false;

    selected = model<Date | null>(null);

    constructor (
        public svOpenCard: OpenCardService,
        private svCard: FirebaseCardsService,
        private svAuth: AuthService,
    ) {}

    closeOpenCard() {
        this.svOpenCard.toggleOpenCard();
    }

    ngOnInit() {
        this.cardName = this.svOpenCard._card.name;

        this.svAuth.getUserEmail().subscribe(email => {
            this.userEmail = email;
        });

        this.svAuth.getUserProfileImage().subscribe(profile => {
            this.userProfile = profile;
        });

        if (this.boardId) {
            this.svCard.getDescription(this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id).subscribe((data)=>{
                if (data) {
                    this.initialDescription = data;
                    this.description = data;
                }
            });
            this.svCard.getCardMembers(this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id).subscribe(members => {
                this.memberslist = members;
                this.isMember = this.memberslist.some(member => member.name === this.userEmail);
            });
        }
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
        if (this.boardId && this.userEmail && this.userProfile) {
            this.svCard.addMemberToCard(this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, {name: this.userEmail, profile: this.userProfile})
        }
    }

    leave() {
        if (this.boardId && this.userEmail && this.userProfile) {
            this.svCard.deleteMemberFromCard(this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, {name: this.userEmail, profile: this.userProfile})
        }
    }

    removeMember(member : Member) {
        if (this.boardId && this.userEmail && member) {
            this.svCard.deleteMemberFromCard(this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, {name: member.name, profile: member.profile})
        }
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
