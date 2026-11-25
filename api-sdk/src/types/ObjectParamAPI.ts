import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration, ConfigurationOptions } from '../configuration'
import type { Middleware } from '../middleware';

import { CreateIngredientInputBody } from '../models/CreateIngredientInputBody';
import { ErrorDetail } from '../models/ErrorDetail';
import { ErrorModel } from '../models/ErrorModel';
import { Ingredient } from '../models/Ingredient';
import { IngredientsOutputBody } from '../models/IngredientsOutputBody';
import { PutIngredientInputBody } from '../models/PutIngredientInputBody';
import { PutUserInputBody } from '../models/PutUserInputBody';
import { User } from '../models/User';
import { UsersOutputBody } from '../models/UsersOutputBody';

import { ObservableIngredientsApi } from "./ObservableAPI";
import { IngredientsApiRequestFactory, IngredientsApiResponseProcessor} from "../apis/IngredientsApi";

export interface IngredientsApiCreateIngredientRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof IngredientsApicreateIngredient
     */
    phone: string
    /**
     * 
     * @type CreateIngredientInputBody
     * @memberof IngredientsApicreateIngredient
     */
    createIngredientInputBody: CreateIngredientInputBody
}

export interface IngredientsApiDeleteIngredientRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof IngredientsApideleteIngredient
     */
    phone: string
    /**
     * Identifier of the ingredient, chosen by the client
     * Defaults to: undefined
     * @type string
     * @memberof IngredientsApideleteIngredient
     */
    id: string
}

export interface IngredientsApiGetIngredientRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof IngredientsApigetIngredient
     */
    phone: string
    /**
     * Identifier of the ingredient, chosen by the client
     * Defaults to: undefined
     * @type string
     * @memberof IngredientsApigetIngredient
     */
    id: string
}

export interface IngredientsApiListIngredientsRequest {
}

export interface IngredientsApiListUserIngredientsRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof IngredientsApilistUserIngredients
     */
    phone: string
}

export interface IngredientsApiPutIngredientRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof IngredientsApiputIngredient
     */
    phone: string
    /**
     * Identifier of the ingredient, chosen by the client
     * Defaults to: undefined
     * @type string
     * @memberof IngredientsApiputIngredient
     */
    id: string
    /**
     * 
     * @type PutIngredientInputBody
     * @memberof IngredientsApiputIngredient
     */
    putIngredientInputBody: PutIngredientInputBody
}

export class ObjectIngredientsApi {
    private api: ObservableIngredientsApi

    public constructor(configuration: Configuration, requestFactory?: IngredientsApiRequestFactory, responseProcessor?: IngredientsApiResponseProcessor) {
        this.api = new ObservableIngredientsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Create an ingredient
     * @param param the request object
     */
    public createIngredientWithHttpInfo(param: IngredientsApiCreateIngredientRequest, options?: ConfigurationOptions): Promise<HttpInfo<Ingredient>> {
        return this.api.createIngredientWithHttpInfo(param.phone, param.createIngredientInputBody,  options).toPromise();
    }

    /**
     * Create an ingredient
     * @param param the request object
     */
    public createIngredient(param: IngredientsApiCreateIngredientRequest, options?: ConfigurationOptions): Promise<Ingredient> {
        return this.api.createIngredient(param.phone, param.createIngredientInputBody,  options).toPromise();
    }

    /**
     * Delete an ingredient
     * @param param the request object
     */
    public deleteIngredientWithHttpInfo(param: IngredientsApiDeleteIngredientRequest, options?: ConfigurationOptions): Promise<HttpInfo<void>> {
        return this.api.deleteIngredientWithHttpInfo(param.phone, param.id,  options).toPromise();
    }

    /**
     * Delete an ingredient
     * @param param the request object
     */
    public deleteIngredient(param: IngredientsApiDeleteIngredientRequest, options?: ConfigurationOptions): Promise<void> {
        return this.api.deleteIngredient(param.phone, param.id,  options).toPromise();
    }

    /**
     * Get an ingredient
     * @param param the request object
     */
    public getIngredientWithHttpInfo(param: IngredientsApiGetIngredientRequest, options?: ConfigurationOptions): Promise<HttpInfo<Ingredient>> {
        return this.api.getIngredientWithHttpInfo(param.phone, param.id,  options).toPromise();
    }

    /**
     * Get an ingredient
     * @param param the request object
     */
    public getIngredient(param: IngredientsApiGetIngredientRequest, options?: ConfigurationOptions): Promise<Ingredient> {
        return this.api.getIngredient(param.phone, param.id,  options).toPromise();
    }

    /**
     * List all ingredients
     * @param param the request object
     */
    public listIngredientsWithHttpInfo(param: IngredientsApiListIngredientsRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<IngredientsOutputBody>> {
        return this.api.listIngredientsWithHttpInfo( options).toPromise();
    }

    /**
     * List all ingredients
     * @param param the request object
     */
    public listIngredients(param: IngredientsApiListIngredientsRequest = {}, options?: ConfigurationOptions): Promise<IngredientsOutputBody> {
        return this.api.listIngredients( options).toPromise();
    }

    /**
     * List a user\'s ingredients
     * @param param the request object
     */
    public listUserIngredientsWithHttpInfo(param: IngredientsApiListUserIngredientsRequest, options?: ConfigurationOptions): Promise<HttpInfo<IngredientsOutputBody>> {
        return this.api.listUserIngredientsWithHttpInfo(param.phone,  options).toPromise();
    }

    /**
     * List a user\'s ingredients
     * @param param the request object
     */
    public listUserIngredients(param: IngredientsApiListUserIngredientsRequest, options?: ConfigurationOptions): Promise<IngredientsOutputBody> {
        return this.api.listUserIngredients(param.phone,  options).toPromise();
    }

    /**
     * Update an ingredient
     * @param param the request object
     */
    public putIngredientWithHttpInfo(param: IngredientsApiPutIngredientRequest, options?: ConfigurationOptions): Promise<HttpInfo<Ingredient>> {
        return this.api.putIngredientWithHttpInfo(param.phone, param.id, param.putIngredientInputBody,  options).toPromise();
    }

    /**
     * Update an ingredient
     * @param param the request object
     */
    public putIngredient(param: IngredientsApiPutIngredientRequest, options?: ConfigurationOptions): Promise<Ingredient> {
        return this.api.putIngredient(param.phone, param.id, param.putIngredientInputBody,  options).toPromise();
    }

}

import { ObservableUsersApi } from "./ObservableAPI";
import { UsersApiRequestFactory, UsersApiResponseProcessor} from "../apis/UsersApi";

export interface UsersApiDeleteUserRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof UsersApideleteUser
     */
    phone: string
}

export interface UsersApiGetUserRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof UsersApigetUser
     */
    phone: string
}

