export class CarEntity {
  constructor(
    public stateNumber: string,
    public producer: string,
    public model: string,
    public year: number,
    public id?: number,
  ) {}
}
