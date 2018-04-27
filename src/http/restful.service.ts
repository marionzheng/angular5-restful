import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class RestfulClient {
  public withCredentials = false;

  public constructor(protected client: HttpClient) {
  }

  public getBaseUrl(): string {
    return undefined;
  }

  public getDefaultHeaders(): Object {
    return null;
  }

  public getDefaultQueries(): Object {
    return null;
  }
}

// ---- Class decorators ----

export function BaseUrl(url: string | (() => string)) {
  return function <TFunction extends Function>(target: TFunction): TFunction {
    if (typeof url === 'string') {
      target.prototype.getBaseUrl = () => {
        return url;
      };
    } else {
      target.prototype.getBaseUrl = url;
    }
    return target;
  };
}

export function DefaultHeaders(headers: any) {
  return <TFunction extends Function>(target: TFunction): TFunction => {
    target.prototype.getDefaultHeaders = function () {
      return headers;
    };
    return target;
  };
}

export function DefaultQueries(queries: any) {
  return <TFunction extends Function>(target: TFunction): TFunction => {
    target.prototype.getDefaultQueries = function () {
      return queries;
    };
    return target;
  };
}

// ---- Parameter decorators ----

export let Path = attachParam('Path');

export let Query = attachParam('Query');

export let Form = attachParam('Form');

export let Body = attachParam('Body');

export let Header = attachParam('Header');

function attachParam(paramName: string) {
  return (key: string) => {
    return (target: RestfulClient, propertyKey: string | symbol, parameterIndex: number) => {
      const metadataKey = `${propertyKey}_parameters`;
      const paramObj: any = {
        key: key,
        parameterIndex: parameterIndex
      };
      if (typeof target[metadataKey] === 'undefined') {
        target[metadataKey] = {};
      }
      if (Array.isArray(target[metadataKey][paramName])) {
        target[metadataKey][paramName].push(paramObj); // add to parms arr
      } else {
        target[metadataKey][paramName] = [paramObj];   // new parms arr
      }
    };
  };
}

// ---- Method decorators ----

export let GET = handleMethod('GET');

export let POST = handleMethod('POST');

export let OPTIONS = handleMethod('OPTIONS');

export let PUT = handleMethod('PUT');

export let DELETE = handleMethod('DELETE');

export let HEAD = handleMethod('HEAD');

export let PATCH = handleMethod('PATCH');

