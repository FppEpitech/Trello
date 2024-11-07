import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { OpenCardService } from '../../../services/open-card/open-card.service';

@Component({
  selector: 'app-open-card',
  templateUrl: './open-card.component.html',
  styleUrl: './open-card.component.scss'
})
export class OpenCardComponent {

    @ViewChild('cardElement', { static: false }) cardElement!: ElementRef;
    isOpenCard: boolean = false;

    constructor (
        private svOpenCard: OpenCardService
    ) {}

    closeOpenCard() {
        this.svOpenCard.toggleOpenCard();
    }

    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent): void {
        const clickedInside = this.cardElement.nativeElement.contains(event.target);
        if (!clickedInside && this.isOpenCard) {
            this.closeOpenCard();
        }
        this.isOpenCard = !this.isOpenCard;
    }
}
