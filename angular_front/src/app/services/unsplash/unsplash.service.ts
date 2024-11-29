import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Picture {
    url: string;
    author: string;
    authorProfileUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {

    constructor(private http: HttpClient) { }

    private accessKey = environment.unsplashApiKey;
    private baseUrl = 'https://api.unsplash.com';

    getRandomPhotos(count: number = 30): Observable<Picture[]> {
        const params = new HttpParams()
            .set('client_id', this.accessKey)
            .set('count', count.toString());

        return this.http.get<any[]>(`${this.baseUrl}/photos/random`, { params }).pipe(
            map((response) =>
                response.map(photo => ({
                    url: photo.urls.regular,
                    author: photo.user.name,
                    authorProfileUrl: photo.user.links.html,
                }))
            )
        );
    }
}
