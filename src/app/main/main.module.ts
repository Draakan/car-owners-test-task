import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { ItemOwnerComponent } from './components/item-owner/item-owner.component';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    MainComponent,
    ItemOwnerComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    ToastModule,
    RouterModule.forChild([
      { path: '', component: MainComponent },
      { path: 'owner', component: ItemOwnerComponent },
    ])
  ]
})
export class MainModule { }
