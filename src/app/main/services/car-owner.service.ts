import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CarEntity } from '../entities/car';
import { ICarOwnersService } from '../entities/interfaces';
import { OwnerEntity } from '../entities/owner';
import { concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarOwnerService implements ICarOwnersService {
  
  private apiUrl: string = '/api/owners';

  constructor(
    private http: HttpClient,
  ) { }

  getOwners(): Observable<OwnerEntity[]> {
    return this.http.get<OwnerEntity[]>(this.apiUrl);
  }

  getOwnerById(aId: number): Observable<OwnerEntity> {
    return this.http.get<OwnerEntity>(`${ this.apiUrl }/${ aId }`);
  }

  createOwner(aLastName: string, aFirstName: string, aMiddleName: string, aCars: CarEntity[]): Observable<OwnerEntity> {
    return this.http.post<OwnerEntity>(this.apiUrl, { firstName: aFirstName, lastName: aLastName, middleName: aMiddleName, cars: aCars });
  }

  editOwner(aOwner: OwnerEntity): Observable<OwnerEntity> {
    return this.http.put<OwnerEntity>(this.apiUrl, aOwner);
  }

  deleteOwner(aOwnerId: number): Observable<OwnerEntity[]> {
    return this.http.delete(`${ this.apiUrl }/${ aOwnerId }`)
      .pipe(
        concatMap(() => this.getOwners()),
      );
  }
}
