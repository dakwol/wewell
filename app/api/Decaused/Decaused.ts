import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_DECEASED_MODEL } from "./const";

class DecausedApiRequest extends BaseModelAPI {
    constructor() {
        super(API_DECEASED_MODEL.url, apiConfig.baseUrl);
    }
}

export default DecausedApiRequest;