export interface UsersApiListUsersRequest {
}

export interface UsersApiPutUserRequest {
    /**
     * Phone number of the user
     * Defaults to: undefined
     * @type string
     * @memberof UsersApiputUser
     */
    phone: string
    /**
     * 
     * @type PutUserInputBody
     * @memberof UsersApiputUser
     */
    putUserInputBody: PutUserInputBody
}

export class ObjectUsersApi {
    private api: ObservableUsersApi

    public constructor(configuration: Configuration, requestFactory?: UsersApiRequestFactory, responseProcessor?: UsersApiResponseProcessor) {
        this.api = new ObservableUsersApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * Delete a user and their ingredients
     * @param param the request object
     */
    public deleteUserWithHttpInfo(param: UsersApiDeleteUserRequest, options?: ConfigurationOptions): Promise<HttpInfo<void>> {
        return this.api.deleteUserWithHttpInfo(param.phone,  options).toPromise();
    }

    /**
     * Delete a user and their ingredients
     * @param param the request object
     */
    public deleteUser(param: UsersApiDeleteUserRequest, options?: ConfigurationOptions): Promise<void> {
        return this.api.deleteUser(param.phone,  options).toPromise();
    }

    /**
     * Get a user
     * @param param the request object
     */
    public getUserWithHttpInfo(param: UsersApiGetUserRequest, options?: ConfigurationOptions): Promise<HttpInfo<User>> {
        return this.api.getUserWithHttpInfo(param.phone,  options).toPromise();
    }

    /**
     * Get a user
     * @param param the request object
     */
    public getUser(param: UsersApiGetUserRequest, options?: ConfigurationOptions): Promise<User> {
        return this.api.getUser(param.phone,  options).toPromise();
    }

    /**
     * List users
     * @param param the request object
     */
    public listUsersWithHttpInfo(param: UsersApiListUsersRequest = {}, options?: ConfigurationOptions): Promise<HttpInfo<UsersOutputBody>> {
        return this.api.listUsersWithHttpInfo( options).toPromise();
    }

    /**
     * List users
     * @param param the request object
     */
    public listUsers(param: UsersApiListUsersRequest = {}, options?: ConfigurationOptions): Promise<UsersOutputBody> {
        return this.api.listUsers( options).toPromise();
    }

    /**
     * Create or update a user
     * @param param the request object
     */
    public putUserWithHttpInfo(param: UsersApiPutUserRequest, options?: ConfigurationOptions): Promise<HttpInfo<User>> {
        return this.api.putUserWithHttpInfo(param.phone, param.putUserInputBody,  options).toPromise();
    }

    /**
     * Create or update a user
     * @param param the request object
     */
    public putUser(param: UsersApiPutUserRequest, options?: ConfigurationOptions): Promise<User> {
        return this.api.putUser(param.phone, param.putUserInputBody,  options).toPromise();
    }

}
