import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { OpenCardService } from '../../services/open-card/open-card.service';
import { ActivatedRoute } from '@angular/router';
import { FirebaseListsService } from '../../services/firebase-lists/firebase-lists.service';
import { FirebaseCardsService } from '../../services/firebase-cards/firebase-cards.service';
import { combineLatest, distinctUntilChanged, forkJoin, Subscription, take } from 'rxjs';
import { FirebaseBoardsService } from '../../services/firebase-boards/firebase-boards.service';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
  })
  export class CalendarComponent {

    workspaceId: string | null = null;
    boardId: string | null = null;
    list: any | null = null;
    card: any | null = null;
    lists: any[] = [];

    isOpenCard: boolean = false;
    subscription: Subscription = new Subscription();

    boardColorBackground: string | null = null;
    boardPictureBackground: string | null = null;

    calendarOptions: CalendarOptions = {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
        },
        height: 800,
        weekends: true,
        editable: true,
        selectable: true,
        eventColor: '#0d6efd',
        eventClick: (info) => {
            const idCard = info.event.extendedProps['idCard'];
            const idList = info.event.extendedProps['idList'];
            this.openCardPanel(idCard, idList);
        },
        eventDrop: (info) => {
            const movedEvent = info.event;
            const newStart = movedEvent.start;
            const idCard = info.event.extendedProps['idCard'];
            const idList = info.event.extendedProps['idList'];
            this.updateCardDate(idCard, idList, newStart);
        },
    };

    constructor(
        private route: ActivatedRoute,
        public svOpenCard: OpenCardService,
        private svCard: FirebaseCardsService,
        private svList: FirebaseListsService,
        private svBoard: FirebaseBoardsService
    ) { }

    ngOnInit() {
        this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
        this.boardId = this.route.snapshot.paramMap.get('boardId');
        if (this.workspaceId && this.boardId)
            this.svBoard.getBoardBackground(this.workspaceId, this.boardId).subscribe(background => {
                this.boardColorBackground = background.color;
                this.boardPictureBackground = background.picture;
            })
        if (this.boardId && this.workspaceId) {
            this.svCard.getAllDueDates(this.workspaceId, this.boardId).subscribe(dueDates => {
                const events = dueDates.map(due => {
                    return {
                        title: `${due.cardName}`,
                        start: due.dueDate?.toISOString(),
                        description: `Card ID: ${due.cardId}`,
                        allDay: true,
                        idCard: due.cardId,
                        idList: due.listId
                    };
                });
                this.calendarOptions.events = events;
            });
            this.svList.getLists(this.workspaceId, this.boardId).subscribe(lists => {
                this.lists = lists;
            });
        }
        this.subscription = this.svOpenCard.isOpenCard$.subscribe(open => {
            this.isOpenCard = open;
        });
    }

    openCardPanel(cardId: string, listId: string) {
        this.list = null;
        this.card = null;

        if (this.boardId && this.workspaceId) {
            const listObservable = this.svList.getListById(this.workspaceId, this.boardId, listId).pipe(distinctUntilChanged());
            const cardObservable = this.svCard.getCardById(this.workspaceId, this.boardId, listId, cardId).pipe(distinctUntilChanged());

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

    updateCardDate(cardId: string, listId: string, newDate: Date | null) {
        if (this.boardId && this.workspaceId)
            this.svCard.addDateToCard(this.workspaceId, this.boardId, listId, cardId, newDate);
    }
}
