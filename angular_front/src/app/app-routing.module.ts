import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { authGuard, notAuthGuard } from "./guards/auth.guard";
import { LoginComponent } from "./pages/login/login.component";
import { HomeComponent } from "./pages/home/home.component";
import { BoardComponent } from "./pages/board/board.component";
import { CalendarComponent } from "./pages/calendar/calendar.component";

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: '', component: LoginComponent, canActivate: [notAuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [notAuthGuard]},
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'workspace/:workspaceId/board/:boardId', component: BoardComponent, canActivate: [authGuard] },
  { path: 'workspace/:workspaceId/calendar/:calendarId', component: CalendarComponent, canActivate: [authGuard] }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
