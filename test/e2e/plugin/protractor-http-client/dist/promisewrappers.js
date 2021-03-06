"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
/**
 * Wraps a Promise, providing some handy properties to access status code and body
*/
class ResponsePromise {
    constructor(promise) {
		console.log('HELLO - ResponsePromise');
		this.wrappedPromise = promise;
    }
    get statusCode() {
        return this.wrappedPromise.then(result => result.statusCode);
    }
    header(name) {
        return this.wrappedPromise.then(result => result.headers[name.toLowerCase()]);
    }
    get body() {
        return this.wrappedPromise.then(result => result.body);
    }
    get stringBody() {
		console.log('stringBody = ');
        return this.wrappedPromise.then(result => result.body.toString());
    }
    get jsonBody() {
        return new JsonPromise(this.wrappedPromise.then(result => asJson(result.body)));
    }
    then(onFulfilled, onRejected) {
        return this.wrappedPromise.then(onFulfilled, onRejected);
    }
    catch(callback) {
        return this.wrappedPromise.catch(callback);
    }
}
exports.ResponsePromise = ResponsePromise;
class JsonPromise {
    constructor(promise) {
        this.wrappedPromise = promise;
    }
    get(prop) {
        return new JsonPromise(this.wrappedPromise.then(obj => obj[prop]));
    }
    then(onFulfilled, onRejected) {
        return this.wrappedPromise.then(onFulfilled, onRejected);
    }
    catch(callback) {
        return this.wrappedPromise.catch(callback);
    }
}
exports.JsonPromise = JsonPromise;
function asJson(body) {
    if (util.isString(body) || Buffer.isBuffer(body)) {
        return JSON.parse(body.toString());
    }
    else {
        return body;
    }
}
//# sourceMappingURL=promisewrappers.js.map