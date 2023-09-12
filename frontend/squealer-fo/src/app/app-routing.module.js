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
exports.AppRoutingModule = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const home_component_1 = require("./home/home.component");
const platform_browser_1 = require("@angular/platform-browser");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const animations_1 = require("@angular/platform-browser/animations");
const account_list_component_1 = require("./followed-accounts/account-list.component");
const user_page_component_1 = require("./user-page/user-page.component");
const auth_component_1 = require("./authentication/auth.component");
account_list_component_1.AccountListComponent;
const routes = [
    { path: 'authentication', component: auth_component_1.AuthComponent },
    { path: '', component: home_component_1.HomeComponent },
    { path: 'following', component: account_list_component_1.AccountListComponent },
    { path: 'following/:username', component: user_page_component_1.UserPageComponent }
];
let AppRoutingModule = exports.AppRoutingModule = (() => {
    let _classDecorators = [(0, core_1.NgModule)({
            imports: [
                router_1.RouterModule.forRoot(routes),
                platform_browser_1.BrowserModule,
                animations_1.BrowserAnimationsModule,
                common_1.CommonModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule
            ],
            exports: [router_1.RouterModule]
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppRoutingModule = _classThis = class {
    };
    __setFunctionName(_classThis, "AppRoutingModule");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        AppRoutingModule = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppRoutingModule = _classThis;
})();
