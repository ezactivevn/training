/// <reference types="request" />
import request = require('request');
import { promise } from "protractor";
import Promise = promise.Promise;

// import { ResponsePromise } from "./promisewrappers";
export declare class HttpClient {
    private baseUrl?;
    private _failOnHttpError;
    constructor(baseUrl?: string);
    failOnHttpError: boolean;
    static commonRequestOptions: request.CoreOptions;
    request(options: request.Options): ResponsePromise;
    get(url: string, headers?: any): ResponsePromise;
    post(url: string, body?: any, headers?: any): ResponsePromise;
    put(url: string, body?: any, headers?: any): ResponsePromise;
    delete(url: string, headers?: any): ResponsePromise;
    private send(method, url, body?, headers?);
}
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