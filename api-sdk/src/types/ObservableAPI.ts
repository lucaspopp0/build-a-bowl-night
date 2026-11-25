import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions, mergeConfiguration } from '../configuration'
import type { Middleware } from '../middleware';
import { Observable, of, from } from '../rxjsStub';
import {mergeMap, map} from  '../rxjsStub';
import { CreateIngredientInputBody } from '../models/CreateIngredientInputBody';
import { DietaryAttributes } from '../models/DietaryAttributes';
import { ErrorDetail } from '../models/ErrorDetail';
import { ErrorModel } from '../models/ErrorModel';
import { Ingredient } from '../models/Ingredient';
import { IngredientsOutputBody } from '../models/IngredientsOutputBody';
import { PutIngredientInputBody } from '../models/PutIngredientInputBody';
import { PutUserInputBody } from '../models/PutUserInputBody';
import { User } from '../models/User';
import { UsersOutputBody } from '../models/UsersOutputBody';

import { IngredientsApiRequestFactory, IngredientsApiResponseProcessor} from "../apis/IngredientsApi";
export class ObservableIngredientsApi {
    private requestFactory: IngredientsApiRequestFactory;
    private responseProcessor: IngredientsApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: IngredientsApiRequestFactory,
        responseProcessor?: IngredientsApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new IngredientsApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new IngredientsApiResponseProcessor();
    }

    /**
     * Create an ingredient
     * @param phone Phone number of the user
     * @param createIngredientInputBody
     */
    public createIngredientWithHttpInfo(phone: string, createIngredientInputBody: CreateIngredientInputBody, _options?: ConfigurationOptions): Observable<HttpInfo<Ingredient>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.createIngredient(phone, createIngredientInputBody, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.createIngredientWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create an ingredient
     * @param phone Phone number of the user
     * @param createIngredientInputBody
     */
    public createIngredient(phone: string, createIngredientInputBody: CreateIngredientInputBody, _options?: ConfigurationOptions): Observable<Ingredient> {
        return this.createIngredientWithHttpInfo(phone, createIngredientInputBody, _options).pipe(map((apiResponse: HttpInfo<Ingredient>) => apiResponse.data));
    }

    /**
     * Delete an ingredient
     * @param phone Phone number of the user
     * @param id Identifier of the ingredient, chosen by the client
     */
    public deleteIngredientWithHttpInfo(phone: string, id: string, _options?: ConfigurationOptions): Observable<HttpInfo<void>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.deleteIngredient(phone, id, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteIngredientWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete an ingredient
     * @param phone Phone number of the user
     * @param id Identifier of the ingredient, chosen by the client
     */
    public deleteIngredient(phone: string, id: string, _options?: ConfigurationOptions): Observable<void> {
        return this.deleteIngredientWithHttpInfo(phone, id, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Get an ingredient
     * @param phone Phone number of the user
     * @param id Identifier of the ingredient, chosen by the client
     */
    public getIngredientWithHttpInfo(phone: string, id: string, _options?: ConfigurationOptions): Observable<HttpInfo<Ingredient>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getIngredient(phone, id, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getIngredientWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get an ingredient
     * @param phone Phone number of the user
     * @param id Identifier of the ingredient, chosen by the client
     */
    public getIngredient(phone: string, id: string, _options?: ConfigurationOptions): Observable<Ingredient> {
        return this.getIngredientWithHttpInfo(phone, id, _options).pipe(map((apiResponse: HttpInfo<Ingredient>) => apiResponse.data));
    }

    /**
     * List all ingredients
     */
    public listIngredientsWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<IngredientsOutputBody>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.listIngredients(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listIngredientsWithHttpInfo(rsp)));
            }));
    }

    /**
     * List all ingredients
     */
    public listIngredients(_options?: ConfigurationOptions): Observable<IngredientsOutputBody> {
        return this.listIngredientsWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<IngredientsOutputBody>) => apiResponse.data));
    }

    /**
     * List a user\'s ingredients
     * @param phone Phone number of the user
     */
    public listUserIngredientsWithHttpInfo(phone: string, _options?: ConfigurationOptions): Observable<HttpInfo<IngredientsOutputBody>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.listUserIngredients(phone, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listUserIngredientsWithHttpInfo(rsp)));
            }));
    }

    /**
     * List a user\'s ingredients
     * @param phone Phone number of the user
     */
    public listUserIngredients(phone: string, _options?: ConfigurationOptions): Observable<IngredientsOutputBody> {
        return this.listUserIngredientsWithHttpInfo(phone, _options).pipe(map((apiResponse: HttpInfo<IngredientsOutputBody>) => apiResponse.data));
    }

    /**
     * Update an ingredient
     * @param phone Phone number of the user
     * @param id Identifier of the ingredient, chosen by the client
     * @param putIngredientInputBody
     */
    public putIngredientWithHttpInfo(phone: string, id: string, putIngredientInputBody: PutIngredientInputBody, _options?: ConfigurationOptions): Observable<HttpInfo<Ingredient>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.putIngredient(phone, id, putIngredientInputBody, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.putIngredientWithHttpInfo(rsp)));
            }));
    }

    /**
     * Update an ingredient
     * @param phone Phone number of the user
     * @param id Identifier of the ingredient, chosen by the client
     * @param putIngredientInputBody
     */
    public putIngredient(phone: string, id: string, putIngredientInputBody: PutIngredientInputBody, _options?: ConfigurationOptions): Observable<Ingredient> {
        return this.putIngredientWithHttpInfo(phone, id, putIngredientInputBody, _options).pipe(map((apiResponse: HttpInfo<Ingredient>) => apiResponse.data));
    }

}

