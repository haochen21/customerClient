import {Injectable}      from '@angular/core'
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class CartService {
    // Observable navItem source
    private _cartSource = new ReplaySubject<Array<any>>(0);
    // Observable navItem stream
    pucharsingCart$ = this._cartSource.asObservable();
    // service command
    changeCarts(carts) {
        this._cartSource.next(carts);
    }
}