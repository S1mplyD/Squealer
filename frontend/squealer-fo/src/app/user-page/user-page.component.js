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
exports.UserPageComponent = void 0;
const core_1 = require("@angular/core");
let UserPageComponent = exports.UserPageComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-user-page',
            templateUrl: './user-page.component.html',
            styleUrls: ['./user-page.component.scss'],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UserPageComponent = _classThis = class {
        constructor(squealService, datePipe, activeRoute, accountService) {
            this.squealService = squealService;
            this.datePipe = datePipe;
            this.activeRoute = activeRoute;
            this.accountService = accountService;
        }
        ngOnInit() {
            this.userName = String(this.activeRoute.snapshot.paramMap.get("username"));
            this.getAccountData();
            this.getRecentPosts();
            this.getTaggedAnswers();
        }
        formatDate(date) {
            return this.datePipe.transform(date, 'dd/MM/yyyy'); // Change the format pattern as per your requirement
        }
        getAccountData() {
            this.account = this.accountService.getSpecificAccount(this.userName);
        }
        getRecentPosts() {
            this.recentPosts = this.squealService.getTweetsForUsers(this.userName);
        }
        getTaggedAnswers() {
            this.taggedPosts = this.squealService.getAnswersForUsers(this.userName);
            this.answerers = this.accountService.getAccounts();
            for (let tp of this.taggedPosts) {
                for (const answerer of this.answerers) {
                    if (tp.username == answerer.username) {
                        tp.profileImage = answerer.profilePicture;
                    }
                }
            }
        }
    };
    __setFunctionName(_classThis, "UserPageComponent");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        UserPageComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UserPageComponent = _classThis;
})();
