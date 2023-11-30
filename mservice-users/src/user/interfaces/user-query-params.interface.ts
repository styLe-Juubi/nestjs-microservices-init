export interface IUserQueryParams {
    page?: number;
    limit?: number;
    sort?: object;
    email?: RegExp;
    phone?: number;
    username: RegExp;
    name: RegExp;
    surname: RegExp;
    roles?: { '$all': RegExp[] } | { '$in': RegExp[] };
    online: boolean;
}