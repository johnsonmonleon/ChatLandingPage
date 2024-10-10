import { Routes } from '@angular/router';
import { TemplateOneComponent } from './templates/template-one/template-one.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: 'template-1',
        component: TemplateOneComponent
    },
    {
        path: '**',
        redirectTo: 'template-1',
        pathMatch: 'full'
    }

];
