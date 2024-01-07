import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_USER_MODEL } from "./const";

class UserApiRequest extends BaseModelAPI {
    constructor() {
        super(API_USER_MODEL.url);
    }

    async login<T>(body?: any) {
        return this.makeRequest<T>(axiosClient.post, {method: API_USER_MODEL.methods.login.url, body: body});
    }
    async register<T>(body?: any) {
        return this.makeRequest<T>(axiosClient.post, {method: API_USER_MODEL.methods.register.url, body: body});
    }
    async avatarsUpdate<T>(body?: any) {
        return this.makeRequest<T>(axiosClient.put, {method: API_USER_MODEL.methods.avatars.url, body: body});
    }
    async phones<T>(body?: any) {
        return this.makeRequest<T>(axiosClient.post, {method: API_USER_MODEL.methods.phones.url, body:body});
    }
    async getUserPhones<T>(urlParams?: any) {
        return this.makeRequest(axiosClient.get, { method: API_USER_MODEL.methods.phones.url, urlParams: urlParams });
    }
}

export default UserApiRequest;
