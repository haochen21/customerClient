import { Injectable } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { SecurityService } from './security.service';
import { User } from '../model/User';

@Injectable()
export class SocketService {

    socket: SocketIOClient.Socket;

    constructor(
        private securityService: SecurityService) { }

    sendMessage(event, message) {
        this.socket.emit(event, message);
    }

    get(user:User): Observable<any> {
        this.socket = io.connect();
        this.socket.on("connect", () => this.connect(user));
        this.socket.on("disconnect", () => this.disconnect());
        this.socket.on("error", (error: string) => {
            console.log('ERROR:'+error);
        });
        
        return Observable.create((observer: any) => {
            this.socket.on("cart-message", (item: any) => observer.next(item));           
            return () => this.socket.close();
        });
    }
    
    private connect(user:User) {
        console.log('Connected to websocket');
        this.socket.emit('set_user', user);
    }

    private disconnect() {
        console.log('Disconnected from websocket');
    }
}