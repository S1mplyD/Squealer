import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'app/interfaces/account.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private apiUrl = 'http://localhost:3000/api/users'; // Replace with your authentication API URL

  private followApiUrl = 'http://localhost:3000/api/follow';


  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  deleteUser(mail: string, password: string): Observable<any> {
    const params = {
      'mail': mail + '',
      'password': password + ''
    };
    return this.http.delete<any>(this.apiUrl, {params: params});
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/${username}`);
  }

  updateUserByUsername(username: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/user/${username}`, user);
  }

  updateUserPictureByUsername(username: string, filename: string): Observable<any> {
    const params = {
      'filename': filename + ''
    };
    return this.http.put<any>(`${this.apiUrl}/${username}/profilePicture`, {params: params});
  }

  deleteUserPictureByUsername(username: string, filename: string): Observable<any> {
    const params = {
      'filename': filename + ''
    };
    return this.http.delete<any>(`${this.apiUrl}/${username}/profilePicture`, {params: params});
  }

  grantPermission(id: string): Observable<any> {
    const params = {
      'id': id + ''
    }
    return this.http.put<any>(`${this.apiUrl}/grantPermissions`, {params: params});
  }

  revokePermission(id: string): Observable<any> {
    const params = {
      'id': id + ''
    }
    return this.http.put<any>(`${this.apiUrl}/revokePermissions`, {params: params});
  }

  ban(id: string): Observable<any> {
    const params = {
      'id': id + ''
    }
    return this.http.put<any>(`${this.apiUrl}/ban`, {params: params});
  }

  unban(id: string): Observable<any> {
    const params = {
      'id': id + ''
    }
    return this.http.put<any>(`${this.apiUrl}/unban`, {params: params});
  }

  block(id: string, time: number): Observable<any> {
    const params = {
      'id': id + '',
      'time': time + ''
    }
    return this.http.put<any>(`${this.apiUrl}/block`, {params: params});
  }

  unblock(id: string): Observable<any> {
    const params = {
      'id': id + ''
    }
    return this.http.put<any>(`${this.apiUrl}/unblock`, {params: params});
  }

  follow(username: string): Observable<any> {
    const params = {
      'username': username + ''
    }
    return this.http.post<any>(`${this.followApiUrl}/follow/${username}`, {params: params});
  }

  unfollow(username: string): Observable<any> {
    const params = {
      'username': username + ''
    }
    return this.http.post<any>(`${this.followApiUrl}/unfollow/${username}`, {params: params});
  }

  followers(username: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.followApiUrl}/followers/${username}`);
  }

  following(username: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.followApiUrl}/following/${username}`);
  }

}
