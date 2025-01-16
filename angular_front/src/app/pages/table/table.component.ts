import { Timestamp } from 'firebase/firestore';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseBoardsService } from '../../services/firebase-boards/firebase-boards.service';
import { Card, FirebaseCardsService } from '../../services/firebase-cards/firebase-cards.service';
import { FirebaseListsService } from '../../services/firebase-lists/firebase-lists.service';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, distinctUntilChanged, Subscription, take } from 'rxjs';
import { OpenCardService } from '../../services/open-card/open-card.service';

export interface TableRow {
    card: Card;
    list: string;
    listId: string;
    date: string;
    board: string;
    boardId: string;
    workspaceId: string;
  }

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

    workspaceId: string | null = null;
    boardId: string | null = null;
    lists: any[] = [];
    list: any | null = null;
    card: any | null = null;

    boardColorBackground: string | null = null;
    boardPictureBackground: string | null = null;

    displayedColumns: string[] = ['card', 'list', 'labels', 'members', 'dueDate'];
    dataSource = new MatTableDataSource<TableRow>([]);

    isOpenCard: boolean = false;
    subscription: Subscription = new Subscription();

    constructor(
        private route: ActivatedRoute,
        private svBoard: FirebaseBoardsService,
        private svCard: FirebaseCardsService,
        private svList: FirebaseListsService,
        private svOpenCard: OpenCardService
    ) { }

    ngOnInit() {
        this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
        this.boardId = this.route.snapshot.paramMap.get('boardId');

        if (this.workspaceId && this.boardId) {
            this.dataSource.data = [];

            this.svBoard.getBoardBackground(this.workspaceId, this.boardId).subscribe(background => {
                this.boardColorBackground = background.color;
                this.boardPictureBackground = background.picture;
            });

            this.svList.getLists(this.workspaceId, this.boardId).subscribe(lists => {
                lists.forEach(list => {
                    if (this.workspaceId && this.boardId) {
                        this.svCard.getCards(this.workspaceId, this.boardId, list.id).subscribe(cards => {
                            cards.forEach(card => {
                                const myCard : Card = card;
                                const cardExists = this.dataSource.data.some(existingCard => existingCard.card.id === card.id);

                                if (!cardExists) {
                                    const newCard: TableRow = {
                                        card: card,
                                        list: list.name,
                                        listId: list.id,
                                        board: '',
                                        boardId: '',
                                        workspaceId: '',
                                        date: myCard.date ? (myCard.date instanceof Timestamp ? myCard.date.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : "") : "",
                                    };
                                    this.dataSource.data = [...this.dataSource.data, newCard];
                                }
                            });
                        });
                    }
                });
            });
            this.svList.getLists(this.workspaceId, this.boardId).subscribe(lists => {
                this.lists = lists;
            });
        }
        this.subscription = this.svOpenCard.isOpenCard$.subscribe(open => {
            this.isOpenCard = open;
        });
    }

    openCardPanel(row : any) {
        this.list = null;
        this.card = null;

        if (this.boardId && this.workspaceId) {
            const listObservable = this.svList.getListById(this.workspaceId, this.boardId, row.listId).pipe(distinctUntilChanged());
            const cardObservable = this.svCard.getCardById(this.workspaceId, this.boardId, row.listId, row.card.id).pipe(distinctUntilChanged());

            combineLatest([listObservable, cardObservable])
                .pipe(take(1))
                .subscribe(([list, card]) => {
                    this.list = list;
                    this.card = card;
                    this.svOpenCard.setList(list);
                    this.svOpenCard.setCard(card);
                    if (this.list && this.card) {
                        this.svOpenCard.toggleOpenCard();
                    }
                }
            );
        }
    }
}
