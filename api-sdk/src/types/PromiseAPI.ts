import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, PromiseConfigurationOptions, wrapOptions } from '../configuration'
import { PromiseMiddleware, Middleware, PromiseMiddlewareWrapper } from '../middleware';

import { CreateIngredientInputBody } from '../models/CreateIngredientInputBody';
import { ErrorDetail } from '../models/ErrorDetail';
import { ErrorModel } from '../models/ErrorModel';
import { HealthOutputBody } from '../models/HealthOutputBody';
import { Ingredient } from '../models/Ingredient';
import { IngredientsOutputBody } from '../models/IngredientsOutputBody';
import { PutIngredientInputBody } from '../models/PutIngredientInputBody';
import { PutUserInputBody } from '../models/PutUserInputBody';
import { User } from '../models/User';
import { UsersOutputBody } from '../models/UsersOutputBody';
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
     * Create an ingredient
     * @param phone Phone number of the user
     * @param createIngredientInputBody
     */
    public createIngredientWithHttpInfo(phone: string, createIngredientInputBody: CreateIngredientInputBody, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Ingredient>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.createIngredientWithHttpInfo(phone, createIngredientInputBody, observableOptions);
        return result.toPromise();
    }

    /**
     * Create an ingredient
     * @param phone Phone number of the user
     * @param createIngredientInputBody
     */
    public createIngredient(phone: string, createIngredientInputBody: CreateIngredientInputBody, _options?: PromiseConfigurationOptions): Promise<Ingredient> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.createIngredient(phone, createIngredientInputBody, observableOptions);
        return result.toPromise();
    }

    /**
     * Delete an ingredient
     * @param phone Phone number of the user
     * @param id Identifier of the ingredient, chosen by the client
     */
    public deleteIngredientWithHttpInfo(phone: string, id: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<void>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteIngredientWithHttpInfo(phone, id, observableOptions);
        return result.toPromise();
    }

    /**
     * Delete an ingredient
     * @param phone Phone number of the user
     * @param id Identifier of the ingredient, chosen by the client
     */
    public deleteIngredient(phone: string, id: string, _options?: PromiseConfigurationOptions): Promise<void> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteIngredient(phone, id, observableOptions);
        return result.toPromise();
    }

    /**
     * Delete a user and their ingredients
     * @param phone Phone number of the user
     */
    public deleteUserWithHttpInfo(phone: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<void>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteUserWithHttpInfo(phone, observableOptions);
        return result.toPromise();
    }

    /**
     * Delete a user and their ingredients
     * @param phone Phone number of the user
     */
    public deleteUser(phone: string, _options?: PromiseConfigurationOptions): Promise<void> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.deleteUser(phone, observableOptions);
        return result.toPromise();
    }

    /**
     * Get an ingredient
     * @param phone Phone number of the user
     * @param id Identifier of the ingredient, chosen by the client
     */
    public getIngredientWithHttpInfo(phone: string, id: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Ingredient>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getIngredientWithHttpInfo(phone, id, observableOptions);
        return result.toPromise();
    }

    /**
     * Get an ingredient
     * @param phone Phone number of the user
     * @param id Identifier of the ingredient, chosen by the client
     */
    public getIngredient(phone: string, id: string, _options?: PromiseConfigurationOptions): Promise<Ingredient> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getIngredient(phone, id, observableOptions);
        return result.toPromise();
    }

    /**
     * Get a user
     * @param phone Phone number of the user
     */
    public getUserWithHttpInfo(phone: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<User>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getUserWithHttpInfo(phone, observableOptions);
        return result.toPromise();
    }

    /**
     * Get a user
     * @param phone Phone number of the user
     */
    public getUser(phone: string, _options?: PromiseConfigurationOptions): Promise<User> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.getUser(phone, observableOptions);
        return result.toPromise();
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

    /**
     * List all ingredients
     */
    public listIngredientsWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<IngredientsOutputBody>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listIngredientsWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * List all ingredients
     */
    public listIngredients(_options?: PromiseConfigurationOptions): Promise<IngredientsOutputBody> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listIngredients(observableOptions);
        return result.toPromise();
    }

    /**
     * List a user\'s ingredients
     * @param phone Phone number of the user
     */
    public listUserIngredientsWithHttpInfo(phone: string, _options?: PromiseConfigurationOptions): Promise<HttpInfo<IngredientsOutputBody>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listUserIngredientsWithHttpInfo(phone, observableOptions);
        return result.toPromise();
    }

    /**
     * List a user\'s ingredients
     * @param phone Phone number of the user
     */
    public listUserIngredients(phone: string, _options?: PromiseConfigurationOptions): Promise<IngredientsOutputBody> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listUserIngredients(phone, observableOptions);
        return result.toPromise();
    }

    /**
     * List users
     */
    public listUsersWithHttpInfo(_options?: PromiseConfigurationOptions): Promise<HttpInfo<UsersOutputBody>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listUsersWithHttpInfo(observableOptions);
        return result.toPromise();
    }

    /**
     * List users
     */
    public listUsers(_options?: PromiseConfigurationOptions): Promise<UsersOutputBody> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.listUsers(observableOptions);
        return result.toPromise();
    }

    /**
     * Create or update an ingredient
     * @param phone Phone number of the user
     * @param id Identifier of the ingredient, chosen by the client
     * @param putIngredientInputBody
     */
    public putIngredientWithHttpInfo(phone: string, id: string, putIngredientInputBody: PutIngredientInputBody, _options?: PromiseConfigurationOptions): Promise<HttpInfo<Ingredient>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putIngredientWithHttpInfo(phone, id, putIngredientInputBody, observableOptions);
        return result.toPromise();
    }

    /**
     * Create or update an ingredient
     * @param phone Phone number of the user
     * @param id Identifier of the ingredient, chosen by the client
     * @param putIngredientInputBody
     */
    public putIngredient(phone: string, id: string, putIngredientInputBody: PutIngredientInputBody, _options?: PromiseConfigurationOptions): Promise<Ingredient> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putIngredient(phone, id, putIngredientInputBody, observableOptions);
        return result.toPromise();
    }

    /**
     * Create or update a user
     * @param phone Phone number of the user
     * @param putUserInputBody
     */
    public putUserWithHttpInfo(phone: string, putUserInputBody: PutUserInputBody, _options?: PromiseConfigurationOptions): Promise<HttpInfo<User>> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putUserWithHttpInfo(phone, putUserInputBody, observableOptions);
        return result.toPromise();
    }

    /**
     * Create or update a user
     * @param phone Phone number of the user
     * @param putUserInputBody
     */
    public putUser(phone: string, putUserInputBody: PutUserInputBody, _options?: PromiseConfigurationOptions): Promise<User> {
        const observableOptions = wrapOptions(_options);
        const result = this.api.putUser(phone, putUserInputBody, observableOptions);
        return result.toPromise();
    }


}



