import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExpenseManagementComponent } from './expense-management.component';
import { DataSetupComponent } from './data-setup/data-setup.component';
import { ManageExpenseComponent } from './manage-expense/manage-expense.component';
import { ManageIncomeComponent } from './manage-income/manage-income.component';
import { ReportsComponent } from './reports/reports.component';
import { ExpenseHomeComponent } from './expense-home/expense-home.component';
import { AddEditExpenseComponent } from './manage-expense/add-edit-expense/add-edit-expense.component';
import { AddEditIncomeComponent } from './manage-income/add-edit-income/add-edit-income.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
        path: '',
        component: ExpenseManagementComponent,
        pathMatch: 'prefix',
        children: [
            {
                path: '',
                component: ExpenseHomeComponent,
                pathMatch: 'prefix'
            },
            {
                path: 'home',
                component: ExpenseHomeComponent,
                pathMatch: 'prefix'
            },
            {
                path: 'setup',
                component: DataSetupComponent,
                pathMatch: 'prefix'
            },
            {
                path: 'manage-expense',
                component: ManageExpenseComponent,
                pathMatch: 'prefix'
            },
            {
                path: 'add-expense',
                component: AddEditExpenseComponent,
                pathMatch: 'prefix'
            },
            {
                path: 'edit-expense/:id',
                component: AddEditExpenseComponent,
                pathMatch: 'prefix'
            },
            {
                path: 'manage-income',
                component: ManageIncomeComponent,
                pathMatch: 'prefix'
            },
            {
                path: 'add-income',
                component: AddEditIncomeComponent,
                pathMatch: 'prefix'
            },
            {
                path: 'edit-income/:id',
                component: AddEditIncomeComponent,
                pathMatch: 'prefix'
            },
            {
                path: 'report',
                component: ReportsComponent,
                pathMatch: 'prefix'
            },

        ]
    }
  ]
  )],
  exports: [RouterModule]
})
export class ExpenseManagementRoutingModule { }
