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

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss']
  })
  export class CalendarComponent {

    boardId: string | null = null;
    list: any | null = null;
    card: any | null = null;
    lists: any[] = [];

    isOpenCard: boolean = false;
    subscription: Subscription = new Subscription();

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
    };

    constructor(
        private route: ActivatedRoute,
        public svOpenCard: OpenCardService,
        private svCard: FirebaseCardsService,
        private svList: FirebaseListsService
    ) { }

    ngOnInit() {
        this.boardId = this.route.snapshot.paramMap.get('id');
        if (this.boardId) {
            this.svCard.getAllDueDates(this.boardId).subscribe(dueDates => {
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
            this.svList.getLists(this.boardId).subscribe(lists => {
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

        if (this.boardId) {
            const listObservable = this.svList.getListById(this.boardId, listId).pipe(distinctUntilChanged());
            const cardObservable = this.svCard.getCardById(this.boardId, listId, cardId).pipe(distinctUntilChanged());

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
