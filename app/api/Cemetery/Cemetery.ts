import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_CEMETERY_MODEL } from "./const";

class CemeteryApiRequest extends BaseModelAPI {
    constructor() {
        super(API_CEMETERY_MODEL.url, apiConfig.baseUrl);
    }
    async getCemetery<T>(urlParams?: string) {
        return this.makeRequest<T>(axiosClient.get, {method: API_CEMETERY_MODEL.methods.getCemetery.url, urlParams: urlParams});
    }
    async getCemeteryPlots<T>(urlParams?: string) {
        return this.makeRequest<T>(axiosClient.get, {method: API_CEMETERY_MODEL.methods.getCemeteryPlots.url, urlParams: urlParams});
    }

}

export default CemeteryApiRequest;