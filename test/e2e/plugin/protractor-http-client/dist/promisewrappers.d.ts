/// <reference types="selenium-webdriver" />
/// <reference types="request" />
/// <reference types="node" />
import request = require("request");
import { promise } from "protractor";
import Promise = promise.Promise;
/**
 * Wraps a Promise, providing some handy properties to access status code and body
*/
export declare class ResponsePromise {
    private wrappedPromise;
    constructor(promise: Promise<request.Response>);
    readonly statusCode: Promise<number>;
    header(name: string): Promise<string | string[] | undefined>;
    readonly body: Promise<Buffer>;
    readonly stringBody: Promise<string>;
    readonly jsonBody: JsonPromise;
    then(onFulfilled: promise.IFulfilledCallback<any>, onRejected?: promise.IRejectedCallback): Promise<any>;
    catch(callback: promise.IFulfilledCallback<any>): Promise<any>;
}
export declare class JsonPromise {
    private wrappedPromise;
    constructor(promise: Promise<any>);
    get(prop: string | number): JsonPromise;
    then(onFulfilled: promise.IFulfilledCallback<any>, onRejected?: promise.IRejectedCallback): Promise<any>;
    catch(callback: promise.IFulfilledCallback<any>): Promise<any>;
}
