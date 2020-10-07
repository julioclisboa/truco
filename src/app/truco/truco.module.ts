import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TrucoRoutingModule } from './truco-routing.module';
import { TrucoComponent } from './truco/truco.component';

import { TrucoService } from './shared';

@NgModule({
  declarations: [TrucoComponent],
  imports: [
    CommonModule,
    TrucoRoutingModule,
    FormsModule
  ],
  exports: [
    TrucoComponent
  ],
  providers: [
    TrucoService
  ]
})
export class TrucoModule { }
