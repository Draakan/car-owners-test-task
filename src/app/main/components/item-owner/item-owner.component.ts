import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { omit } from 'lodash';
import { MessageService } from 'primeng/api';
import { of, Subject } from 'rxjs';
import { concatMap, takeUntil, tap } from 'rxjs/operators';
import { OwnerEntity } from '../../entities/owner';
import { CarOwnerService } from '../../services/car-owner.service';

enum Mode {
  VIEW = 'view',
  ADD = 'add',
  EDIT = 'edit',
};

interface IInitialFormValue {
  value: string | number;
  disabled: boolean;
}

@Component({
  selector: 'app-item-owner',
  templateUrl: './item-owner.component.html',
  styleUrls: ['./item-owner.component.scss'],
  providers: [MessageService]
})
export class ItemOwnerComponent implements OnInit, OnDestroy {
  
  public owner: OwnerEntity | null = null;
  public stringifiedOwner: string = '';

  public isDisabled: boolean = false;
  public isLoading: boolean = true;
  public isNew: boolean = false;
  public isTheSame: boolean = false;
  
  public form: FormGroup = new FormGroup({ });
  
  private carStateNumberRegex: RegExp = /[A-Z]{2}\d{4}[A-Z]{2}/;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carOwnerService: CarOwnerService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.initQueryParamsSubscription();
  }
  
  private initQueryParamsSubscription(): void {
    this.route.queryParams
      .pipe(
        tap(params => {
          if (params[Mode.VIEW]) this.isDisabled = true;
          if (params[Mode.ADD]) this.isNew = true;
        }),
        concatMap(params => {
          const existParam = params[Mode.VIEW] || params[Mode.EDIT];

          if (existParam) {
            return this.carOwnerService.getOwnerById(existParam);
          }
          return of(null)
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(owner => {
        this.owner = owner;

        if (this.owner) {
          this.stringifiedOwner = JSON.stringify(omit(owner, ['id']));
          this.isTheSame = true;
        }

        this.initForm();
        this.isLoading = false;
      });
  }
  
  public getCarFormControls(): FormArray {
    return this.form.controls['cars'] as FormArray;
  }
  
  public addNewCar(): void {
    this.getCarFormControls().push(this.getNestedCarForm());
  }
  
  public deleteCar(index: number): void {
    const controls = this.getCarFormControls();
    
    if (controls.length === 1) {
      this.messageService.add({ severity:'error', summary: 'Error', detail: 'Власник має мати принаймні одну машину' });
    } else controls.removeAt(index);
  }
  
  public async addOrEditNewOwner(): Promise<void> {
    this.isLoading = true;
    
    if (this.isNew) {
      const { firstName, lastName, middleName, cars } = this.form.value as OwnerEntity;
  
      await this.carOwnerService.createOwner(lastName, firstName, middleName, cars).toPromise();
    } else {
      await this.carOwnerService.editOwner({ id: this.owner!.id!, ...this.form.value }).toPromise();
    }

    this.router.navigate(['/']);
  }
  
  private initForm(): void {
    this.form = new FormGroup({
      firstName: new FormControl(this.getInitialValueForForm(this.owner ? this.owner.firstName : ''), [Validators.required]),
      lastName: new FormControl(this.getInitialValueForForm(this.owner ? this.owner.lastName : ''), [Validators.required]),
      middleName: new FormControl(this.getInitialValueForForm(this.owner ? this.owner.middleName : ''), [Validators.required]),
      cars: new FormArray(this.initNestedCarsForm())
    });
    
    if (!this.isNew) {
      this.form.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(form => {
          if (JSON.stringify(form) === this.stringifiedOwner) this.isTheSame = true;
          else this.isTheSame = false;
        });
    }
  }
  
  private initNestedCarsForm(): FormGroup[] {
    return this.owner ?
      this.owner.cars.map(car => this.getNestedCarForm(
        this.getInitialValueForForm(car.stateNumber),
        this.getInitialValueForForm(car.producer),
        this.getInitialValueForForm(car.model),
        this.getInitialValueForForm(car.year),
      )) : [this.getNestedCarForm()];
  }
  
  private getInitialValueForForm(value: string | number): IInitialFormValue {
    return { value, disabled: this.isDisabled };
  }
  
  private getNestedCarForm(
    stateNumber: string | IInitialFormValue = '', 
    producer: string | IInitialFormValue = '',
    model: string | IInitialFormValue = '', 
    year: string | IInitialFormValue = ''
  ): FormGroup {
    return new FormGroup({
      stateNumber: new FormControl(stateNumber, [Validators.required, Validators.pattern(this.carStateNumberRegex)], this.forbiddenCarStateNumber),
      producer: new FormControl(producer, [Validators.required]),
      model: new FormControl(model, [Validators.required]),
      year: new FormControl(year, [Validators.required, Validators.min(1990), Validators.max(new Date().getFullYear())]),
    });
  }
  
  private forbiddenCarStateNumber = async (control: AbstractControl) => {
    let owners = await this.carOwnerService.getOwners().toPromise();
    
    if (!this.isNew) owners = owners.filter(owner => owner!.id !== this.owner!.id);
    
    const allCars = owners.map(owner => owner.cars).reduce((acc, val) => acc.concat(val), []);
    
    return allCars.some(car => car.stateNumber === control.value) ? { forbiddenCarStateNumber: true } : null;
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
