import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AuthService,
  NavigationService,
  OUserInfoService,
  ServiceResponse,
} from "ontimize-web-ngx";
import { Observable } from "rxjs";
import { MainService } from "../shared/services/main.service";
import { UserInfoService } from "../shared/services/user-info.service";

@Component({
  selector: "login",
  styleUrls: ["./login.component.scss"],
  templateUrl: "./login.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit, AfterViewInit {
  public loginForm: UntypedFormGroup = new UntypedFormGroup({});
  public userCtrl: UntypedFormControl = new UntypedFormControl(
    "",
    Validators.required
  );
  public pwdCtrl: UntypedFormControl = new UntypedFormControl(
    "",
    Validators.required
  );

  public sessionExpired = false;
  private redirect = "/main";

  constructor(
    private actRoute: ActivatedRoute,
    private router: Router,
    @Inject(NavigationService) private navigationService: NavigationService,
    @Inject(AuthService) private authService: AuthService,
    @Inject(MainService) private mainService: MainService,
    @Inject(OUserInfoService) private oUserInfoService: OUserInfoService,
    @Inject(UserInfoService) private userInfoService: UserInfoService,
    @Inject(DomSanitizer) private domSanitizer: DomSanitizer
  ) {
    const qParamObs: Observable<any> = this.actRoute.queryParams;
    qParamObs.subscribe((params) => {
      if (params) {
        if (params["session-expired"]) {
          this.sessionExpired = params["session-expired"] === "true";
        } else {
          if (params["redirect"]) {
            this.redirect = params["redirect"];
          }
          this.sessionExpired = false;
        }
      }
    });
  }

  ngOnInit(): any {
    this.navigationService.setVisible(false);

    this.loginForm.addControl("username", this.userCtrl);
    this.loginForm.addControl("password", this.pwdCtrl);

    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.redirect]);
    } else {
      this.authService.clearSessionData();
    }
    setTimeout(() => { this.deleteLoader() }, 200);
  }

deleteLoader() {
    const borrar = document.querySelector('#borrar') as HTMLDivElement;
    if (borrar) {
      borrar.textContent = "";
    }
  }

  public login() {
    const userName = this.loginForm.value.username;
    const password = this.loginForm.value.password;
    if (userName && userName.length > 0 && password && password.length > 0) {
      const self = this;
      this.authService.login(userName, password).subscribe(() => {
        self.sessionExpired = false;
        this.loadUserInfo();
        self.router.navigate([this.redirect]);
      }, this.handleError);
    }
  }

  private loadUserInfo() {
    this.mainService.getUserInfo().subscribe((result: ServiceResponse) => {
      this.userInfoService.storeUserInfo(result.data);
      let avatar = "./assets/images/user_profile.png";
      if (result.data["usr_photo"]) {
        (avatar as any) = this.domSanitizer.bypassSecurityTrustResourceUrl(
          "data:image/*;base64," + result.data["usr_photo"]
        );
      }
      this.oUserInfoService.setUserInfo({
        username: result.data["usr_name"],
        avatar: avatar,
      });
    });
  }

  private handleError(error) {
    switch (error.status) {
      case 401:
        console.error("Email or password is wrong.");
        break;
      default:
        break;
    }
  }

  entradaSinLogin() {
    this.router.navigate([" "]);
  }
  registerUser() {
    this.router.navigate(["register/user/new"]);
  }
  goBack() {
    this.router.navigate(["/landing"]);
  }

  ngAfterViewInit(): void {
    this.setupVideoPlayback();
  }

  setupVideoPlayback(): void {
    const videoElement = document.getElementById(
      "background-video"
    ) as HTMLVideoElement;
    if (videoElement) {
      videoElement.muted = true; // Asegúrate de que el video esté silenciado
      videoElement.currentTime = 0; // Reinicia el video
      videoElement.play().catch((error) => {
        console.log("Video playback failed:", error);
      });

      document.addEventListener(
        "click",
        () => {
          videoElement.play().catch((error) => {
            console.log("Video playback failed:", error);
          });
        },
        { once: true }
      );
    }
  }
}
