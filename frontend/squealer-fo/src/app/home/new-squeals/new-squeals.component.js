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
exports.NewSquealsComponent = void 0;
const core_1 = require("@angular/core");
let NewSquealsComponent = exports.NewSquealsComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-new-squeal',
            templateUrl: './new-squeals.component.html',
            styleUrls: ['./new-squeals.component.scss'],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var NewSquealsComponent = _classThis = class {
        constructor(squealService, datePipe, accountService) {
            this.squealService = squealService;
            this.datePipe = datePipe;
            this.accountService = accountService;
            this.squeals = [];
            this.accounts = [];
            this.newSqueal = { id: 0, profileImage: undefined, username: '', content: '', timestamp: new Date() };
            this.isLoggedIn = false;
            this.username = '';
            this.plan = '';
            this.isPostFormOpen = false;
        }
        ngOnInit() {
            this.squeals = this.squealService.getTweets();
            this.accounts = this.accountService.getAccounts();
            for (let tp of this.squeals) {
                for (const acc of this.accounts) {
                    if (tp.username == acc.username) {
                        tp.profileImage = acc.profilePicture;
                    }
                }
            }
            if (localStorage.getItem('plan') === 'admin') {
                this.plan = 'admin';
            }
            if (localStorage.getItem('isLoggedIn') === 'false') {
                this.isLoggedIn = false;
            }
            else if (localStorage.getItem('isLoggedIn') === 'true') {
                this.isLoggedIn = true;
            }
            if (localStorage.getItem('username')) {
                this.username = localStorage.getItem('username') + '';
            }
        }
        formatDate(date) {
            return this.datePipe.transform(date, 'dd-MM-yyyy'); // Change the format pattern as per your requirement
        }
        openPostForm() {
            this.isPostFormOpen = true;
        }
        closePostForm() {
            this.isPostFormOpen = false;
            this.newSqueal = { id: 0, profileImage: undefined, username: '', content: '', timestamp: new Date() };
        }
        addPost() {
            const newId = this.squeals.length + 1;
            const newSqueal = {
                id: newId,
                profileImage: undefined,
                username: this.username,
                content: this.newSqueal.content,
                timestamp: new Date()
            };
            this.squeals.unshift(newSqueal); // Add the new post at the beginning of the array
            this.newSqueal.content = ''; // Clear the form field
            this.isPostFormOpen = false;
            for (let tp of this.squeals) {
                for (const acc of this.accounts) {
                    if (tp.username == acc.username) {
                        tp.profileImage = acc.profilePicture;
                    }
                }
            }
        }
    };
    __setFunctionName(_classThis, "NewSquealsComponent");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        NewSquealsComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NewSquealsComponent = _classThis;
})();
