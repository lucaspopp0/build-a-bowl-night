import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, PromiseConfigurationOptions, wrapOptions } from '../configuration'
import { PromiseMiddleware, Middleware, PromiseMiddlewareWrapper } from '../middleware';

import { ErrorDetail } from '../models/ErrorDetail';
import { ErrorModel } from '../models/ErrorModel';
import { HealthOutputBody } from '../models/HealthOutputBody';
import { ObservableDefaultApi } from './ObservableAPI';

import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";
export class PromiseDefaultApi {
    private api: ObservableDefaultApi

    public constructor(
        configuration: Configuration,
        requestFactory?: DefaultApiRequestFactory,
        responseProcessor?: DefaultApiResponseProcessor
    ) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Health check
     */
    public healthWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<HealthOutputBody>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.healthWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * Health check
     */
    public health(_options?: PromiseConfigurationOptions): Promise<HealthOutputBody> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.health(observableOptions);
        return result.toPromise();
    }


}



