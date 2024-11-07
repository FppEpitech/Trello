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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    HomeComponent,
    BoardComponent,
    BoardSidebarComponent,
    BoardNavbarComponent,
    CardComponent
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
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
