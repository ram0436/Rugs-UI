import { Component, ElementRef, Input, Renderer2 } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "src/codeokk/modules/user/service/user.service";
import { ProductService } from "../../service/product.service";
@Component({
  selector: "app-post-cards",
  templateUrl: "./post-cards.component.html",
  styleUrls: ["./post-cards.component.css"],
})
export class PostCardsComponent {
  @Input() products: any;
  productDetailsRoute: boolean = false;
  wishlistRoute: boolean = false;

  // Pagination properties
  currentPage: number = 1;
  productsPerPage: number = 20;

  constructor(
    private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
    private userService: UserService,
    private renderer: Renderer2,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private elementRef: ElementRef
  ) {
    this.route.queryParams.subscribe((params) => {
      const routeName = this.router.url.split("?")[0];
      this.productsPerPage = routeName === "/filtered-posts" ? 25 : 24;
    });

    this.route.url.subscribe((urlSegments) => {
      this.wishlistRoute =
        urlSegments.length > 0 && urlSegments[0].path === "wishlist";
      this.productDetailsRoute =
        urlSegments.length > 0 && urlSegments[0].path === "product-details";
    });
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.productsPerPage;
  }

  get endIndex(): number {
    return Math.min(
      this.startIndex + this.productsPerPage,
      this.products.length
    );
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // get pageNumbers(): number[] {
  //   return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  // }

  get pageNumbers(): (number | string)[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 5) {
      // Show all pages if there are 5 or fewer
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let pages: (number | string)[] = [];

    if (currentPage <= 2) {
      // If on one of the first three pages, show 1, 2, 3, 4, ..., totalPages
      pages = [1, 2, 3, "...", totalPages];
    } else if (currentPage >= 3 && currentPage < totalPages - 2) {
      // If in the middle somewhere, show 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
      pages = [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      ];
    } else {
      // If near the end, show 1, ..., totalPages-3, totalPages-2, totalPages-1, totalPages
      pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return pages;
  }

  isNumber(value: any): value is number {
    return typeof value === "number";
  }

  get totalPages(): number {
    return Math.ceil(this.products.length / this.productsPerPage);
  }

  get currentPageProducts(): any[] {
    return this.products.slice(this.startIndex, this.endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.products.length / this.productsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }
}
