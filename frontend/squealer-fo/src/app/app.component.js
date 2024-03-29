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
exports.AppComponent = void 0;
const core_1 = require("@angular/core");
const layout_1 = require("@angular/cdk/layout");
const rxjs_1 = require("rxjs");
let AppComponent = exports.AppComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.scss']
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppComponent = _classThis = class {
        constructor(changeDetectorRef, media, authService, responsive) {
            this.authService = authService;
            this.responsive = responsive;
            this.title = 'Squealer Front Office';
            this.showFiller = false;
            this.isLoggedIn = false;
            this.localLogged = sessionStorage.getItem('isLoggedIn');
            this.username = '';
            this.plan = '';
            this._unsubscribeAll = new rxjs_1.Subject();
            this.mobileQuery = media.matchMedia('(max-width: 600px)');
            this._mobileQueryListener = () => changeDetectorRef.detectChanges();
            this.mobileQuery.addListener(this._mobileQueryListener);
        }
        ngOnInit() {
            this.responsive
                .observe([layout_1.Breakpoints.HandsetPortrait])
                .subscribe((state) => {
                if (state.matches) {
                    console.log('This is the Handset Portrait point at max-width: 599.98 px and portrait orientation.');
                }
            });
            this.authService.isAuthenticated()
                .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                .subscribe((res) => {
                if (res.status !== '404') {
                    this.isLoggedIn = true;
                    this.username = res.username + '';
                    sessionStorage.setItem('username', this.username);
                    this.plan = res.plan + '';
                }
            });
        }
        logout() {
            this.authService.logout()
                .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                .subscribe((res) => {
                this.isLoggedIn = false;
            });
            location.reload();
        }
        ngOnDestroy() {
            this.mobileQuery.removeListener(this._mobileQueryListener);
        }
    };
    __setFunctionName(_classThis, "AppComponent");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        AppComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppComponent = _classThis;
})();
