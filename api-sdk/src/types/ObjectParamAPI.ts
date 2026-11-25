import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions } from '../configuration'
import type { Middleware } from '../middleware';

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

import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiCreateIngredientRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApicreateIngredient
     */
    phone: string
    /**
     * 
     * @type CreateIngredientInputBody
     * @memberof DefaultApicreateIngredient
     */
    createIngredientInputBody: CreateIngredientInputBody
}

export interface DefaultApiDeleteIngredientRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApideleteIngredient
     */
    phone: string
    /**
     * Identifier of the ingredient, chosen by the client
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApideleteIngredient
     */
    id: string
}

export interface DefaultApiDeleteUserRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApideleteUser
     */
    phone: string
}

export interface DefaultApiGetIngredientRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApigetIngredient
     */
    phone: string
    /**
     * Identifier of the ingredient, chosen by the client
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApigetIngredient
     */
    id: string
}

export interface DefaultApiGetUserRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApigetUser
     */
    phone: string
}

export interface DefaultApiHealthRequest {
}

export interface DefaultApiListIngredientsRequest {
}

export interface DefaultApiListUserIngredientsRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApilistUserIngredients
     */
    phone: string
}

export interface DefaultApiListUsersRequest {
}

export interface DefaultApiPutIngredientRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApiputIngredient
     */
    phone: string
    /**
     * Identifier of the ingredient, chosen by the client
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApiputIngredient
     */
    id: string
    /**
     * 
     * @type PutIngredientInputBody
     * @memberof DefaultApiputIngredient
     */
    putIngredientInputBody: PutIngredientInputBody
}