import { UsersApiRequestFactory, UsersApiResponseProcessor} from "../apis/UsersApi";
export class ObservableUsersApi {
    private requestFactory: UsersApiRequestFactory;
    private responseProcessor: UsersApiResponseProcessor;
    private configuration: Configuration;

    public constructor(
        configuration: Configuration,
        requestFactory?: UsersApiRequestFactory,
        responseProcessor?: UsersApiResponseProcessor
    ) {
        this.configuration = configuration;
        this.requestFactory = requestFactory || new UsersApiRequestFactory(configuration);
        this.responseProcessor = responseProcessor || new UsersApiResponseProcessor();
    }

    /**
     * Delete a user and their ingredients
     * @param phone Phone number of the user
     */
    public deleteUserWithHttpInfo(phone: string, _options?: ConfigurationOptions): Observable<HttpInfo<void>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.deleteUser(phone, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.deleteUserWithHttpInfo(rsp)));
            }));
    }

    /**
     * Delete a user and their ingredients
     * @param phone Phone number of the user
     */
    public deleteUser(phone: string, _options?: ConfigurationOptions): Observable<void> {
        return this.deleteUserWithHttpInfo(phone, _options).pipe(map((apiResponse: HttpInfo<void>) => apiResponse.data));
    }

    /**
     * Get a user
     * @param phone Phone number of the user
     */
    public getUserWithHttpInfo(phone: string, _options?: ConfigurationOptions): Observable<HttpInfo<User>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.getUser(phone, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.getUserWithHttpInfo(rsp)));
            }));
    }

    /**
     * Get a user
     * @param phone Phone number of the user
     */
    public getUser(phone: string, _options?: ConfigurationOptions): Observable<User> {
        return this.getUserWithHttpInfo(phone, _options).pipe(map((apiResponse: HttpInfo<User>) => apiResponse.data));
    }

    /**
     * List users
     */
    public listUsersWithHttpInfo(_options?: ConfigurationOptions): Observable<HttpInfo<UsersOutputBody>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.listUsers(_config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.listUsersWithHttpInfo(rsp)));
            }));
    }

    /**
     * List users
     */
    public listUsers(_options?: ConfigurationOptions): Observable<UsersOutputBody> {
        return this.listUsersWithHttpInfo(_options).pipe(map((apiResponse: HttpInfo<UsersOutputBody>) => apiResponse.data));
    }

    /**
     * Create or update a user
     * @param phone Phone number of the user
     * @param putUserInputBody
     */
    public putUserWithHttpInfo(phone: string, putUserInputBody: PutUserInputBody, _options?: ConfigurationOptions): Observable<HttpInfo<User>> {
        const _config = mergeConfiguration(this.configuration, _options);

        const requestContextPromise = this.requestFactory.putUser(phone, putUserInputBody, _config);
        // build promise chain
        let middlewarePreObservable = from<RequestContext>(requestContextPromise);
        for (const middleware of _config.middleware) {
            middlewarePreObservable = middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => middleware.pre(ctx)));
        }

        return middlewarePreObservable.pipe(mergeMap((ctx: RequestContext) => _config.httpApi.send(ctx))).
            pipe(mergeMap((response: ResponseContext) => {
                let middlewarePostObservable = of(response);
                for (const middleware of _config.middleware.reverse()) {
                    middlewarePostObservable = middlewarePostObservable.pipe(mergeMap((rsp: ResponseContext) => middleware.post(rsp)));
                }
                return middlewarePostObservable.pipe(map((rsp: ResponseContext) => this.responseProcessor.putUserWithHttpInfo(rsp)));
            }));
    }

    /**
     * Create or update a user
     * @param phone Phone number of the user
     * @param putUserInputBody
     */
    public putUser(phone: string, putUserInputBody: PutUserInputBody, _options?: ConfigurationOptions): Observable<User> {
        return this.putUserWithHttpInfo(phone, putUserInputBody, _options).pipe(map((apiResponse: HttpInfo<User>) => apiResponse.data));
    }

}
