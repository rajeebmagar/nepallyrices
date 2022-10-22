import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { appsetting } from 'app-settings/app-setting';
import { PagedNotificationResponse } from 'app/shared/entities/PagedNotificationResponse';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class NotificationsService {

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<PagedNotificationResponse> {
    const getNotificationsAPI = `${environment.API_ENDPOINT}/users/me/socialnotifications?pageSize=5`;
    return this.http.get<PagedNotificationResponse>(getNotificationsAPI);
  }
  markAsRead(notificationId: number, objectType: string){
    const markNotificationAsReadAPI = `${environment.API_ENDPOINT}/notifications/${objectType}/${notificationId}/read`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'blob'
      })
    };
    return this.http.post(markNotificationAsReadAPI, null, options);
  }
}
