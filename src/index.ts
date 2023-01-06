interface IObserver extends IHandlers {
  handlers: IHandlers;
  isUnsubscribed: boolean;
}

interface IHandlers {
  next: (value: RequestsMockType) => void;
  error: (error: RequestsMockType) => void;
  complete: () => void;
}

class Observer implements IObserver {
  handlers: IHandlers;
  isUnsubscribed: boolean;
  _unsubscribe?: (void | (() => void));

  constructor(handlers: IHandlers) {
    this.handlers = handlers;
    this.isUnsubscribed = false;
  }

  next(value: RequestsMockType): void {
    if (this.handlers.next && !this.isUnsubscribed) {
      this.handlers.next(value);
    }
  }

  error(error: RequestsMockType): void {
    if (!this.isUnsubscribed) {
      if (this.handlers.error) {
        this.handlers.error(error);
      }
      this.unsubscribe();
    }
  }

  complete(): void {
    if (!this.isUnsubscribed) {
      if (this.handlers.complete) {
        this.handlers.complete();
      }

      this.unsubscribe();
    }
  }

  unsubscribe(): void {
    this.isUnsubscribed = true;

    if (this._unsubscribe) {
      this._unsubscribe();
    }
  }
}

interface IObservable {
  subscribe: (obs: IHandlers) => void;
}

class Observable implements IObservable {
  _subscribe;

  constructor(subscribe: (observer: IHandlers) => void) {
    this._subscribe = subscribe;
  }

  static from(values: RequestsMockType[]) {
    return new Observable((observer) => {
      values.forEach((value) => observer.next(value));

      observer.complete();

      return (): void => {
        console.log("unsubscribed");
      };
    });
  }

  subscribe(obs: IHandlers) {
    const observer = new Observer(obs);

    observer._unsubscribe = this._subscribe(observer);

    return {
      unsubscribe() {
        observer.unsubscribe();
      },
    };
  }
}

enum HTTP { 
  POST_METHOD = "POST",
  GET_METHOD = "GET"
}

enum HTTP_STATUS {
  OK = 200,
  INTERNAL_SERVER_ERROR = 500
}

interface userMock {
  name: string;
  age: number;
  roles: string[];
  createdAt: Date;
  isDeleated: boolean;
}

interface RequestsMockType {
  method: string;
  host: string;
  path: string;
  body?: userMock;
  params: {
    id?: string;
  };
}

interface RequestStatus {
  status: number;
}

const userMock: userMock = {
  name: "User Name",
  age: 26,
  roles: ["user", "admin"],
  createdAt: new Date(),
  isDeleated: false,
};

const requestsMock: RequestsMockType[] = [
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

const handleRequest = (request: RequestsMockType): RequestStatus => {
  // handling of request
  return { status: HTTP_STATUS.OK };
};

const handleError = (error: RequestsMockType): RequestStatus => {
  // handling of error
  return { status: HTTP_STATUS.INTERNAL_SERVER_ERROR };
};

const handleComplete = (): void => console.log("complete");

const requests$ = Observable.from(requestsMock);

const subscription = requests$.subscribe({
  next: handleRequest,
  error: handleError,
  complete: handleComplete,
});

subscription.unsubscribe();
