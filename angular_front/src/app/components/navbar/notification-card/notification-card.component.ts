import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.scss'
})
export class NotificationCardComponent {

    @Input() senderEmail:string | null = null;
    @Input() timestamp: string | null = null;
    @Input() message: string | null = null;
    @Input() texts: string [] = [];
    @Input() type: string | null = null;
}
