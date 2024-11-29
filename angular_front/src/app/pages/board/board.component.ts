import { ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { FirebaseListsService } from '../../services/firebase-lists/firebase-lists.service';
import { OpenCardService } from '../../services/open-card/open-card.service';
import { Subscription } from 'rxjs';
import { FirebaseBoardsService } from '../../services/firebase-boards/firebase-boards.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent {

    constructor(
        private svLists:FirebaseListsService,
        private route: ActivatedRoute,
        private svOpenCard: OpenCardService,
        private svBoard: FirebaseBoardsService
    ) { }

    workspaceId: string | null = null;
    boardId: string | null = null;
    lists: any[] = [];
    isCreatingList: boolean = false;
    listNameToAdd: string = ""
    connectedLists: string[] = [];

    subscription: Subscription = new Subscription();
    isOpenCard: boolean = false;

    boardColorBackground: string | null = null;
    boardPictureBackground: string | null = null;

    openCreationListPanel() {
        this.isCreatingList = !this.isCreatingList;
    }

    closeCreationListPanel() {
        this.isCreatingList = !this.isCreatingList;
        this.listNameToAdd = "";
    }

    createList() {
        if (this.listNameToAdd.trim() && this.boardId && this.workspaceId) {
            this.svLists.addList(this.workspaceId, this.boardId, this.listNameToAdd).then((data)=>{
                this.closeCreationListPanel();
                this.refreshLists();
            })
        }
    }

    refreshLists() {
        if (this.boardId && this.workspaceId) {
            this.svLists.getLists(this.workspaceId, this.boardId).subscribe((data)=>{
                this.lists = data;
                this.connectedLists = this.lists.map(list => `list-${list.id}`);
            })
        }
    }

    ngOnInit() {
        this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
        this.boardId = this.route.snapshot.paramMap.get('boardId');
        this.refreshLists();
        this.subscription = this.svOpenCard.isOpenCard$.subscribe(open => {
            this.isOpenCard = open;
        });

        if (this.workspaceId && this.boardId)
            this.svBoard.getBoardBackground(this.workspaceId, this.boardId).subscribe(background => {
                console.log(background)
                this.boardColorBackground = background.color;
                this.boardPictureBackground = background.picture;
            })
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
