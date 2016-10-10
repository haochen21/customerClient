import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { SecurityService } from './security.service';
import { Customer } from '../model/Customer';

@Injectable()
export class SocketService {

    socket: SocketIOClient.Socket;

    constructor(
        private securityService: SecurityService) { }

    sendMessage(event, message) {
        this.socket.emit(event, message);
    }

    get(customer:Customer): Observable<any> {
        this.socket = io.connect();
        this.socket.on("connect", () => this.connect(customer));
        this.socket.on("disconnect", () => this.disconnect());
        this.socket.on("error", (error: string) => {
            console.log('ERROR:'+error);
        });
        
        return Observable.create((observer: any) => {
            this.socket.on("cart-message", (item: any) => observer.next(item));           
            return () => this.socket.close();
        });
    }
    
    private connect(customer:Customer) {
        console.log('Connected to websocket');
        this.socket.emit('set_customer', customer);
    }

    private disconnect() {
        console.log('Disconnected from websocket');
    }
}