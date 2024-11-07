import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenCardService {

    private _isOpenCard = new BehaviorSubject<boolean>(false);
    isOpenCard$: Observable<boolean>;

    constructor() {
        this.isOpenCard$ = this._isOpenCard.asObservable();
      }

    toggleOpenCard(): void {
        this._isOpenCard.next(!this._isOpenCard.getValue());
    }
}
