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
exports.AccountListComponent = void 0;
// account-list.component.ts
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
let AccountListComponent = exports.AccountListComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-account-list',
            templateUrl: './account-list.component.html',
            styleUrls: ['./account-list.component.scss'],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AccountListComponent = _classThis = class {
        constructor(router, authService, userService) {
            this.router = router;
            this.authService = authService;
            this.userService = userService;
            this.accounts = [];
            this.username = '';
            this._unsubscribeAll = new rxjs_1.Subject();
        }
        ngOnInit() {
            this.authService.isAuthenticated()
                .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                .subscribe((res) => {
                this.userService.following(res.username)
                    .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                    .subscribe(resp => this.accounts = resp);
            });
        }
    };
    __setFunctionName(_classThis, "AccountListComponent");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        AccountListComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AccountListComponent = _classThis;
})();
