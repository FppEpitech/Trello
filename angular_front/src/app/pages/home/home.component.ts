import { Router } from '@angular/router';
import { FirebaseBoardsService } from './../../services/firebase-boards/firebase-boards.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

    constructor(private svBoards:FirebaseBoardsService, private router:Router) {}

    boards: any[] = [];
    boardNameToAdd: string = "";

    refreshBoards() {
        this.svBoards.getBoards().subscribe((data)=>{
            this.boards = data;
        })
    }

    createBoard() {
        if (this.boardNameToAdd.trim()) {
            this.svBoards.addBoard(this.boardNameToAdd);
            this.boardNameToAdd = "";
        }
    }

    deleteBoard() {
        this.svBoards.deleteBoard(this.boards[0].id);
    }

    goToBoard(boardId:string) {
        this.router.navigateByUrl(`/board/${boardId}`)
    }

    ngOnInit() {
        this.refreshBoards()
    }
}
