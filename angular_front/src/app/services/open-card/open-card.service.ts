import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenCardService {

    private _isOpenCard = new BehaviorSubject<boolean>(false);
    isOpenCard$: Observable<boolean>;
    _card: any;
    _list: any;

    constructor() {
        this.isOpenCard$ = this._isOpenCard.asObservable();
      }

    toggleOpenCard(): void {
        this._isOpenCard.next(!this._isOpenCard.getValue());
    }

    setCard(card: any) {
        this._card = card;
    }

    setList(list: any) {
        this._list = list;
    }
}
