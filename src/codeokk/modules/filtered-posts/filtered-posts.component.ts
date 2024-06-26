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
    this.masterService.getData().subscribe((filters: any) => {
      this.filterProducts(filters);
    });
  }

  filterProducts(filters: any) {
    let filteredProducts = [...this.originalProducts];

    // Filter by color
    if (filters.selectedColors.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.color.some((c: any) => filters.selectedColors.includes(c.id))
      );
    }

    // Filter by discount
    if (filters.selectedDiscounts.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.discount.some((d: any) =>
          filters.selectedDiscounts.includes(d.id)
        )
      );
    }

    if (filters.selectedSizes.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.productSizeList.some((size: any) =>
          filters.selectedSizes.includes(size.size)
        )
      );
    }

    // Filter by price range
    if (filters.selectedPriceRanges.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.priceRange.some((d: any) =>
          filters.selectedPriceRanges.includes(d.id)
        )
      );
    }

    // Filter by room
    if (filters.selectedRooms.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.room.some((d: any) => filters.selectedRooms.includes(d.id))
      );
    }

    // Filter by pattern
    if (filters.selectedPatterns.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.pattern.some((d: any) =>
          filters.selectedPatterns.includes(d.id)
        )
      );
    }

    // Filter by collection
    if (filters.selectedCollections.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.collection.some((d: any) =>
          filters.selectedCollections.includes(d.id)
        )
      );
    }

    // Filter by weaving technique
    if (filters.selectedWeavingTechniques.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.weavingTechnique.some((d: any) =>
          filters.selectedWeavingTechniques.includes(d.id)
        )
      );
    }

    // Filter by shape
    if (filters.selectedShapes.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.shape.some((d: any) => filters.selectedShapes.includes(d.id))
      );
    }

    // Filter by materials
    if (filters.selectedMaterials.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        product.material.some((d: any) =>
          filters.selectedMaterials.includes(d.id)
        )
      );
    }

    this.products = filteredProducts;
    this.isLoading = false;
  }

  getProducts() {
    this.productService.getAllProducts().subscribe((res) => {
      this.originalProducts = [...res];
      this.products = res;
      // this.products.forEach((product) => {
      //   this.fetchSizeDetails(product);
      // });
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
