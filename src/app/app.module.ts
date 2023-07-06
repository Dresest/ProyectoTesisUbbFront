import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './modules/pages/pages.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { HttpInterceptorService } from './core/_services/http-interceptor.service';
import { MessageService } from 'primeng/api';
import { NopagefoundComponent } from './modules/pages/nopagefound/nopagefound.component';
import { PagesComponent } from './modules/pages/pages.component';

@NgModule({
  declarations: [
    AppComponent,
    NopagefoundComponent,
    PagesComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,  
    MatProgressSpinnerModule,
    PagesModule,
  ],
  providers: [
    MessageService,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
