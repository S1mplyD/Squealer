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
exports.AppModule = void 0;
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const sidenav_1 = require("@angular/material/sidenav");
const app_routing_module_1 = require("./app-routing.module");
const app_component_1 = require("./app.component");
const list_1 = require("@angular/material/list");
const icon_1 = require("@angular/material/icon");
const button_1 = require("@angular/material/button");
const toolbar_1 = require("@angular/material/toolbar");
const animations_1 = require("@angular/platform-browser/animations");
const expansion_1 = require("@angular/material/expansion");
const tabs_1 = require("@angular/material/tabs");
const home_component_1 = require("./home/home.component");
const card_1 = require("@angular/material/card");
const new_squeals_component_1 = require("./home/new-squeals/new-squeals.component");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const input_1 = require("@angular/material/input");
const account_list_component_1 = require("./followed-accounts/account-list.component");
const user_page_component_1 = require("./user-page/user-page.component");
const auth_component_1 = require("./authentication/auth.component");
const http_1 = require("@angular/common/http");
const dialog_1 = require("@angular/material/dialog");
const radio_1 = require("@angular/material/radio");
const checkbox_1 = require("@angular/material/checkbox");
const slider_1 = require("@angular/material/slider");
const select_1 = require("@angular/material/select");
const form_field_1 = require("@angular/material/form-field");
const snack_bar_1 = require("@angular/material/snack-bar");
const progress_spinner_1 = require("@angular/material/progress-spinner");
const ngx_leaflet_1 = require("@asymmetrik/ngx-leaflet");
const best_3_squeals_component_1 = require("./best-3-squeals/best-3-squeals.component");
let AppModule = exports.AppModule = (() => {
    let _classDecorators = [(0, core_1.NgModule)({
            declarations: [
                app_component_1.AppComponent,
                home_component_1.HomeComponent,
                new_squeals_component_1.NewSquealsComponent,
                account_list_component_1.AccountListComponent,
                user_page_component_1.UserPageComponent,
                auth_component_1.AuthComponent,
                best_3_squeals_component_1.Best3SquealsComponent
            ],
            imports: [
                tabs_1.MatTabsModule,
                card_1.MatCardModule,
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                animations_1.BrowserAnimationsModule,
                sidenav_1.MatSidenavModule,
                toolbar_1.MatToolbarModule,
                icon_1.MatIconModule,
                button_1.MatButtonModule,
                list_1.MatListModule,
                expansion_1.MatExpansionModule,
                snack_bar_1.MatSnackBarModule,
                progress_spinner_1.MatProgressSpinnerModule,
                forms_1.FormsModule,
                input_1.MatInputModule,
                forms_1.ReactiveFormsModule,
                dialog_1.MatDialogModule,
                http_1.HttpClientModule,
                radio_1.MatRadioModule,
                checkbox_1.MatCheckboxModule,
                slider_1.MatSliderModule,
                select_1.MatSelectModule,
                form_field_1.MatFormFieldModule,
                ngx_leaflet_1.LeafletModule
            ],
            providers: [common_1.DatePipe],
            bootstrap: [app_component_1.AppComponent]
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AppModule = _classThis = class {
    };
    __setFunctionName(_classThis, "AppModule");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
})();
