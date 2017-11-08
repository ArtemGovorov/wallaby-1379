import { Bind } from "lodash-decorators/bind";

/**
 * Realtime api client
 */
export class RealtimeApi {
    /**
     * Application store
     */
    // private store: ApplicationMiddlewareStore;

    /**
     * Client socket
     */
    private socket = {
        on: (a: any, b: any) => { },
        emit: (a: string, b: any, callback: Function) => {
            callback("success");
        }
    };

    /**
     * Pending actions map. Each action represented by corresponding promise
     */
    private pendingActions: Map<Promise<any>, { reject: Function, resolve: Function }>;

    /**
     * Connection promise
     */
    private connectionPromise?: Promise<any>;

    // Connection promise handlers
    private connectionPromiseResolve: Function;
    private connectionPromiseReject: Function;

    /**
     * Current number of reconnection attempt
     */
    private currentReconnectionAttempt: number;

    /**
     * @constructor
     */
    public constructor() {
        this.pendingActions = new Map();
        // Delay connecting until call connect()
        // this.socket = io(realtimeUrl + "/visitor", {
        //     autoConnect: false,
        //     reconnection: true, // don't need reconnection,
        //     query: {
        //         // tslint:disable-next-line:no-null-keyword
        //         code: code || null,
        //         apiVersion: VisitorApi.API_VERSION
        //     }
        // });
        this.connectionPromise = Promise.resolve();

        this.socket.on("connect", this.onConnect);
        this.socket.on("connect_error", this.onConnectError);
        this.socket.on("error", this.onSocketError);
        this.socket.on("uncoverable_error", this.onUncoverableError);
        this.socket.on("disconnect", this.onDisconnect);
        this.socket.on("reconnect_attempt", this.onReconnectAttempt);
    }

    /**
     * Initial connect to socket
     * @param store
     * @param query
     */
    public connect(store: any) {
        // this.store = store;
        // const reconnectionToken = store.getState().application.reconnectionToken;
        // if (this.socket.io.opts.query && reconnectionToken) {
        //     this.socket.io.opts.query["reconnectionToken"] = reconnectionToken;
        // }

        // // inform app that we're trying to connect
        // this.store.dispatch(setRealtimeStatus("connecting"));

        // create connection promise
        if (!this.connectionPromise) {
            this.connectionPromise = new Promise<void>((resolve, reject) => {
                this.connectionPromiseResolve = resolve;
                this.connectionPromiseReject = reject;
            });
        }
        // this.socket.connect();
    }

    /**
     * Disconnect from realtime backend
     */
    public disconnect() {
        if (this.socket) {
            // this.socket.disconnect();
            this.connectionPromise = undefined;
        }
    }

    /**
     * Send action to realtime backend
     */
    public sendAction(action: any): any {
        const self = this;
        return new Promise<any>(async function (this: Promise<any>, resolve: Function, reject: Function) {
            try {
                // for active connection we should have always resolved connectionPromise
                if (!self.connectionPromise) {
                    throw new Error("Socket is not connected");
                }
                self.pendingActions.set(this, { resolve: resolve, reject: reject });
                await self.connectionPromise;
                self.socket.emit("AAA", {}, (response: string) => {
                    self.pendingActions.delete(this);
                    resolve(response);
                });
            } catch (e) {
                if (self.pendingActions.has(this)) {
                    self.pendingActions.delete(this);
                }
                reject(e);
            }
        });
    }

    /**
     * Successful connection handler
     */
    @Bind()
    protected onConnect() {
        this.currentReconnectionAttempt = 0;
        // reset connection attempts
        this.socket.on("", this.onRealtimeEvent);
        // indicate app that we're connected
        // this.store.dispatch(setRealtimeStatus("connected"));
        // resolve connection promise
        if (this.connectionPromise) {
            this.connectionPromiseResolve();
        }
    }

    /**
     * Reconnection attempt. Will be called on any reconnection attempt regardless initially connected or no
     */
    @Bind()
    protected onReconnectAttempt(attempt: number) {
        this.currentReconnectionAttempt = attempt;
        // update reconnection token on reconnect attempt
        // const reconnectionToken = this.store.getState().application.reconnectionToken;
        // // if (this.socket.io.opts.query && reconnectionToken) {
        // //     this.socket.io.opts.query["reconnectionToken"] = reconnectionToken;
        // // }
        // this.store.dispatch(setRealtimeStatus("connecting"));
    }

    /**
     * Socket.io some error. Also will be called in case socket.emit("error")
     */
    @Bind()
    protected onSocketError(error: Error) {
        // this.store.dispatch(setRealtimeStatus("disconnected"));
        // this.store.dispatch(setError("generic"));
        // this.socket.disconnect();
    }

    /**
     * For now it can only have code_incorrect type
     */
    @Bind()
    protected onUncoverableError() {
        // this.store.dispatch(setRealtimeStatus("disconnected"));
        // this.store.dispatch(setError("code_incorrect"));
        // this.socket.disconnect();
    }

    /**
     * Connection error on first connect attempt/reconnect attempt
     */
    @Bind()
    protected onConnectError() {
        if (this.currentReconnectionAttempt > 3) {
            // also reject connecting promise
            if (this.connectionPromise) {
                this.connectionPromiseReject(new Error("Connection error"));
            }
            // this.store.dispatch(setRealtimeStatus("disconnected"));
        }
    }

    /**
     * Disconnect handler
     */
    @Bind()
    protected onDisconnect() {
        // unlisten realtime event
        // this.socket.off(VisitorApi.BACKEND_REALTIME_EVENT);
        // Create new connection promise to stack pending actions again since we'll reconnect
        // this will be rejected after 3 failed connection attempts
        this.connectionPromise = new Promise<void>((resolve, reject) => {
            this.connectionPromiseResolve = resolve;
            this.connectionPromiseReject = reject;
        });
    }

    /**
     * Incoming realtime event handler
     */
    @Bind()
    protected onRealtimeEvent(action: any) {
        // this.store.dispatch(action);
    }
}
