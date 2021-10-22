import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class InMemoryCarDbService implements InMemoryDbService {

  public createDb() {
    const owners = [{
      id: 1,
      firstName: 'Maksym',
      lastName: 'Boiar',
      middleName: 'Viktorovich',
      cars: [
        {
          stateNumber: 'AX2332PI',
          producer: 'Mazda',
          model: 'RX8',
          year: 1995,
        },
        {
          stateNumber: 'CD2435XZ',
          producer: 'Honda',
          model: 'Civic',
          year: 2005,
        }
      ]
    }, {
      id: 2,
      firstName: 'Ivan',
      lastName: 'Boiar',
      middleName: 'Viktorovich',
      cars: [
        {
          stateNumber: 'AX2332PZ',
          producer: 'Mazda',
          model: 'RX8',
          year: 1995,
        }
      ]
    }];
    
    return { owners };
  }
}
