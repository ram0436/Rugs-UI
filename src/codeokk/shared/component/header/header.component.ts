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

  colors: any[] = [];
  prices: any[] = [];
  discount: any = [];
  sizes: any[] = [];
  materials: any[] = [];
  priceRanges: any[] = [];
  shapes: any[] = [];
  weavingTechniques: any[] = [];
  patterns: any[] = [];
  collections: any[] = [];
  rooms: any[] = [];

  newest: any[] = [
    {
      title: "Bestsellers: Channels Indigo by Kelly Wearstler",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/khushi-enterprises/Rugs-5.png",
      alt: "Bestsellers: Channels Indigo by Kelly Wearstler",
      first: "Channels Indigo",
      second: "by Kelly Wearstler",
    },
    {
      title: "Bestsellers: Channels Copper by Kelly Wearstler",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/khushi-enterprises/Rugs-1.png",
      alt: "Bestsellers: Channels Copper by Kelly Wearstler",
      first: "Channels Copper",
      second: "by Kelly Wearstler",
    },
    {
      title: "Bestsellers: Monarch Fire by Alexander McQueen",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/khushi-enterprises/Rugs-3.png",
      alt: "Bestsellers: Monarch Fire by Alexander McQueen",
      first: "Monarch Fire",
      second: "by Alexander McQueen",
    },
    {
      title: "Bestsellers: Carnival by Paul Smith",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/khushi-enterprises/Rugs-3.png",
      alt: "Bestsellers: Carnival by Paul Smith",
      first: "Carnival",
      second: "by Paul Smith",
    },
    {
      title: "Bestsellers: Glasswings by Alexander McQueen",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/khushi-enterprises/Rugs-3.png",
      alt: "Bestsellers: Glasswings by Alexander McQueen",
      first: "Glasswings",
      second: "by Alexander McQueen",
    },
  ];

  stories: any[] = [
    {
      title: "Bestsellers: Channels Indigo by Kelly Wearstler",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/clothwear/Codeokk436294.PNG",
      alt: "Bestsellers: Channels Indigo by Kelly Wearstler",
      first: "Channels Indigo",
      second: "by Kelly Wearstler",
    },
    {
      title: "Bestsellers: Channels Copper by Kelly Wearstler",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/clothwear/Codeokk354414.PNG",
      alt: "Bestsellers: Channels Copper by Kelly Wearstler",
      first: "Channels Copper",
      second: "by Kelly Wearstler",
    },
    {
      title: "Bestsellers: Monarch Fire by Alexander McQueen",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/clothwear/Codeokk598059.PNG",
      alt: "Bestsellers: Monarch Fire by Alexander McQueen",
      first: "Monarch Fire",
      second: "by Alexander McQueen",
    },
    {
      title: "Bestsellers: Carnival by Paul Smith",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/clothwear/Codeokk830980.PNG",
      alt: "Bestsellers: Carnival by Paul Smith",
      first: "Carnival",
      second: "by Paul Smith",
    },
    {
      title: "Bestsellers: Glasswings by Alexander McQueen",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/clothwear/Codeokk728555.PNG",
      alt: "Bestsellers: Glasswings by Alexander McQueen",
      first: "Glasswings",
      second: "by Alexander McQueen",
    },
  ];

  bestSellers: any[] = [
    {
      title: "Bestsellers: Channels Indigo by Kelly Wearstler",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/clothwear/Codeokk830980.PNG",
      alt: "Bestsellers: Channels Indigo by Kelly Wearstler",
      first: "Channels Indigo",
      second: "by Kelly Wearstler",
    },
    {
      title: "Bestsellers: Channels Copper by Kelly Wearstler",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/clothwear/Codeokk318327.PNG",
      alt: "Bestsellers: Channels Copper by Kelly Wearstler",
      first: "Channels Copper",
      second: "by Kelly Wearstler",
    },
    {
      title: "Bestsellers: Monarch Fire by Alexander McQueen",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/clothwear/Codeokk728555.PNG",
      alt: "Bestsellers: Monarch Fire by Alexander McQueen",
      first: "Monarch Fire",
      second: "by Alexander McQueen",
    },
    {
      title: "Bestsellers: Carnival by Paul Smith",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/clothwear/Codeokk862338.PNG",
      alt: "Bestsellers: Carnival by Paul Smith",
      first: "Carnival",
      second: "by Paul Smith",
    },
    {
      title: "Bestsellers: Glasswings by Alexander McQueen",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/clothwear/Codeokk980717.jpg",
      alt: "Bestsellers: Glasswings by Alexander McQueen",
      first: "Glasswings",
      second: "by Alexander McQueen",
    },
  ];

  custom: any[] = [
    {
      title: "Bestsellers: Channels Indigo by Kelly Wearstler",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/clothwear/Codeokk82324.PNG",
      alt: "Bestsellers: Channels Indigo by Kelly Wearstler",
      first: "Channels Indigo",
      second: "by Kelly Wearstler",
    },
    {
      title: "Bestsellers: Channels Copper by Kelly Wearstler",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/clothwear/Codeokk421383.PNG",
      alt: "Bestsellers: Channels Copper by Kelly Wearstler",
      first: "Channels Copper",
      second: "by Kelly Wearstler",
    },
    {
      title: "Bestsellers: Monarch Fire by Alexander McQueen",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/clothwear/Codeokk643150.PNG",
      alt: "Bestsellers: Monarch Fire by Alexander McQueen",
      first: "Monarch Fire",
      second: "by Alexander McQueen",
    },
    {
      title: "Bestsellers: Carnival by Paul Smith",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/clothwear/Codeokk343725.PNG",
      alt: "Bestsellers: Carnival by Paul Smith",
      first: "Carnival",
      second: "by Paul Smith",
    },
    {
      title: "Bestsellers: Glasswings by Alexander McQueen",
      imgSrc:
        "https://cfdblob.blob.core.windows.net/clothwear/Codeokk164115.PNG",
      alt: "Bestsellers: Glasswings by Alexander McQueen",
      first: "Glasswings",
      second: "by Alexander McQueen",
    },
  ];

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

    this.masterService.colors$.subscribe((data) => (this.colors = data));
    this.masterService.sizes$.subscribe((data) => (this.sizes = data));
    this.masterService.discounts$.subscribe((data) => (this.discount = data));
    this.masterService.materials$.subscribe((data) => (this.materials = data));
    this.masterService.collections$.subscribe(
      (data) => (this.collections = data)
    );
    this.masterService.shapes$.subscribe((data) => (this.shapes = data));
    this.masterService.patterns$.subscribe((data) => (this.patterns = data));
    this.masterService.priceRanges$.subscribe(
      (data) => (this.priceRanges = data)
    );
    this.masterService.rooms$.subscribe((data) => (this.rooms = data));
    this.masterService.weavingTechniques$.subscribe(
      (data) => (this.weavingTechniques = data)
    );

    this.masterService.fetchData();
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
