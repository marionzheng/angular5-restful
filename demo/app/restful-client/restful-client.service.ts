import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {RestfulClient, GET, Query, BaseUrl, DefaultQueries, DefaultHeaders} from "../../../src/http";

@Injectable()
@BaseUrl('https://www.yowootech.com/oltest/test/imgood')
@DefaultHeaders({
    'Auth': () => { return 'testAuth' }
})
@DefaultQueries({
    't': () => { return new Date().getTime() }
})
export class RestfulClientService extends RestfulClient {
    @GET('/')
    public get(@Query('role') role): Observable<any> {
        return null;
    }
}
