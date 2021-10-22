import { CarEntity } from "./car";

export class OwnerEntity {
  constructor(
    public firstName: string,
    public lastName: string,
    public middleName: string,
    public cars: CarEntity[],
    public id?: number,
  ) {}
}
