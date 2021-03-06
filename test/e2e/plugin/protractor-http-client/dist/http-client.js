"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const request = require("request");
const protractor = require("protractor");
const promisewrappers_1 = require("./promisewrappers");
const controlFlow = protractor.promise.controlFlow();
class HttpClient {
    constructor(baseUrl) {
        this._failOnHttpError = false;
        this.baseUrl = baseUrl;
    }
    set failOnHttpError(value) {
        this._failOnHttpError = value;
    }
    static set commonRequestOptions(commonOptions) {
        request.defaults(commonOptions);
    }
    request(options) {
        const deferred = protractor.promise.defer();
        const failOnError = this._failOnHttpError;
        const callback = (error, response, body) => {
            if (error) {
				console.log('ERROR');
				deferred.reject(error);
            }
            else if (failOnError && !(response.statusCode >= 200 && response.statusCode < 300)) {
				console.log('BODY');
				body = body || "";
                if (body.toString() === '[object Object]') {
                    body = JSON.stringify(body);
                }
                else if (Buffer.isBuffer(body)) {
                    if (body.indexOf(0) >= 0) {
                        body = "<" + response.headers["content-type"] + ", length=" + body.length + ">";
                    }
                    else {
                        body = body.toString();
                    }
                }
                deferred.reject("request returned status code of " + response.statusCode + " and body " + body);
            }
            else {
				console.log('FULFILL');
                // deferred.fulfill(response);
                deferred.fulfill(body);
            }
        };
        return new promisewrappers_1.ResponsePromise(controlFlow.execute(() => {
            request(options, callback);
            return deferred.promise;
        }));
	}
    get(url, headers) {
        return this.send('GET', url, null, headers);
    }
    post(url, body, headers) {
        return this.send('POST', url, body, headers);
    }
    put(url, body, headers) {
        return this.send('PUT', url, body, headers);
    }
    delete(url, headers) {
        return this.send('DELETE', url, null, headers);
    }
    send(method, url, body, headers) {
        const options = {
            baseUrl: this.baseUrl,
            url: url,
            method: method,
            headers: headers,
            jar: true,
            encoding: null
        };
        if (util.isString(body)) {
            options.body = body;
        }
        else if (util.isObject(body)) {
            options.json = body;
        }
        return this.request(options);
    }
}
exports.HttpClient = HttpClient;