export interface DefaultApiPutUserRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof DefaultApiputUser
     */
    phone: string
    /**
     * 
     * @type PutUserInputBody
     * @memberof DefaultApiputUser
     */
    putUserInputBody: PutUserInputBody
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create an ingredient
     * @param param the request object
     */
    public createIngredientWithHttpInfo(param: DefaultApiCreateIngredientRequest, options?: ConfigurationOptions): Promise<HttpInfo<Ingredient>> {
        return this.api.createIngredientWithHttpInfo(param.phone, param.createIngredientInputBody,  options).toPromise();
    }

    /**
     * Create an ingredient
     * @param param the request object
     */
    public createIngredient(param: DefaultApiCreateIngredientRequest, options?: ConfigurationOptions): Promise<Ingredient> {
        return this.api.createIngredient(param.phone, param.createIngredientInputBody,  options).toPromise();
    }

    /**
     * Delete an ingredient
     * @param param the request object
     */
    public deleteIngredientWithHttpInfo(param: DefaultApiDeleteIngredientRequest, options?: ConfigurationOptions): Promise<HttpInfo<void>> {
        return this.api.deleteIngredientWithHttpInfo(param.phone, param.id,  options).toPromise();
    }

    /**
     * Delete an ingredient
     * @param param the request object
     */
    public deleteIngredient(param: DefaultApiDeleteIngredientRequest, options?: ConfigurationOptions): Promise<void> {
        return this.api.deleteIngredient(param.phone, param.id,  options).toPromise();
    }

    /**
     * Delete a user and their ingredients
     * @param param the request object
     */
    public deleteUserWithHttpInfo(param: DefaultApiDeleteUserRequest, options?: ConfigurationOptions): Promise<HttpInfo<void>> {
        return this.api.deleteUserWithHttpInfo(param.phone,  options).toPromise();
    }

    /**
     * Delete a user and their ingredients
     * @param param the request object
     */
    public deleteUser(param: DefaultApiDeleteUserRequest, options?: ConfigurationOptions): Promise<void> {
        return this.api.deleteUser(param.phone,  options).toPromise();
    }

    /**
     * Get an ingredient
     * @param param the request object
     */
    public getIngredientWithHttpInfo(param: DefaultApiGetIngredientRequest, options?: ConfigurationOptions): Promise<HttpInfo<Ingredient>> {
        return this.api.getIngredientWithHttpInfo(param.phone, param.id,  options).toPromise();
    }

    /**
     * Get an ingredient
     * @param param the request object
     */
    public getIngredient(param: DefaultApiGetIngredientRequest, options?: ConfigurationOptions): Promise<Ingredient> {
        return this.api.getIngredient(param.phone, param.id,  options).toPromise();
    }

    /**
     * Get a user
     * @param param the request object
     */
    public getUserWithHttpInfo(param: DefaultApiGetUserRequest, options?: ConfigurationOptions): Promise<HttpInfo<User>> {
        return this.api.getUserWithHttpInfo(param.phone,  options).toPromise();
    }

    /**
     * Get a user
     * @param param the request object
     */
    public getUser(param: DefaultApiGetUserRequest, options?: ConfigurationOptions): Promise<User> {
        return this.api.getUser(param.phone,  options).toPromise();
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

    /**
     * List all ingredients
     * @param param the request object
     */
    public listIngredientsWithHttpInfo(param: DefaultApiListIngredientsRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<IngredientsOutputBody>> {
        return this.api.listIngredientsWithHttpInfo( options).toPromise();
    }

    /**
     * List all ingredients
     * @param param the request object
     */
    public listIngredients(param: DefaultApiListIngredientsRequest = {}, options?: ConfigurationOptions): Promise<IngredientsOutputBody> {
        return this.api.listIngredients( options).toPromise();
    }

    /**
     * List a user\'s ingredients
     * @param param the request object
     */
    public listUserIngredientsWithHttpInfo(param: DefaultApiListUserIngredientsRequest, options?: ConfigurationOptions): Promise<HttpInfo<IngredientsOutputBody>> {
        return this.api.listUserIngredientsWithHttpInfo(param.phone,  options).toPromise();
    }

    /**
     * List a user\'s ingredients
     * @param param the request object
     */
    public listUserIngredients(param: DefaultApiListUserIngredientsRequest, options?: ConfigurationOptions): Promise<IngredientsOutputBody> {
        return this.api.listUserIngredients(param.phone,  options).toPromise();
    }

    /**
     * List users
     * @param param the request object
     */
    public listUsersWithHttpInfo(param: DefaultApiListUsersRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<UsersOutputBody>> {
        return this.api.listUsersWithHttpInfo( options).toPromise();
    }

    /**
     * List users
     * @param param the request object
     */
    public listUsers(param: DefaultApiListUsersRequest = {}, options?: ConfigurationOptions): Promise<UsersOutputBody> {
        return this.api.listUsers( options).toPromise();
    }

    /**
     * Create or update an ingredient
     * @param param the request object
     */
    public putIngredientWithHttpInfo(param: DefaultApiPutIngredientRequest, options?: ConfigurationOptions): Promise<HttpInfo<Ingredient>> {
        return this.api.putIngredientWithHttpInfo(param.phone, param.id, param.putIngredientInputBody,  options).toPromise();
    }

    /**
     * Create or update an ingredient
     * @param param the request object
     */
    public putIngredient(param: DefaultApiPutIngredientRequest, options?: ConfigurationOptions): Promise<Ingredient> {
        return this.api.putIngredient(param.phone, param.id, param.putIngredientInputBody,  options).toPromise();
    }

    /**
     * Create or update a user
     * @param param the request object
     */
    public putUserWithHttpInfo(param: DefaultApiPutUserRequest, options?: ConfigurationOptions): Promise<HttpInfo<User>> {
        return this.api.putUserWithHttpInfo(param.phone, param.putUserInputBody,  options).toPromise();
    }

    /**
     * Create or update a user
     * @param param the request object
     */
    public putUser(param: DefaultApiPutUserRequest, options?: ConfigurationOptions): Promise<User> {
        return this.api.putUser(param.phone, param.putUserInputBody,  options).toPromise();
    }

}
