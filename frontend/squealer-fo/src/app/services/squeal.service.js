"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SquealService = void 0;
// tweet.service.ts
const core_1 = require("@angular/core");
let SquealService = exports.SquealService = (() => {
    let _classDecorators = [(0, core_1.Injectable)({
            providedIn: 'root'
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SquealService = _classThis = class {
        constructor(http) {
            this.http = http;
            this.apiUrl = 'http://localhost:3000/api/squeals/type'; // Replace with your authentication API URL
            this.newApiUrl = 'http://localhost:3000/api/squeals';
        }
        getAllSqueals() {
            return this.http.get(`${this.newApiUrl}`);
        }
        getAllSquealsRecipients(username) {
            const params = {
                'recipient': username + ''
            };
            return this.http.get(`${this.newApiUrl}/recipients`, { params: params });
        }
        getAllTextSqueals() {
            // Sort tweets by timestamp in descending order
            return this.http.get(`${this.apiUrl}/text`);
        }
        getSquealsForUsers(username) {
            return this.http.get(`${this.newApiUrl}/user/${username}`);
        }
        getAllMediaSqueals() {
            // Sort tweets by timestamp in descending order
            return this.http.get(`${this.apiUrl}/media`);
        }
        getMediaSquealsForUsers(username) {
            return this.http.get(`${this.newApiUrl}/user/${username}`);
        }
        getAllGeoSqueals() {
            // Sort tweets by timestamp in descending order
            return this.http.get(`${this.apiUrl}/geo`);
        }
        getGeoSquealsForUsers(username) {
            return this.http.get(`${this.apiUrl}/user/${username}`);
        }
        getAllTimedSqueals() {
            return this.http.get(`${this.apiUrl}/timed`);
        }
        getResponses(squealId) {
            return this.http.get(`${this.newApiUrl}/response/${squealId}`);
        }
        addUpvote(squealId) {
            const params = {
                'squealId': squealId + ''
            };
            return this.http.post(`${this.newApiUrl}/positiveReactions?squealId=${squealId}`, { params: params });
        }
        addDownvote(squealId) {
            const params = {
                'squealId': squealId + ''
            };
            return this.http.post(`${this.newApiUrl}/negativeReactions?squealId=${squealId}`, { params: params });
        }
        addSqueal(squeal) {
            return this.http.post(`${this.apiUrl}`, squeal);
        }
        addResponse(squeal, originalId) {
            return this.http.post(`${this.newApiUrl}/response/${originalId}`, squeal);
        }
        deleteSqueal(id) {
            return this.http.delete(`${this.apiUrl}`, { params: { 'id': id + '' } });
        }
        getSquealsNoLogin() {
            return this.http.get(`${this.newApiUrl}/nologin`);
        }
        getSquealsLogin() {
            return this.http.get(`${this.newApiUrl}/login`);
        }
        getSquealsNoLogin3Best() {
            return this.http.get(`${this.newApiUrl}/nologin3best`);
        }
        getSquealsLogin3Best() {
            return this.http.get(`${this.newApiUrl}/login3best`);
        }
    };
    __setFunctionName(_classThis, "SquealService");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        SquealService = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SquealService = _classThis;
})();
