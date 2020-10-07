import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TrucoModule,TrucoRoutingModule } from './truco';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TrucoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
