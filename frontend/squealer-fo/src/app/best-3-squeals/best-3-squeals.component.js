"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Best3SquealsComponent = void 0;
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const L = __importStar(require("leaflet"));
const axios_1 = __importDefault(require("axios"));
let Best3SquealsComponent = exports.Best3SquealsComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-best-3-squeal',
            templateUrl: './best-3-squeals.component.html',
            styleUrls: ['./best-3-squeals.component.scss'],
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var Best3SquealsComponent = _classThis = class {
        constructor(squealService, datePipe, userService, mediaService, authService, _snackBar) {
            this.squealService = squealService;
            this.datePipe = datePipe;
            this.userService = userService;
            this.mediaService = mediaService;
            this.authService = authService;
            this._snackBar = _snackBar;
            this.squeals = [];
            this.justThreeSqueals = [];
            this.fileNameSqueal = '';
            this.fileNameAnswer = '';
            this.accounts = [];
            this.squealType = 'text';
            this.dailyChars = 9999;
            this.squealSubType = false;
            this.selectedFile = undefined;
            this.upvote = 0;
            this.downvote = 0;
            this.mapOpened = [];
            this.selectedRef = '';
            this.selectedFileName = '';
            this.responses = [];
            this.recipients = '';
            this.answeredId = '';
            this.initialMarker = {
                position: { lat: 44.35527821160296, lng: 11.260986328125 },
                draggable: true,
            };
            this.loc = {
                lat: 44.35527821160296,
                lng: 11.260986328125,
            };
            this.newSqueal = {
                author: '',
                body: '',
                date: new Date(),
                recipients: [],
                category: '',
                channels: [],
                type: '',
                _id: '',
                originalSqueal: '',
                lat: this.initialMarker.position.lat + '',
                lng: this.initialMarker.position.lng + '',
                locationName: '',
                time: 0
            };
            this.newAnswer = {
                author: '',
                body: '',
                date: new Date(),
                recipients: [],
                category: '',
                channels: [],
                type: '',
                _id: '',
                originalSqueal: '',
                lat: this.initialMarker.position.lat + '',
                lng: this.initialMarker.position.lng + '',
                locationName: '',
                time: 0
            };
            this.isLoggedIn = false;
            this.username = '';
            this.plan = '';
            this.isPostFormOpen = false;
            this.isPopupOpen = false;
            this.isAnswerOpen = false;
            this.markers = [];
            this.options = {
                layers: [
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 18,
                        attribution: '...',
                    }),
                ],
                zoom: 5,
                center: L.latLng(44.35527821160296, 11.260986328125),
            };
            this.options2 = {
                layers: [
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 18,
                        attribution: '...',
                    }),
                ],
                zoom: 5,
            };
            this._unsubscribeAll = new rxjs_1.Subject();
        }
        createOptions(lat, lng, id) {
            return {
                layers: [
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 18,
                        attribution: '...',
                    }),
                ],
                zoom: 13,
                center: L.latLng(+lat, +lng),
            };
        }
        ngOnInit() {
            if (sessionStorage.getItem('isLoggedIn') == 'true') {
                this.isLoggedIn = true;
            }
            else if (sessionStorage.getItem('isLoggedIn') == 'false') {
                this.isLoggedIn = false;
            }
            this.loadSqueals();
            this.userService
                .getAllUsers()
                .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                .subscribe((res) => {
                this.accounts = res;
                for (const acc of this.accounts) {
                    this.userService
                        .getProfilePicture(acc.username)
                        .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                        .subscribe((res) => {
                        acc.profilePicture = res;
                    });
                }
            });
            this.authService
                .isAuthenticated()
                .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                .subscribe((res) => {
                if (res.status !== '404') {
                    this.isLoggedIn = true;
                    this.username = res.username + '';
                    this.plan = res.plan + '';
                    this.dailyChars = res.dailyCharacters;
                    console.log(this.dailyChars);
                    this.loadSqueals();
                }
                else {
                    this.isLoggedIn = false;
                    this.loadSqueals();
                }
            });
            this.getPosition();
        }
        onFileSelectedSqueal(event) {
            console.log(event);
            const file = event.target.files[0];
            if (file) {
                this.fileNameSqueal = file.name;
                const formData = new FormData();
                formData.append('file', file);
                this.userService
                    .changeProfilePicture(formData)
                    .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                    .subscribe((res) => {
                    this.newSqueal.body = res;
                });
            }
        }
        onFileSelectedAnswer(event) {
            const file = event.target.files[0];
            if (file) {
                this.fileNameAnswer = file.name;
                const formData = new FormData();
                formData.append('file', file);
                this.userService
                    .changeProfilePicture(formData)
                    .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                    .subscribe((res) => {
                    this.newAnswer.body = res;
                });
            }
        }
        initMarkers() {
            const data = this.initialMarker;
            if ('geolocation' in navigator) {
                //geolocazione disponibile
                navigator.geolocation.getCurrentPosition((pos) => __awaiter(this, void 0, void 0, function* () {
                    data.position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                    this.loc.lat = pos.coords.latitude;
                    this.loc.lng = pos.coords.longitude;
                    let reverseGeocodeResult = yield this.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
                    this.newSqueal.locationName =
                        reverseGeocodeResult.features[0].properties.geocoding.city +
                            ', ' +
                            reverseGeocodeResult.features[0].properties.geocoding.county +
                            ', ' +
                            reverseGeocodeResult.features[0].properties.geocoding.state +
                            ', ' +
                            reverseGeocodeResult.features[0].properties.geocoding.country;
                }));
            }
            const marker = this.generateMarker(data, 0);
            marker
                .addTo(this.map)
                .bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
            this.map.panTo(data.position);
            this.markers.push(marker);
        }
        generateSquealMap(lat, long, id) {
            if (!this.mapOpened.includes(id)) {
                this.mapOpened.push(id);
            }
        }
        addMarker(map, lat, lng, id) {
            L.marker([+lat, +lng], {
                icon: L.icon(Object.assign(Object.assign({}, L.Icon.Default.prototype.options), { iconUrl: 'assets/marker-icon.png', iconRetinaUrl: 'assets/marker-icon-2x.png', shadowUrl: 'assets/marker-shadow.png' })),
            }).addTo(map);
        }
        getCoords() {
            console.log(this.loc);
            return this.loc;
        }
        getPosition() {
            console.log('here');
            if ('geolocation' in navigator) {
                //geolocazione disponibile
                navigator.geolocation.getCurrentPosition((pos) => __awaiter(this, void 0, void 0, function* () {
                    this.loc.lat = pos.coords.latitude;
                    this.loc.lng = pos.coords.longitude;
                    this.newSqueal.lat = pos.coords.latitude + '';
                    this.newSqueal.lng = pos.coords.longitude + '';
                    let reverseGeocodeResult = yield this.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
                    this.newSqueal.locationName =
                        reverseGeocodeResult.features[0].properties.geocoding.city +
                            ', ' +
                            reverseGeocodeResult.features[0].properties.geocoding.county +
                            ', ' +
                            reverseGeocodeResult.features[0].properties.geocoding.state +
                            ', ' +
                            reverseGeocodeResult.features[0].properties.geocoding.country;
                }));
            }
            console.log(this.newSqueal.locationName);
        }
        closeMap(id) {
            if (this.mapOpened.includes(id)) {
                this.mapOpened = this.mapOpened.filter((el) => el !== id);
            }
        }
        checkMapOpened(id) {
            return this.mapOpened.includes(id);
        }
        generateMarker(data, index) {
            return L.marker(data.position, {
                icon: L.icon(Object.assign(Object.assign({}, L.Icon.Default.prototype.options), { iconUrl: 'assets/marker-icon.png', iconRetinaUrl: 'assets/marker-icon-2x.png', shadowUrl: 'assets/marker-shadow.png' })),
                draggable: data.draggable,
            })
                .on('click', (event) => this.markerClicked(event, index))
                .on('dragend', (event) => this.markerDragEnd(event, index));
        }
        onMapReady($event) {
            this.map = $event;
            this.initMarkers();
        }
        reverseGeocode(lat, lng) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield axios_1.default.get(`https://nominatim.openstreetmap.org/reverse?format=geocodejson&lat=${lat}&lon=${lng}`);
                return response.data;
            });
        }
        mapClicked($event) {
            this.initialMarker.position.lat = $event.latlng.lat;
            this.initialMarker.position.lng = $event.latlng.lng;
            this.newSqueal.lat = $event.latlng.lat;
            this.newSqueal.lng = $event.latlng.lng;
            console.log($event.latlng.lat, $event.latlng.lng);
        }
        markerClicked($event, index) {
            console.log($event.latlng.lat, $event.latlng.lng);
        }
        markerDragEnd($event, index) {
            console.log($event.target.getLatLng());
        }
        openAnswer(id) {
            this.answeredId = id;
            this.isAnswerOpen = true;
        }
        closeAnswer() {
            this.answeredId = '';
            this.isAnswerOpen = false;
        }
        formatDate(date) {
            return this.datePipe.transform(date, 'dd-MM-yyyy'); // Change the format pattern as per your requirement
        }
        formatLabel(value) {
            if (value >= 1000) {
                return Math.round(value / 1000) + 'k';
            }
            return `${value}`;
        }
        openPostForm() {
            this.isPostFormOpen = true;
        }
        openAnswerForm() {
            this.isPostFormOpen = true;
        }
        loadSqueals() {
            console.log(this.isLoggedIn);
            if (this.isLoggedIn) {
                this.squealService
                    .getSquealsLogin3Best()
                    .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                    .subscribe((res) => {
                    this.squeals = res;
                    for (const squeal of this.squeals) {
                        this.loadAnswers(squeal._id);
                    }
                });
            }
            else {
                this.squealService
                    .getSquealsNoLogin()
                    .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                    .subscribe((res) => {
                    this.squeals = res;
                    for (const squeal of this.squeals) {
                        this.loadAnswers(squeal._id);
                    }
                });
            }
        }
        loadAnswers(id) {
            this.responses = [];
            this.squealService
                .getResponses(id)
                .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                .subscribe((resp) => {
                for (const answer of resp) {
                    this.responses.push(answer);
                }
            });
        }
        descentOrder(a, b) {
            if (!a.positiveReactions) {
                a.positiveReactions = [];
            }
            if (!b.positiveReactions) {
                b.positiveReactions = [];
            }
            if (a.positiveReactions.length >= b.positiveReactions.length) {
                return -1;
            }
            else {
                return 1;
            }
        }
        getChannels(body) {
            const channels = [];
            body = body.replace('.', ' ');
            body = body.replace(',', ' ');
            body = body.replace(':', ' ');
            body = body.replace(';', ' ');
            const words = body.split(' ');
            for (const word of words) {
                if (word[0] === '@')
                    channels.push(word);
                if (word[0] === '§')
                    channels.push(word);
                if (word[0] === '#')
                    channels.push(word);
            }
            return channels;
        }
        getRecipients(rec) {
            rec.replace('/s+/g', '');
            return rec.split(',');
        }
        addUpvote(squealId) {
            console.log(squealId);
            this.squealService
                .addUpvote(squealId)
                .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                .subscribe((res) => {
                console.log(res);
            });
            window.location.reload();
        }
        addDownvote(squealId) {
            console.log(squealId);
            this.squealService
                .addDownvote(squealId)
                .pipe((0, rxjs_1.takeUntil)(this._unsubscribeAll))
                .subscribe((res) => {
                console.log(res);
            });
            window.location.reload();
        }
        disableScroll() {
            document
                .getElementsByClassName('posts')
                .item(0)
                .classList.add('stop-scrolling');
        }
        enableScroll() {
            document
                .getElementsByClassName('posts')
                .item(0)
                .classList.remove('stop-scrolling');
        }
    };
    __setFunctionName(_classThis, "Best3SquealsComponent");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        Best3SquealsComponent = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Best3SquealsComponent = _classThis;
})();
