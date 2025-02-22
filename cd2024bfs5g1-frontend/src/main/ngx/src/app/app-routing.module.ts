import { NgModule } from "@angular/core";
import { ExtraOptions, RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "ontimize-web-ngx";

export const routes: Routes = [
  { path: "", redirectTo: "landing", pathMatch: "full" },
  {
    path: "landing",
    loadChildren: () =>
      import("./landing/landing.module").then((m) => m.LandingModule),
  },
  {
    path: "main",
    canActivate: [AuthGuardService],
    loadChildren: () => import("./main/main.module").then((m) => m.MainModule),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./login/login.module").then((m) => m.LoginModule),
  },
  {
    path: "register",
    loadChildren: () =>
      import("./register/register.module").then((m) => m.RegisterModule),
  },
  {
    path: "",
    loadChildren: () =>
      import("./public/public.module").then((m) => m.PublicModule),
  },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

const opt: ExtraOptions = {
  enableTracing: false,
  // true if you want to print navigation routes
};

@NgModule({
  imports: [RouterModule.forRoot(routes, opt)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
