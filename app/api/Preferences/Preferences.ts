import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_PREFERENCES_MODEL } from "./const";

class PreferencesApiRequest extends BaseModelAPI {
    constructor() {
        super(API_PREFERENCES_MODEL.url, apiConfig.baseUrl);
    }
}

export default PreferencesApiRequest;