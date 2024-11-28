import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-board-sidebar',
  templateUrl: './board-sidebar.component.html',
  styleUrl: './board-sidebar.component.scss'
})
export class BoardSidebarComponent {

    workspaceId: string | null = null;
    boardId: string | null = null;

    constructor(
        private router:Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.workspaceId = this.route.snapshot.paramMap.get('workspaceId');
        this.boardId = this.route.snapshot.paramMap.get('boardId');
    }

    goToCalendar() {
        if (this.boardId && this.workspaceId)
            this.router.navigate([`/workspace/${this.workspaceId}/calendar/${this.boardId}`]);
    }
}
