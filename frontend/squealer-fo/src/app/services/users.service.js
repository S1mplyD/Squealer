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
exports.UsersService = void 0;
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
let UsersService = exports.UsersService = (() => {
    let _classDecorators = [(0, core_1.Injectable)({
            providedIn: 'root',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var UsersService = _classThis = class {
        constructor(http) {
            this.http = http;
            this.apiUrl = 'http://localhost:3000/api/users'; // Replace with your authentication API URL
            this.followApiUrl = 'http://localhost:3000/api/follow';
            this.mediaApiUrl = 'http://localhost:3000/api/media';
        }
        getAllUsers() {
            return this.http.get(this.apiUrl);
        }
        deleteUser(mail, password) {
            const params = {
                'mail': mail + '',
                'password': password + ''
            };
            return this.http.delete(this.apiUrl, { params: params });
        }
        getUserById(id) {
            return this.http.get(`${this.apiUrl}/${id}`);
        }
        getUserByUsername(username) {
            return this.http.get(`${this.apiUrl}/user/${username}`);
        }
        updateUserByUsername(username, user) {
            return this.http.put(`${this.apiUrl}/user/${username}`, user);
        }
        updateUserPictureByUsername(username, filename) {
            const params = {
                'filename': filename + ''
            };
            return this.http.put(`${this.apiUrl}/${username}/profilePicture`, { params: params });
        }
        deleteUserPictureByUsername(username, filename) {
            const params = {
                'filename': filename + ''
            };
            return this.http.delete(`${this.apiUrl}/${username}/profilePicture`, { params: params });
        }
        grantPermission(id) {
            const params = {
                'id': id + ''
            };
            return this.http.put(`${this.apiUrl}/grantPermissions`, { params: params });
        }
        revokePermission(id) {
            const params = {
                'id': id + ''
            };
            return this.http.put(`${this.apiUrl}/revokePermissions`, { params: params });
        }
        ban(id) {
            const params = {
                'id': id + ''
            };
            return this.http.put(`${this.apiUrl}/ban`, { params: params });
        }
        unban(id) {
            const params = {
                'id': id + ''
            };
            return this.http.put(`${this.apiUrl}/unban`, { params: params });
        }
        block(id, time) {
            const params = {
                'id': id + '',
                'time': time + ''
            };
            return this.http.put(`${this.apiUrl}/block`, { params: params });
        }
        unblock(id) {
            const params = {
                'id': id + ''
            };
            return this.http.put(`${this.apiUrl}/unblock`, { params: params });
        }
        follow(username) {
            const params = {
                'username': username + ''
            };
            return this.http.post(`${this.followApiUrl}/follow/${username}`, { params: params });
        }
        unfollow(username) {
            const params = {
                'username': username + ''
            };
            return this.http.post(`${this.followApiUrl}/unfollow/${username}`, { params: params });
        }
        followers(username) {
            return this.http.get(`${this.followApiUrl}/followers/${username}`);
        }
        following(username) {
            return this.http.get(`${this.followApiUrl}/following/${username}`);
        }
        getProfilePicture(username) {
            return this.http.get(`${this.apiUrl}/${username}/profilePicture`);
        }
        changeProfilePicture(formaData) {
            const headers = new http_1.HttpHeaders({ Accept: 'text/plain' });
            return this.http.post(`${this.mediaApiUrl}`, formaData, {
                headers,
                responseType: 'text'
            });
        }
        updateProfilePicture(username, fileName) {
            // const params = {
            //   'filename': fileName + ''
            // }
            return this.http.patch(`${this.apiUrl}/user/${username}/profilePicture`, { filename: fileName + '' });
        }
    };
    __setFunctionName(_classThis, "UsersService");
    (() => {
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
        UsersService = _classThis = _classDescriptor.value;
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsersService = _classThis;
})();
