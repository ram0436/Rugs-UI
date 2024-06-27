import { Component, ElementRef, HostListener, Renderer2 } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MasterService } from "src/codeokk/modules/service/master.service";
import { UserService } from "src/codeokk/modules/user/service/user.service";
import { ProductService } from "../../service/product.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoginComponent } from "src/codeokk/modules/user/component/login/login.component";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  isHovered = false;

  isSearchActive: boolean = false;
  isCartActive: boolean = false;
  isAccountActive: boolean = false;

  isActive = false;

  isScrolledDown: boolean = false;

  isAdmin: boolean = false;
  isUserLogedIn: boolean = false;

  userName: string = "";
  userMobile: string = "";

  dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private userService: UserService,
    private masterService: MasterService,
    private router: Router,
    private dialog: MatDialog,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private elementRef: ElementRef
  ) {
    this.renderer.listen("window", "click", this.handleClickOutside.bind(this));
  }

  handleClickOutside(event: Event) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isSearchActive = false;
    }
  }

  ngOnDestroy() {
    this.renderer.destroy();
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.isScrolledDown = window.scrollY > 5;
  }

  @HostListener("mouseenter") onMouseEnter() {
    this.renderer.addClass(this.el.nativeElement, "hovered");
  }

  @HostListener("mouseleave") onMouseLeave() {
    this.renderer.removeClass(this.el.nativeElement, "hovered");
  }

  ngOnInit() {
    if (localStorage.getItem("authToken") != null) {
      this.isUserLogedIn = true;
      this.getUserData();
    }
    var role = localStorage.getItem("role");
    if (role != null && role == "Admin") this.isAdmin = true;
    else this.isAdmin = false;
  }

  navigateToWishlist() {
    if (this.isUserLogedIn) {
      this.router.navigate(["user/wishlist"]);
    } else {
      this.openLoginModal();
    }
  }

  navigateToDashboard() {
    if (this.isUserLogedIn) {
      this.router.navigate(["/admin/dashboard"]);
    } else {
      this.openLoginModal();
    }
  }

  navigateToCart() {
    if (this.isUserLogedIn) {
      this.router.navigate(["user/cart"]);
    } else {
      this.openLoginModal();
    }
  }

  logout() {
    if (localStorage.getItem("authToken") != null) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      localStorage.removeItem("id");
      localStorage.removeItem("userId");
      localStorage.removeItem("userData");
      this.isUserLogedIn = false;
      this.router.navigate(["/"]);
    }
  }

  openLoginModal() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    this.dialogRef = this.dialog.open(LoginComponent, { width: "450px" });

    this.dialogRef.afterClosed().subscribe((result) => {
      if (localStorage.getItem("authToken") != null) this.isUserLogedIn = true;
    });
  }

  getUserData() {
    const userData = this.userService.getUserData();
    this.userName = userData.name;
    this.userMobile = userData.mobile;
  }

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
  }

  toggleActive(state: boolean) {
    this.isActive = state;
  }

  toggleCart() {
    this.isCartActive = !this.isCartActive;
  }

  toggleAccount() {
    this.isAccountActive = !this.isAccountActive;
  }
}
