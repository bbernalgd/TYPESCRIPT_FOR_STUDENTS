"use strict";
class Observer {
    constructor(handlers) {
        this.handlers = handlers;
        this.isUnsubscribed = false;
    }
    next(value) {
        if (this.handlers.next && !this.isUnsubscribed) {
            this.handlers.next(value);
        }
    }
    error(error) {
        if (!this.isUnsubscribed) {
            if (this.handlers.error) {
                this.handlers.error(error);
            }
            this.unsubscribe();
        }
    }
    complete() {
        if (!this.isUnsubscribed) {
            if (this.handlers.complete) {
                this.handlers.complete();
            }
            this.unsubscribe();
        }
    }
    unsubscribe() {
        this.isUnsubscribed = true;
        if (this._unsubscribe) {
            this._unsubscribe();
        }
    }
}
class Observable {
    constructor(subscribe) {
        this._subscribe = subscribe;
    }
    static from(values) {
        return new Observable((observer) => {
            values.forEach((value) => observer.next(value));
            observer.complete();
            return () => {
                console.log("unsubscribed");
            };
        });
    }
    subscribe(obs) {
        const observer = new Observer(obs);
        observer._unsubscribe = this._subscribe(observer);
        return {
            unsubscribe() {
                observer.unsubscribe();
            },
        };
    }
}
var HTTP;
(function (HTTP) {
    HTTP["POST_METHOD"] = "POST";
    HTTP["GET_METHOD"] = "GET";
})(HTTP || (HTTP = {}));
var HTTP_STATUS;
(function (HTTP_STATUS) {
    HTTP_STATUS[HTTP_STATUS["OK"] = 200] = "OK";
    HTTP_STATUS[HTTP_STATUS["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HTTP_STATUS || (HTTP_STATUS = {}));
const userMock = {
    name: "User Name",
    age: 26,
    roles: ["user", "admin"],
    createdAt: new Date(),
    isDeleated: false,
};
const requestsMock = [
    {
        method: HTTP.POST_METHOD,
        host: "service.example",
        path: "user",
        body: userMock,
        params: {},
    },
    {
        method: HTTP.GET_METHOD,
        host: "service.example",
        path: "user",
        params: {
            id: "3f5h67s4s",
        },
    },
];
const handleRequest = (request) => {
    return { status: HTTP_STATUS.OK };
};
const handleError = (error) => {
    return { status: HTTP_STATUS.INTERNAL_SERVER_ERROR };
};
const handleComplete = () => console.log("complete");
const requests$ = Observable.from(requestsMock);
const subscription = requests$.subscribe({
    next: handleRequest,
    error: handleError,
    complete: handleComplete,
});
subscription.unsubscribe();
//# sourceMappingURL=index.js.map