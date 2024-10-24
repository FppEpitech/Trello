import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { FirebaseListsService } from '../../services/firebase-lists/firebase-lists.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

    constructor(
        private svLists:FirebaseListsService,
        private route: ActivatedRoute
    ) { }

    boardId: string | null = null;
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
        if (this.listNameToAdd.trim() && this.boardId) {
            this.svLists.addList(this.boardId, this.listNameToAdd).then((data)=>{
                this.closeCreationListPanel();
                this.refreshLists();
            })
        }
    }

    refreshLists() {
        if (this.boardId) {
            this.svLists.getLists(this.boardId).subscribe((data)=>{
                this.lists = data;
            })
        }
    }

    ngOnInit() {
        this.boardId = this.route.snapshot.paramMap.get('id')
        this.refreshLists();
    }
}
