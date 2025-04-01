export class RouteHandler {
  constructor(path, router) {
    this.path = path;
    this.router = router;
  }
}

export class MessageHandler {
  constructor(status, message,data ) {
    this.status = status;
    this.message = message;
  }
}

export class ResponseHandler {
  constructor( message,data,error=null) {
      this.message = message;
      this.data = data;
      this.error=error
  }
}

