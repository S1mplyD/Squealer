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
exports.AuthComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const rxjs_1 = require("rxjs");
let AuthComponent = exports.AuthComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-auth',
            templateUrl: './auth.component.html',
            styleUrls: ['./auth.component.scss'],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuthComponent = _classThis = class {
        constructor(authService, formBuilder, router, _snackBar, componentCacheService) {
            this.authService = authService;
            this.formBuilder = formBuilder;
            this.router = router;
            this._snackBar = _snackBar;
            this.componentCacheService = componentCacheService;
            this.isLoggedIn = false;
            this.userName = '';
            this.user = {
                name: '',
                username: '',
                mail: '',
                dailyCharacters: 0,
                weeklyCharacters: 0,
                monthlyCharacters: 0,
                plan: '',
                resetToken: '',
                createdAt: new Date(),
                status: '',
                blockedFor: 0
            };
            this.parameters = {
                dataSource: []
            };
            this._unsubscribeAll = new rxjs_1.Subject();
            this.loginForm = this.formBuilder.group({
                email: ['', forms_1.Validators.required],
                password: ['', forms_1.Validators.required],
            });
            this.signupForm = this.formBuilder.group({
                email: ['', forms_1.Validators.required],
                password: ['', forms_1.Validators.required],
                username: ['', forms_1.Validators.required],
                name: ['', forms_1.Validators.required],
            });
            this.recoverPasswordForm = this.formBuilder.group({
                email: ['', forms_1.Validators.required],
            });
        }
        ngOnDestroy() {
            this.componentCacheService.set(AuthComponent.name, this.parameters);
        }
        ngOnInit() {
            throw new Error('Method not implemented.');
        }
        loginWithGoogle() {
            this.authService.loginWithGoogle()
                .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                .subscribe((acc) => {
                this.user = acc;
                sessionStorage.setItem('username', this.user.username);
            });
            this.router.navigateByUrl('');
        }
        loginWithEmail() {
            const email = this.loginForm.value.email;
            const password = this.loginForm.value.password;
            this.authService.loginWithEmail(email, password)
                .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                .subscribe((acc) => {
                this.user = acc;
                this.authService.isAuthenticated()
                    .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                    .subscribe((res) => {
                    if (res.status !== '404') {
                        this.isLoggedIn = true;
                        this.user = res;
                        sessionStorage.setItem('username', this.user.username);
                        sessionStorage.setItem('isLoggedIn', 'true');
                        this.router.navigateByUrl('');
                    }
                });
            }, (error) => {
                this._snackBar.open('Email or password are not correct! Retry.', 'Close', {
                    duration: 3000
                });
            });
        }
        signup() {
            const email = this.signupForm.value.email;
            const password = this.signupForm.value.password;
            const username = this.signupForm.value.username.Replace(' ', '_');
            const name = this.signupForm.value.name;
            this.authService.signUp(email, password, username, name)
                .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                .subscribe((acc) => {
                this.user = acc;
                sessionStorage.setItem('username', this.user.username);
                sessionStorage.setItem('isLoggedIn', 'true');
                this.router.navigateByUrl('');
            });
        }
        recoverPassword() {
            const email = this.recoverPasswordForm.value.email;
            this.authService.recoverPassword(email);
        }
        logout() {
            this.authService.logout();
            sessionStorage.setItem('isLoggedIn', 'false');
            this.isLoggedIn = false;
            this.userName = '';
        }
    };
    __setFunctionName(_classThis, "AuthComponent");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        AuthComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthComponent = _classThis;
})();
