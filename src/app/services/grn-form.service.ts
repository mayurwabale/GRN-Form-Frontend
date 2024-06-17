import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GrnFormService {

  constructor(private httpClient: HttpClient) { }

  saveGRNForm(url:string,obj:object){
    return this.httpClient.post(url,obj);
  }
}
