import { Component, HostListener } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { MasterService } from "../service/master.service";
import { Observable, filter, forkJoin } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-filtered-posts",
  templateUrl: "./filtered-posts.component.html",
  styleUrls: ["./filtered-posts.component.css"],
})
export class FilteredPostsComponent {
  products: any[] = [];

  // products = [
  //   {
  //     id: 1,
  //     productName: "Product 1",
  //     productDesc: "Hand knotted - wool",
  //     productSize: "120x180 cm",
  //     productPrice: "$1,380",
  //     productImageList: [
  //       {
  //         id: 0,
  //         imageUrl:
  //           "https://cfdblob.blob.core.windows.net/khushi-enterprises/Rugs-1.png",
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     productName: "Product 2",
  //     productDesc: "Hand knotted - wool",
  //     productSize: "120x180 cm",
  //     productPrice: "$1,380",
  //     productImageList: [
  //       {
  //         id: 0,
  //         imageUrl:
  //           "https://cfdblob.blob.core.windows.net/khushi-enterprises/Rugs-2.png",
  //       },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     productName: "Product 3",
  //     productDesc: "Hand knotted - wool",
  //     productSize: "120x180 cm",
  //     productPrice: "$1,380",
  //     productImageList: [
  //       {
  //         id: 0,
  //         imageUrl:
  //           "https://cfdblob.blob.core.windows.net/khushi-enterprises/Rugs-3.png",
  //       },
  //     ],
  //   },
  //   {
  //     id: 4,
  //     productName: "Product 4",
  //     productDesc: "Hand knotted - wool",
  //     productSize: "120x180 cm",
  //     productPrice: "$1,380",
  //     productImageList: [
  //       {
  //         id: 0,
  //         imageUrl:
  //           "https://cfdblob.blob.core.windows.net/khushi-enterprises/Rugs-4.png",
  //       },
  //     ],
  //   },
  //   {
  //     id: 5,
  //     productName: "Product 5",
  //     productDesc: "Hand knotted - wool",
  //     productSize: "120x180 cm",
  //     productPrice: "$1,380",
  //     productImageList: [
  //       {
  //         id: 0,
  //         imageUrl:
  //           "https://cfdblob.blob.core.windows.net/khushi-enterprises/Rugs-5.png",
  //       },
  //     ],
  //   },
  // ];

  originalProducts: any[] = [];

  brands: any[] = [];

  menuName: string = "";

  parentId: Number = 0;
  subCategoryId: Number = 0;
  categoryId: Number = 0;
  subMenuName: string = "";

  allParentCategories: any[] = [];
  allCategories: any[] = [];
  allsubCategories: any[] = [];

  breadcrumb: string = "Interior / Room / Carpets";

  sizes: any[] = [];

  showSizeFilters: boolean = false;

  filtersToggled: boolean = false;

  selectedSizes: number[] = [];

  isScreenSmall: boolean = false;

  isLoading: boolean = true;

  sizesMap: Map<number, string> = new Map();

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private masterService: MasterService,
    private router: Router
  ) {
    this.checkScreenWidth();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    this.isScreenSmall = window.innerWidth < 568;
  }

  ngOnInit() {
    this.checkScreenWidth();
    this.getAllProductSizes();
    this.route.queryParams.subscribe((params) => {
      this.parentId = params["parent"];
      if (params["category"] != undefined)
        this.categoryId = Number(params["category"]);
      if (params["subCategory"] != undefined)
        this.subCategoryId = Number(params["subCategory"]);
      else this.subCategoryId = 0;
      // this.getProducts();
    });
    this.getProducts();
  }

  getProducts() {
    this.productService.getAllProducts().subscribe((res) => {
      this.products = res;
      this.products.forEach((product) => {
        this.fetchSizeDetails(product);
      });
      this.isLoading = false;
    });
  }

  getAllProductSizes() {
    this.masterService.getAllProductSize().subscribe((res: any) => {
      this.sizes = res;
      this.sizesMap = this.createSizeMap(res);
    });
  }

  toggleFilters() {
    this.filtersToggled = !this.filtersToggled;
  }

  showSize() {
    this.showSizeFilters = !this.showSizeFilters;
  }

  toggleSize(sizeId: number) {
    const index = this.selectedSizes.indexOf(sizeId);
    if (index === -1) {
      this.selectedSizes.push(sizeId);
    } else {
      this.selectedSizes.splice(index, 1);
    }
  }

  sortProducts(criteria: string) {}

  clearFilters(event: Event) {
    event.preventDefault();
    window.location.reload();
  }

  createSizeMap(sizes: any[]) {
    const map = new Map();
    sizes.forEach((size: any) => {
      map.set(size.id, size.size);
    });
    return map;
  }

  fetchSizeDetails(productDetails: any) {
    const sizeDetailRequests: Observable<any[]>[] =
      productDetails.productSizeMappingList.map((mapping: any) =>
        this.productService.getProductSizebyProductId(mapping.productId)
      );

    forkJoin(sizeDetailRequests).subscribe((responses: any[]) => {
      let productSizeDetails: any[] = [];

      responses.forEach((sizeDetailsArray, index) => {
        const mapping = productDetails.productSizeMappingList[index];
        sizeDetailsArray.forEach((sizeDetail: any) => {
          const sizeId = this.findSizeIdBySize(sizeDetail.size);

          const existingSize = productSizeDetails.find(
            (item) => item.size === sizeDetail.size
          );

          if (!existingSize) {
            productSizeDetails.push({
              id: sizeId,
              size: sizeDetail.size,
              price: sizeDetail.price,
            });
            productSizeDetails = this.removeDuplicateSizes(productSizeDetails);
          }
        });
      });

      productDetails.productSizeDetails = productSizeDetails;

      this.isLoading = false;
    });
  }

  findSizeIdBySize(size: string) {
    for (let [id, sizeDescription] of this.sizesMap.entries()) {
      if (sizeDescription === size) {
        return id;
      }
    }
    return null;
  }

  // Utility function to remove duplicate sizes
  removeDuplicateSizes(sizes: any[]) {
    const uniqueSizes = sizes.reduce((acc, current) => {
      const x = acc.find((item: any) => item.size === current.size);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    return uniqueSizes;
  }
}
