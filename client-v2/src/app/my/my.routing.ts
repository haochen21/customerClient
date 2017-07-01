import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyComponent } from './my.component';

const routes: Routes = [
  { path: '', redirectTo: 'my', pathMatch: 'full' },
  { path: 'my', component: MyComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class MyRoutingModule { }