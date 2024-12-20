//app.module.ts
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { environment } from "../environments/environment";
import { LoginComponent } from "./pages/login/login.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { HomeComponent } from './pages/home/home.component';
import { BoardComponent } from './pages/board/board.component';
import { BoardSidebarComponent } from './components/board/board-sidebar/board-sidebar.component';
import { BoardNavbarComponent } from './components/board/board-navbar/board-navbar.component';
import { CardComponent } from './components/board/card/card.component';
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DragDropModule } from '@angular/cdk/drag-drop'
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { OpenCardComponent } from './components/board/open-card/open-card.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import { provideNativeDateAdapter } from "@angular/material/core";
import { LabelCreationComponent } from './components/board/open-card/label-creation/label-creation.component';
import { HttpClientModule } from "@angular/common/http";
import { CalendarComponent } from './pages/calendar/calendar.component';
import { FullCalendarModule } from "@fullcalendar/angular";
import { WorkspacesComponent } from './components/home/workspaces/workspaces.component';
import { NotificationCardComponent } from './components/navbar/notification-card/notification-card.component';
import { TableComponent } from './pages/table/table.component';
import { MatTableModule } from '@angular/material/table';
import { WorkspaceSettingsComponent } from './pages/workspace-settings/workspace-settings.component';
import { WhiteboardComponent } from './pages/whiteboard/whiteboard.component';
import { NgWhiteboardModule } from 'ng-whiteboard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    BoardComponent,
    BoardSidebarComponent,
    BoardNavbarComponent,
    CardComponent,
    OpenCardComponent,
    LabelCreationComponent,
    CalendarComponent,
    WorkspacesComponent,
    NotificationCardComponent,
    TableComponent,
    WorkspaceSettingsComponent,
    WhiteboardComponent
  ],
  imports: [
    FormsModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    CdkDrag,
    CdkDropList,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatDatepickerModule,
    MatTableModule,
    HttpClientModule,
    FullCalendarModule,
    NgWhiteboardModule
  ],
  providers: [
    provideAnimationsAsync(),
    provideNativeDateAdapter()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
