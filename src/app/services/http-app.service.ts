import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {catchError, firstValueFrom, from, Observable, switchMap, tap, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {SignalAppService} from "./signal-app.service";
import {LocaleAppService} from "./locale-app.service";

@Injectable({
  providedIn: "root"
})
export class HttpAppService {

  public readonly apiUrl = environment.apiUrl;
  private localeApp = inject(LocaleAppService);
  private signalApp = inject(SignalAppService);
  private http = inject(HttpClient);

  constructor() {
  }

  get<T>(request: RequestApp): Observable<T> {
    return this.executeHttpRequest<T>(request, "GET");
  }
  post<T>(request: RequestApp): Observable<T> {
    return this.executeHttpRequest<T>(request, "POST");
  }
  put<T>(request: RequestApp): Observable<T> {
    return this.executeHttpRequest<T>(request, "PUT");
  }
  patch<T>(request: RequestApp): Observable<T> {
    return this.executeHttpRequest<T>(request, "PATCH");
  }
  delete<T>(request: RequestApp): Observable<T> {
    return this.executeHttpRequest<T>(request, "DELETE");
  }

  async getAsync<T>(request: RequestApp): Promise<T> {
    return await firstValueFrom(this.get<T>(request));
  }
  async postAsync<T>(request: RequestApp): Promise<T> {
    return await firstValueFrom(this.post<T>(request));
  }
  async putAsync<T>(request: RequestApp): Promise<T> {
    return await firstValueFrom(this.put<T>(request));
  }
  async patchAsync<T>(request: RequestApp): Promise<T> {
    return await firstValueFrom(this.patch<T>(request));
  }
  async deleteAsync<T>(request: RequestApp): Promise<T> {
    return await firstValueFrom(this.delete<T>(request));
  }

  async uploadAsync<T>(fileBlob: File, path: string, additionalData?: Map<string, any>): Promise<T> {
    const formData = new FormData();
    formData.append("file", fileBlob, fileBlob.name);
    formData.append("fileName", fileBlob.name); // As required by the JAX-RS endpoint
    if (additionalData) {
      for (const key in additionalData) {
        if (Object.prototype.hasOwnProperty.call(additionalData, key)) {
          formData.append(key, additionalData.get(key));
        }
      }
    }
    const request = new RequestApp(path, formData);
    request.contentType = ContentType.NONE
    return await this.postAsync<T>(request);
  }
  async downloadAsync(request: RequestApp, filename: string, verb: "GET" | "POST" = "POST") {
    console.log("downloadAsync");
    request.setOptions({observe: "response", responseType: "blob"});
    let response: HttpResponse<Blob>;
    if (verb === "POST") {
      response = await this.postAsync(request);
    } else if (verb === "GET") {
      response = await this.getAsync(request);
    } else {
      return Promise.reject(new Error(`Unsupported verb for download: ${verb}`));
    }
    const blob = response.body;
    if (!blob || blob.size === 0) {
      throw new Error("Download failed, no data received");
    }
    let finalFilename = filename;
    const contentDisposition = response.headers.get("Content-Disposition");
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
      if (filenameMatch && filenameMatch.length > 1) {
        finalFilename = filenameMatch[1];
      }
    }
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = finalFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  private executeHttpRequest<T>(request: RequestApp, verb: string): Observable<T> {
    const httpUrlPath = `${this.apiUrl}${request.customPath || ""}`;
    request.addHeader("Accept-Language", this.localeApp.getLocale());
    const options = request.options();

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
        return throwError(() => new Error("HttpVerb not valid"));
    }
    this.signalApp.silentLoading.set(true);

    // Use the pipe operator for side effects (logging) and error handling
    return request$.pipe(
      tap((result) => {
        console.log(`HTTP Success: ${verb} ${request.customPath}`);
        this.signalApp.silentLoading.set(false);
        return result;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(`HTTP Error: ${verb} ${request.customPath}`, error);
        this.signalApp.silentLoading.set(false);
        if (error.status === 0) {
          return throwError(() => "Could not connect to the API. Please ensure the server is running and accessible.");
        }
        // Handle cases where the error response for a blob request is actually a JSON object.
        if (error.error instanceof Blob && error.error.type.includes("json")) {
          return from((error.error as Blob).text()).pipe(
            switchMap(errorText => {
              try {
                const parsedError = JSON.parse(errorText);
                // Create a new error that replaces the blob with the parsed JSON body.
                const newError = new HttpErrorResponse({
                  ...error,
                  error: parsedError,
                  url: error.url || undefined
                });
                return throwError(() => newError);
              } catch (e) {
                console.warn(e)
                // If parsing fails, fall back to the original error.
                return throwError(() => error);
              }
            })
          );
        }
        return throwError(() => error);
      }),
    );
  }
}

export class RequestApp {
  private httpHeaders: Map<string, string> = new Map();
  private httpParams: HttpParams = new HttpParams();
  private httpOptions: object = {};
  public contentType: ContentType = ContentType.JSON;
  public customPath: string = "";
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
    this.httpOptions = options;
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

  clearOptions(){
    this.httpOptions = {};
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

  options(): object {
    return {
      headers: this.headers,
      params: this.params(),
      ...this.httpOptions
    };
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
