import { combineLatest, distinctUntilChanged, map, take } from 'rxjs';
import { Timestamp } from 'firebase/firestore';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableRow } from '../../table/table.component';
import { FirebaseWorkspacesService } from '../../../services/firebase-workspaces/firebase-workspaces.service';
import { AuthService } from '../../../services/auth/auth.service';
import { FirebaseBoardsService } from '../../../services/firebase-boards/firebase-boards.service';
import { FirebaseListsService } from '../../../services/firebase-lists/firebase-lists.service';
import { FirebaseCardsService } from '../../../services/firebase-cards/firebase-cards.service';
import { Router } from '@angular/router';
import { OpenCardService } from '../../../services/open-card/open-card.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent {

    constructor(
        private svAuth: AuthService,
        private svWorkspace: FirebaseWorkspacesService,
        private svBoard: FirebaseBoardsService,
        private svList: FirebaseListsService,
        private svCard: FirebaseCardsService,
        private router: Router,
        private svOpenCard: OpenCardService,
    ) { }

    displayedColumns: string[] = ['card', 'list', 'labels', 'dueDate', 'board'];
    dataSource = new MatTableDataSource<TableRow>([]);

    userEmail: string = "";

    ngOnInit() {
        this.svAuth.getUserEmail().subscribe(email => {
            if (email) {
                this.userEmail = email;
                this.svAuth.getUserId().subscribe(userId => {
                    if (userId) {
                        this.svWorkspace.getWorkspaces(userId).subscribe(workspaces => {

                            workspaces.forEach(workspace => {

                                this.svBoard.getBoards(workspace.id).subscribe(boards => {

                                    boards.forEach(board => {

                                        this.svList.getLists(workspace.id, board.id).subscribe(lists => {

                                            lists.forEach(list => {

                                                this.svCard.getCards(workspace.id, board.id, list.id).subscribe(cards => {

                                                    cards.forEach(card => {

                                                        if (card.members.map((member: any) => member.name).includes(this.userEmail)) {

                                                            const newCard: TableRow = {
                                                                card: card,
                                                                list: list.name,
                                                                listId: list.id,
                                                                board: board.name,
                                                                boardId: board.id,
                                                                workspaceId: workspace.id,
                                                                date: card.date ? (card.date instanceof Timestamp ? card.date.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : "") : "",
                                                            };
                                                            const exists = this.dataSource.data.some(existingCard =>
                                                                existingCard.card.id === newCard.card.id &&
                                                                existingCard.listId === newCard.listId &&
                                                                existingCard.boardId === newCard.boardId &&
                                                                existingCard.workspaceId === newCard.workspaceId
                                                            );
                                                            if (!exists) {
                                                                this.dataSource.data = [...this.dataSource.data, newCard];
                                                            }

                                                        }
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }
                });
            }
        });
    }

    openCardPanel(row : any) {

        this.router.navigate([`workspace/${row.workspaceId}/board/${row.boardId}`]);

        if (row.boardId && row.workspaceId) {
            const listObservable = this.svList.getListById(row.workspaceId, row.boardId, row.listId).pipe(distinctUntilChanged());
            const cardObservable = this.svCard.getCardById(row.workspaceId, row.boardId, row.listId, row.card.id).pipe(distinctUntilChanged());

            combineLatest([listObservable, cardObservable])
                .pipe(take(1))
                .subscribe(([list, card]) => {
                    this.svOpenCard.setList(list);
                    this.svOpenCard.setCard(card);
                    if (list && card) {
                        this.svOpenCard.toggleOpenCard();
                    }
                }
            );
        }
    }
}
