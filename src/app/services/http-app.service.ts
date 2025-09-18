import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {catchError, firstValueFrom, Observable, tap, throwError} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpAppService {

  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  get<T>(requestData: Request): Observable<T> {
    return this.executeHttpRequest<T>(requestData, "GET");
  }

  post<T>(requestData: Request): Observable<T> {
    return this.executeHttpRequest<T>(requestData, "POST");
  }

  put<T>(requestData: Request): Observable<T> {
    return this.executeHttpRequest<T>(requestData, "PUT");
  }

  patch<T>(requestData: Request): Observable<T> {
    return this.executeHttpRequest<T>(requestData, "PATCH");
  }

  delete<T>(requestData: Request): Observable<T> {
    return this.executeHttpRequest<T>(requestData, "DELETE");
  }

  async getAsync<T>(requestData: Request): Promise<T> {
    return await firstValueFrom(this.get<T>(requestData));
  }

  async postAsync<T>(requestData: Request): Promise<T> {
    return await firstValueFrom(this.post<T>(requestData));
  }

  async putAsync<T>(requestData: Request): Promise<T> {
    return await firstValueFrom(this.put<T>(requestData));
  }

  async patchAsync<T>(requestData: Request): Promise<T> {
    return await firstValueFrom(this.patch<T>(requestData));
  }

  async deleteAsync<T>(requestData: Request): Promise<T> {
    return await firstValueFrom(this.delete<T>(requestData));
  }

  async uploadAsync(formData: FormData, fileBlob: File, path: string) {

    formData.append('file', fileBlob, fileBlob.name);
    const request = new Request(path, formData);
    request.contentType = ContentType.NONE

    return await this.postAsync(request);

  }

  async downloadAsync(requestData: Request, filename: string, verb = "POST") {

    requestData.setOptions({observe: 'response', responseType: 'blob'});

    let response: HttpResponse<Blob>;
    if (verb === "POST") {
      response = await this.postAsync(requestData);
    }else {
      response = await this.getAsync(requestData);
    }
    const blob = response.body;
    if (!blob || blob.size === 0) {
      throw new Error('Download failed, no data received');
    }

    const contentDisposition = response.headers.get('content-disposition');
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
      if (filenameMatch && filenameMatch.length > 1) {
        filename = filenameMatch[1];
      }
    }

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  private executeHttpRequest<T>(request: Request, verb: string): Observable<T> {
    const httpUrlPath = `${this.apiUrl}${request.customPath || ''}`;
    const options = {
      headers: request.headers(),
      params: request.params(),
      ...request.options
    };

    let request$: Observable<any>;

    switch (verb) {
      case "GET":
        request$ = this.http.get(httpUrlPath, options);
        break;
      case "POST":
        request$ = this.http.post(httpUrlPath, request.payload, options);
        break;
      case "PUT":
        request$ = this.http.put(httpUrlPath, request.payload, options);
        break;
      case "PATCH":
        request$ = this.http.patch(httpUrlPath, request.payload, options);
        break;
      case "DELETE":
        request$ = this.http.delete(httpUrlPath, options);
        break;
      default:
        // Return an observable that immediately errors out for invalid verbs
        return throwError(() => new Error('HttpVerb not valid'));
    }

    // Use the pipe operator for side effects (logging) and error handling
    return request$.pipe(
      tap(() => {
        console.log(`HTTP Success: ${verb} ${request.customPath}`);
      }),
      catchError(error => {
        console.error(`HTTP Error: ${verb} ${request.customPath}`, error);
        return throwError(() => error);
      })
    );
  }
}

export class Request {
  private httpHeaders: Map<string, string> = new Map();
  private httpParams: HttpParams = new HttpParams();
  public contentType: ContentType = ContentType.JSON;
  public customPath: string = "";
  public options: object = {};
  public payload: any;

  constructor(customPath: string, payload: any = undefined) {
    if (customPath === "") {
      throw new Error("Custom path is required");
    }
    if (!customPath.startsWith("/")) {
      throw new Error("Custom path must start with /");
    }
    if (customPath.endsWith("/")) {
      throw new Error("Custom path must not end with /");
    }

    this.customPath = customPath;
    if (payload) {
      this.payload = payload;
    }
  }

  setOptions(options: object) {
    this.options = options;
  }

  addParams(key: string, value: any) {
    this.httpParams = this.httpParams.append(key, value);
  }

  addHeader(key: string, value: string) {
    this.httpHeaders.set(key, value);
  }

  clearParms() {
    this.httpParams = new HttpParams();
  }

  clearHeaders() {
    this.httpHeaders = new Map();
  }

  headers(): HttpHeaders {
    let headers = new HttpHeaders();

    if (this.contentType !== ContentType.NONE) {
      headers = headers.append("Content-Type", this.contentType);
    }

    if (this.httpHeaders) {
      this.httpHeaders.forEach((value, key) => {
        headers = headers.append(key, value);
      });
    }

    return headers;
  }

  params() {
    return this.httpParams;
  }
}

export enum ContentType {
  FORM = "application/x-www-form-urlencoded",
  MULTIPART = "multipart/form-data",
  BLOB = "application/octet-stream",
  JSON = "application/json",
  TEXT = "text/plain",
  NONE = ""
}
