import { FirebaseCardsService, Label, Member, Checklists, Check, Cover, Attachment, Card } from './../../../services/firebase-cards/firebase-cards.service';
import { Component, ElementRef, HostListener, Input, model, ViewChild } from '@angular/core';
import { OpenCardService } from '../../../services/open-card/open-card.service';
import { AuthService } from '../../../services/auth/auth.service';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseWorkspacesService } from '../../../services/firebase-workspaces/firebase-workspaces.service';

declare var bootstrap: any;

@Component({
  selector: 'app-open-card',
  templateUrl: './open-card.component.html',
  styleUrl: './open-card.component.scss'
})
export class OpenCardComponent {

    @ViewChild('cardElement', { static: false }) cardElement!: ElementRef;
    @Input() workspaceId:string | null = null;
    @Input() boardId:string | null = null;
    @Input() lists: any[] = [];

    description: string = "";
    initialDescription: string = "";
    isEditingCardName: boolean = false;
    cardName: string = "";

    userEmail: string | null = null;
    userProfile: string | null = null;

    memberslist: Member[] | null = null;
    isMember: boolean = false;

    labelsList: Label[] | null = null;
    labelsListChecked: Label[] | null = null;

    checklistName: string = "";
    checklistItemName: string = "";
    checkLists: Checklists[] | null = null;

    selected = model<Date | null>(null);
    date: Date | null = null;
    stringDate: string = "";

    selectedCover: File | null = null;
    imageCoverSrc: string | null = null;
    colorsCover: string[] = [
        "#4bce98", "#f5cd47", "#ffa362", "#f77168", "#9f90ef",
        "#579dff", "#6cc3df", "#94c748", "#e773ba", "#8590a2"
    ];
    colorCoverPreview: string | null = null;
    cover: Cover | null = null;

    attachments: Attachment[] | null = null;

    listToMoveTo: any | null = null;

    listToCopyTo: any | null = null;
    copyName: string = "";

    workspaceMembers: any[] = [];

    constructor (
        public svOpenCard: OpenCardService,
        private svCard: FirebaseCardsService,
        private svAuth: AuthService,
        private svWorkspace: FirebaseWorkspacesService
    ) {}

    closeOpenCard() {
        this.svOpenCard.toggleOpenCard();
    }

    ngOnInit() {
        this.cardName = this.svOpenCard._card?.name;
        this.copyName = this.cardName;

        this.svAuth.getUserEmail().subscribe(email => {
            this.userEmail = email;
        });

        this.svAuth.getUserProfileImage().subscribe(profile => {
            this.userProfile = profile;
        });

        if (this.boardId && this.workspaceId) {
            this.svCard.getDescription(this.workspaceId, this.boardId, this.svOpenCard._list?.id, this.svOpenCard._card?.id).subscribe((data)=>{
                if (data) {
                    this.initialDescription = data;
                    this.description = data;
                }
            });
            this.svCard.getCardMembers(this.workspaceId, this.boardId, this.svOpenCard._list?.id, this.svOpenCard._card?.id).subscribe(members => {
                this.memberslist = members;
                this.isMember = this.memberslist.some(member => member.name === this.userEmail);
            });
            this.svCard.getCardLabels(this.workspaceId, this.boardId, this.svOpenCard._list?.id, this.svOpenCard._card?.id).subscribe(labels => {
                this.labelsList = labels;
                this.labelsListChecked = this.labelsList.filter(label => label.isCheck);
            });
            this.svCard.getCardCheckLists(this.workspaceId, this.boardId, this.svOpenCard._list?.id, this.svOpenCard._card?.id).subscribe(checkLists => {
                this.checkLists = checkLists;
            });
            this.svCard.getDateOfCard(this.workspaceId, this.boardId, this.svOpenCard._list?.id, this.svOpenCard._card?.id).subscribe(date => {
                this.date = date;
                if (this.date)
                    this.stringDate = this.date.toLocaleDateString();
            });
            this.svCard.getCardCover(this.workspaceId, this.boardId, this.svOpenCard._list?.id, this.svOpenCard._card?.id).subscribe(cover => {
                this.cover = cover;
            });
            this.svCard.getCardAttachments(this.workspaceId, this.boardId, this.svOpenCard._list?.id, this.svOpenCard._card?.id).subscribe(attachment => {
                this.attachments = attachment;
            });
            this.svWorkspace.getMemberOfWorkspace(this.workspaceId).subscribe(members => {
                this.workspaceMembers = members;
            })
        }
    }

    toggleEditCardName() {
        this.isEditingCardName = true;
    }

    saveNameCard() {
        if (this.cardName != this.svOpenCard._card.name && this.cardName != "" && this.boardId && this.workspaceId) {
            this.svCard.addName(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, this.cardName);
            this.svOpenCard._card.name = this.cardName;
        }
        this.isEditingCardName = false;
    }

    saveDescription() {
        if (this.boardId && this.workspaceId) {
            this.svCard.addDescription(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, this.description);
            this.initialDescription = this.description;
        }
    }

    cancelDescription() {
        this.description = this.initialDescription
    }

    join() {
        if (this.boardId && this.userEmail && this.userProfile && this.workspaceId) {
            this.svCard.addMemberToCard(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, {name: this.userEmail, profile: this.userProfile})
        }
    }

    leave() {
        if (this.boardId && this.userEmail && this.userProfile && this.workspaceId) {
            this.svCard.deleteMemberFromCard(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, {name: this.userEmail, profile: this.userProfile})
        }
    }

