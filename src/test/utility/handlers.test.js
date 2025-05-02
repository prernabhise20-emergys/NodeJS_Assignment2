const {RouteHandler, MessageHandler, ResponseHandler }=require('../../common/utility/handlers.js')

describe('RouteHandler', () => {
  it('should initialize with given path and router', () => {
    const mockRouter = { get: jest.fn() };
    const handler = new RouteHandler('/api/test', mockRouter);

    expect(handler.path).toBe('/api/test');
    expect(handler.router).toBe(mockRouter);
  });
});

describe('MessageHandler', () => {
  it('should initialize with given status and message', () => {
    const handler = new MessageHandler(200, 'Success');

    expect(handler.status).toBe(200);
    expect(handler.message).toBe('Success');
  });

  it('should ignore data if passed (since it\'s unused)', () => {
    const handler = new MessageHandler(404, 'Not Found', { extra: true });

    expect(handler.status).toBe(404);
    expect(handler.message).toBe('Not Found');
    expect(handler.data).toBeUndefined();
  });
});

describe('ResponseHandler', () => {
  it('should initialize with status, message, and data', () => {
    const data = { id: 1 };
    const handler = new ResponseHandler(201, 'Created', data);

    expect(handler.status).toBe(201);
    expect(handler.message).toBe('Created');
    expect(handler.data).toEqual(data);
    expect(handler.error).toBe(null);
  });

  it('should store error if provided', () => {
    const error = new Error('Something went wrong');
    const handler = new ResponseHandler(500, 'Failed', null, error);

    expect(handler.status).toBe(500);
    expect(handler.message).toBe('Failed');
    expect(handler.data).toBe(null);
    expect(handler.error).toBe(error);
  });
});
