import { Component, Input } from '@angular/core';
import { FirebaseBoardsService } from '../../../services/firebase-boards/firebase-boards.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrl: './workspaces.component.scss'
})
export class WorkspacesComponent {

    constructor(
        private svBoards:FirebaseBoardsService,
        private router:Router
    ){}

    @Input() workspace:any;

    boards: any[] = [];
    boardNameToAdd: string = "";

    refreshBoards() {
        this.svBoards.getBoards(this.workspace.id).subscribe((data)=>{
            this.boards = data;
        })
    }

    createBoard() {
        if (this.boardNameToAdd.trim()) {
            this.svBoards.addBoard(this.workspace.id, this.boardNameToAdd);
            this.boardNameToAdd = "";
        }
    }

    deleteBoard() {
        this.svBoards.deleteBoard(this.workspace.id, this.boards[0].id);
    }

    goToBoard(boardId:string) {
        this.router.navigate([`/workspace/${this.workspace.id}/board/${boardId}`]);
    }

    ngOnInit() {
        this.refreshBoards();
    }
}