    removeMember(member : Member) {
        if (this.boardId && this.userEmail && member && this.workspaceId) {
            this.svCard.deleteMemberFromCard(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, {name: member.name, profile: member.profile})
        }
    }

    closeDropdown() {
        const dropdownElement = document.getElementById('labelsDropdown');
        if (dropdownElement) {
          const dropdown = bootstrap.Dropdown.getInstance(dropdownElement);
          dropdown.hide();
        }
    }

    updateLabel(labelItem: Label) {
        if (this.boardId && labelItem && this.workspaceId) {
            this.svCard.updateLabelIsCheck(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, labelItem.id, !labelItem.isCheck);
        }
    }

    deleteLabel(labelItem: Label) {
        if (this.boardId && labelItem && this.workspaceId) {
            this.svCard.deleteLabelFromCard(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, labelItem.id);
        }
    }

    createCheckList() {
        if (this.boardId && this.checklistName != "" && this.workspaceId) {
            const newId = uuidv4();
            this.svCard.addCheckListToCard(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, {
                id: newId,
                name: this.checklistName,
                checks: []
            })
        }
    }

    deleteCheckList(checklist: Checklists) {
        if (this.boardId && checklist && this.workspaceId) {
            this.svCard.deleteCheckListFromCard(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, checklist.id);
        }
    }

    addItemToCheckList(checklist: Checklists) {
        if (this.boardId && this.checklistItemName != "" && this.workspaceId) {
            const newId = uuidv4();
            const check: Check = {id: newId, name: this.checklistItemName, state: false};
            this.svCard.addCheckToCheckList(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, checklist.id, check);
            this.checklistItemName = "";
        }
    }

    deleteItemChecklist(checkList: Checklists, item: Check) {
        if (this.boardId && checkList && item && this.workspaceId) {
            this.svCard.deleteCheckFromCheckList(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, checkList.id, item.id);
        }
    }

    updateItemCheckList(checkList: Checklists, item: Check) {
        if (this.boardId && checkList && item && this.workspaceId) {
            item.state = !item.state;
            this.svCard.updateCheckInCheckList(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, checkList.id, item);
        }
    }

    saveDate() {
        if (this.boardId && this.workspaceId) {
            this.svCard.addDateToCard(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, this.selected());
        }
    }

    removeDate() {
        if (this.boardId && this.workspaceId) {
            this.svCard.deleteDateFromCard(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id);
        }
    }

    onAttachmentSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            for (let i = 0; i < input.files.length; i++) {
                const file = input.files[i];

                const reader = new FileReader();
                reader.onload = () => {
                    const fileContent = reader.result as string;
                    const newId = uuidv4();

                    const attachment: Attachment = {
                        id: newId,
                        name: file.name,
                        content: fileContent
                    }

                    if (this.boardId && this.workspaceId)
                        this.svCard.addAttachmentToCard(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, attachment);
                };
                reader.readAsDataURL(file);
            }
        }
    }

    deleteAttachment(attachment: Attachment) {
        if (this.boardId && this.workspaceId)
            this.svCard.deleteAttachmentFromCard(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, attachment.id);
    }

    downloadAttachment(attachment: Attachment) {
        if (this.boardId && this.workspaceId)
            this.svCard.downloadAttachment(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, attachment.id);
    }

    onCoverSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];

            if (file.type === 'image/png' || file.type === 'image/jpeg') {
                this.selectedCover = file;

                const reader = new FileReader();
                reader.onload = () => {
                    this.imageCoverSrc = reader.result as string;
                    const cover: Cover = {
                        image: this.imageCoverSrc,
                        color: this.colorCoverPreview
                    };

                    if (this.boardId && this.workspaceId)
                        this.svCard.addOrUpdateCover(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, cover)
                };

                reader.readAsDataURL(file);
            } else {
                alert('Only PNG and JPG files are allowed.');
                this.selectedCover = null;
                this.imageCoverSrc = null;
            }
        }
    }

    chooseCoverColor(colorLabel: string) {
        this.colorCoverPreview = colorLabel;
        const cover: Cover = {
            image: this.imageCoverSrc,
            color: this.colorCoverPreview
        };
        if (this.boardId && this.workspaceId)
            this.svCard.addOrUpdateCover(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id, cover)
    }

    removeCover() {
        if (this.boardId && this.workspaceId)
            this.svCard.deleteCoverFromCard(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id);
        this.imageCoverSrc = null;
        this.colorCoverPreview = null;
    }

    customFields() {

    }

    moveCard() {
        if (this.boardId && this.listToMoveTo && this.workspaceId) {
            this.svCard.addCardToList(this.workspaceId, this.boardId, this.listToMoveTo.id, this.svOpenCard._card);
            this.delete();
        }
    }

    onRadioChangeMove(list: any) {
        this.listToMoveTo = list;
    }

    copyCard() {
        if (this.boardId && this.listToCopyTo && this.copyName !== "" && this.workspaceId) {
            const copyCard: Card = { ...this.svOpenCard._card };
            copyCard.name = this.copyName;
            this.svCard.addCardToList(this.workspaceId, this.boardId, this.listToCopyTo.id, copyCard);
        }
    }

    onRadioChangeCopy(list: any) {
        this.listToCopyTo = list;
    }

    makeTemplate() {

    }

    delete() {
        if (this.boardId && this.workspaceId) {
            this.svCard.deleteCardFromList(this.workspaceId, this.boardId, this.svOpenCard._list.id, this.svOpenCard._card.id);
            this.closeOpenCard();
        }
    }

    share() {

    }
}
