import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
} from "@angular/core";
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
  @Input() isMoreProductsLoading: boolean = false;
  @Input() noMoreProducts: boolean = false;
  // @Input() currentPage: number = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  productDetailsRoute: boolean = false;
  wishlistRoute: boolean = false;

  // Pagination properties
  currentPage: number = 1;
  productsPerPage: number = 16;

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
      this.productsPerPage = routeName === "/filtered-posts" ? 16 : 16;
    });

    this.route.url.subscribe((urlSegments) => {
      this.wishlistRoute =
        urlSegments.length > 0 && urlSegments[0].path === "wishlist";
      this.productDetailsRoute =
        urlSegments.length > 0 && urlSegments[0].path === "product-details";
    });
  }

  loadMore() {
    this.currentPage = this.currentPage + 1;
    this.pageChange.emit(this.currentPage);
  }

  goToPage(page: number) {
    if (page >= 1) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  nextPage() {
    if (
      this.currentPage < Math.ceil(this.products.length / this.productsPerPage)
    ) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
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

  get pageNumbers(): (number | string)[] {
    const totalPages = Math.ceil(this.products.length / this.productsPerPage);
    const currentPage = this.currentPage;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let pages: (number | string)[] = [];

    if (currentPage <= 2) {
      pages = [1, 2, 3, "...", totalPages];
    } else if (currentPage >= 3 && currentPage < totalPages - 2) {
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

  previousPageDisabled(): boolean {
    return this.currentPage === 1;
  }

  nextPageDisabled(): boolean {
    return this.currentPage >= this.totalPages;
  }
}
