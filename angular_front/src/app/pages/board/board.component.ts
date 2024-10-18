import { FirebaseCardsService } from '../../services/firebase-cards/firebase-cards.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

    constructor(private cardsSv:FirebaseCardsService) { }

    lists: any[] = [];
    isCreatingList: boolean = false;
    listNameToAdd: string = ""

    openCreationListPanel() {
        this.isCreatingList = !this.isCreatingList;
    }

    closeCreationListPanel() {
        this.isCreatingList = !this.isCreatingList;
        this.listNameToAdd = "";
    }

    createList() {
        if (this.listNameToAdd.trim()) {
            this.cardsSv.addList(this.listNameToAdd).then((data)=>{
                this.closeCreationListPanel();
                this.refreshLists();
            })
        }
    }

    getCardsFormList(list: any) {
        return this.cardsSv.getCards(list.id);
    }

    refreshLists() {
        this.cardsSv.getLists().subscribe((data)=>{
            this.lists = data;
        })
    }

    ngOnInit() {
        this.refreshLists();
    }
}