function handleMethod(method: string) {
  return (url: string) => {
    return (target: RestfulClient, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
      const methodParams = target[`${propertyKey}_parameters`];

      descriptor.value = function (...args: any[]) {
        let uri: string = url;
        if (typeof uri === 'undefined' || null == uri || uri.trim().length === 0) {
          uri = '';
        } else {
          uri = uri.trim().replace(/^[\\|\/]/ig, '').trim();
        }
        if (!/^http(s)*:\/\//ig.test(uri)) {
          let baseUri = this.getBaseUrl();
          if (typeof baseUri !== 'undefined' && null != baseUri && baseUri.trim().length > 0) {
            if (uri === '') {
              uri = baseUri.trim();
            } else {
              baseUri = baseUri.trim().replace(/[\\|\/]$/ig, '').trim();
              uri = baseUri + '/' + uri;
            }
          }
        }

        let params: { [key: string]: string | string[] } = null;
        let headers: { [key: string]: string | string[] } = null;
        let body;

        if (typeof methodParams !== 'undefined') {
          if (methodParams.hasOwnProperty('Path')) {
            for (const p of methodParams['Path']) {
              uri = uri.replace('{' + p.key + '}', args[p.parameterIndex]);
            }
          }

          const defQueries = this.getDefaultQueries();
          if (typeof defQueries !== 'undefined' && null != defQueries && typeof defQueries === 'object') {
            for (const property in defQueries) {
              if (defQueries.hasOwnProperty(property)) {
                params = appendToObject(params, property, defQueries[property]);
              }
            }
          }

          if (methodParams.hasOwnProperty('Query')) {
            for (const p of methodParams['Query']) {
              if (typeof args[p.parameterIndex] === 'undefined') {
                continue;
              }

              const key = p.key;
              const value = args[p.parameterIndex];
              params = appendToObject(params, key, value);
            }
          }

          if (methodParams.hasOwnProperty('Form')) {
            const form = new FormData();
            for (const p of methodParams['Form']) {
              if (typeof args[p.parameterIndex] === 'undefined') {
                continue;
              }

              const key = p.key;
              const value = args[p.parameterIndex];
              if (Array.isArray(value)) {
                for (const item of value) {
                  form.append(key, item);
                }
              } else if (typeof value === 'object') {
                for (const property in value) {
                  if (value.hasOwnProperty(property)) {
                    form.append(property, value[property]);
                  }
                }
              } else {
                form.append(key, value);
              }
            }
            body = form;
          }

          const defHeaders = this.getDefaultHeaders();
          if (typeof defHeaders !== 'undefined' && null != defHeaders && typeof defHeaders === 'object') {
            for (const property in defHeaders) {
              if (defHeaders.hasOwnProperty(property)) {
                headers = appendToObject(headers, property, defHeaders[property]);
              }
            }
          }

          if (methodParams.hasOwnProperty('Header')) {
            for (const p of methodParams['Header']) {
              const key = p.key;
              const value = args[p.parameterIndex];
              headers = appendToObject(headers, key, value);
            }
          }

          if (methodParams.hasOwnProperty('Body')) {
            body = args[methodParams['Body'][0].parameterIndex];
          }
        }

        if (typeof params !== 'undefined' && null != params) {
          const queryString = getQueryString(params);
          if (typeof queryString !== 'undefined' && null != queryString && queryString.trim().length > 0) {
            uri = uri + (uri && uri.indexOf('?') >= 0 ? '&' : '?') + queryString;
          }
        }

        const httpHeaders = new HttpHeaders(headers);
        const httpRequest = new HttpRequest(method, uri, body, {
          headers: httpHeaders, withCredentials: this.withCredentials
        });
        const observable: Observable<HttpEvent<any>> = this.client.request(httpRequest);
        return observable
          .do(next => {},
            error => {
              console.log(error);
            });
      };
    };
  };
}

function appendToObject(obj: any, key: string, value: any): { [p: string]: string | string[] } {
  if (typeof key === 'undefined' || null == key || key.trim().length === 0 || typeof value === 'undefined') {
    return;
  }
  key = key.trim();

  if (typeof obj === 'undefined' || null == obj) {
    obj = {};
  }

  let v: any;
  if (Array.isArray(value)) {
    v = value.map(i => i.toString().trim());
  } else if (typeof value === 'object') {
    for (const property in value) {
      if (value.hasOwnProperty(property)) {
        obj = appendToObject(obj, property, value[property]);
      }
    }
  } else if (typeof value === 'function') {
    v = value().toString().trim();
  } else {
    v = value;
  }

  if (typeof v === 'undefined') {
    return;
  }

  if (obj.hasOwnProperty(key)) {
    if (!Array.isArray(obj[key])) {
      obj[key] = [obj[key]];
    }
    if (Array.isArray(v)) {
      for (const i of v) {
        obj[key].push(i);
      }
    } else {
      obj[key].push(v);
    }
  } else {
    obj[key] = v;
  }

  return obj;
}

function getQueryString(params: string | URLSearchParams | { [key: string]: any | any[] }): string {
  if (typeof params === 'undefined') {
    return '';
  }
  if (typeof(params) === 'string') {
    return params.trim();
  } else if (params instanceof URLSearchParams) {
    return params.toString();
  } else {
    let str = '';
    for (const k in params) {
      if (!params.hasOwnProperty(k)) {
        continue;
      }
      const v = params[k];
      if (typeof v === 'undefined' || null == v) {
        str = `${str}&${k}=`;
      } else if (Array.isArray(v)) {
        for (const sv of v) {
          str = `${str}&${k}=${encodeURIComponent(sv.toString())}`;
        }
      } else {
        str = `${str}&${k}=${encodeURIComponent(v.toString())}`;
      }
    }
    if (str.length > 0) {
      str = str.substr(1);
    }
    return str;
  }
}
