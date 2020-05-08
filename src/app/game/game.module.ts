import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameControllerPanelComponent } from './game-controller-panel/game-controller-panel.component';
import { GameContainerComponent } from './game-container/game-container.component';

import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider'; 


@NgModule({
  declarations: [
    GameControllerPanelComponent,
    GameContainerComponent
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule
  ],
  exports:[
    GameContainerComponent,
    GameControllerPanelComponent
  ]
})
export class GameModule { }
