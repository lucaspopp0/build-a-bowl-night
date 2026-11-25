import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions } from '../configuration'
import type { Middleware } from '../middleware';

import { ErrorDetail } from '../models/ErrorDetail';
import { ErrorModel } from '../models/ErrorModel';
import { HealthOutputBody } from '../models/HealthOutputBody';

import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiHealthRequest {
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Health check
     * @param param the request object
     */
    public healthWithHttpInfo(param: DefaultApiHealthRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<HealthOutputBody>> {
        return this.api.healthWithHttpInfo( options).toPromise();
    }

    /**
     * Health check
     * @param param the request object
     */
    public health(param: DefaultApiHealthRequest = {}, options?: ConfigurationOptions): Promise<HealthOutputBody> {
        return this.api.health( options).toPromise();
    }

}
