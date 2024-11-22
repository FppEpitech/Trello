import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-board-sidebar',
  templateUrl: './board-sidebar.component.html',
  styleUrl: './board-sidebar.component.scss'
})
export class BoardSidebarComponent {

    boardId: string | null = null;

    constructor(
        private router:Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.boardId = this.route.snapshot.paramMap.get('id');
    }

    goToCalendar() {
        if (this.boardId)
            this.router.navigateByUrl(`/calendar/${this.boardId}`);
    }
}
