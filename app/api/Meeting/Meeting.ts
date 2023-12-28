import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_MEETING_MODEL } from "./const";

class MeetingApiRequest extends BaseModelAPI {
    constructor() {
        super(API_MEETING_MODEL.url, apiConfig.baseUrl);
    }

    async getMeetingsUser<T>(urlParams?: string) {
        return this.makeRequest<T>(axiosClient.get, {method: API_MEETING_MODEL.methods.getMeetingsUser.url, urlParams: urlParams});
    }
}

export default MeetingApiRequest;