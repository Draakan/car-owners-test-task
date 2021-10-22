import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OwnerEntity } from './entities/owner';
import { CarOwnerService } from './services/car-owner.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  public owners: OwnerEntity[] = [];
  public selectedOwner: OwnerEntity | null = null;
  public isLoading: boolean = true;
  
  private destroy$: Subject<void> = new Subject();
  
  constructor(
    private router: Router,
    private carOwnerService: CarOwnerService,
  ) {}
  
  ngOnInit(): void {
    this.carOwnerService
      .getOwners()
      .pipe(takeUntil(this.destroy$))
      .subscribe(owners => {
        this.owners = owners;
        this.isLoading = false;
      });
  }
  
  public addNewOwner(): void {
    this.navigateToOwnerPage({ queryParams: { add: true }});
  }
  
  public viewOwner(): void {
    this.navigateToOwnerPage({ queryParams: { view: this.getSelectedOwnerId() }});
  }
  
  public editOwner(): void {
    this.navigateToOwnerPage({ queryParams: { edit: this.getSelectedOwnerId() }});
  }
  
  public async deleteOwner(): Promise<void> {
    this.isLoading = true;
    this.owners = await this.carOwnerService.deleteOwner(this.getSelectedOwnerId()).toPromise();
    this.selectedOwner = null;
    this.isLoading = false;
  }
  
  private getSelectedOwnerId(): number {
    return this.selectedOwner!.id!;
  }
  
  private navigateToOwnerPage(...params: any): void {
    this.router.navigate(['/owner'], ...params);
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
