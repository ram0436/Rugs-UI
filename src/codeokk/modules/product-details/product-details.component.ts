import { Component, Renderer2 } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { UserService } from "../user/service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { MasterService } from "../service/master.service";
import { forkJoin } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"],
})
export class ProductDetailsComponent {
  activeSection: string = "Details";
  productDetails: any = [];

  sizesMap: Map<number, string> = new Map();
  sizes: any[] = [];

  isLoading: boolean = true;

  selectedLargeImageUrl: string = "";

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private masterService: MasterService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    var productCode;
    this.route.paramMap.subscribe((params) => {
      productCode = params.get("id");
    });
    if (productCode != null) {
      this.getPostDetails(productCode);
    }
  }

  updateLargeImageUrl(imageUrl: string) {
    this.selectedLargeImageUrl = imageUrl;
  }

  getPostDetails(code: any) {
    this.productService.getProductByProductCode(code).subscribe((res: any) => {
      if (res && res.description) {
        res.description = res.description.replace(/\n/g, "<br/>");
      }
      this.productDetails = res[0];

      this.isLoading = false;

      if (
        this.productDetails.productImageList &&
        this.productDetails.productImageList.length > 0
      ) {
        this.selectedLargeImageUrl =
          this.productDetails.productImageList[0].imageURL;
      }

      // Ensure all sizes are fetched before proceeding
      this.getAllProductSizes();
      this.fetchSizeDetails(this.productDetails.productSizeMappingList);
    });
  }

  getAllProductSizes() {
    this.masterService.getAllProductSize().subscribe((res: any) => {
      this.sizes = res;
      this.sizesMap = this.createSizeMap(res);
    });
  }

  createSizeMap(sizes: any[]) {
    const map = new Map();
    sizes.forEach((size: any) => {
      map.set(size.id, size.size);
    });
    return map;
  }

  // Function to fetch size details and update product details
  fetchSizeDetails(sizeMappingList: any[]) {
    if (sizeMappingList) {
      const sizeDetailRequests = sizeMappingList.map((mapping) =>
        this.productService.getProductSizebyProductId(mapping.productId)
      );

      forkJoin(sizeDetailRequests).subscribe((responses: any[]) => {
        this.productDetails.productSize = [];

        responses.forEach((sizeDetailsArray, index) => {
          const productId = sizeMappingList[index].productId;
          const productSizeId = sizeMappingList[index].productSizeId;

          const sizes = sizeDetailsArray.map((sizeDetail: any) => {
            const sizeId = this.findSizeIdBySize(sizeDetail.size);
            return {
              size: sizeDetail.size,
              price: sizeDetail.price,
              id: sizeId || null,
            };
          });

          this.productDetails.productSize = [
            ...this.productDetails.productSize,
            ...sizes,
          ];
        });

        this.productDetails.productSize = this.removeDuplicateSizes(
          this.productDetails.productSize
        );
        console.log(this.productDetails);
      });
    }
  }

  // Utility function to find size ID by size description
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

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  onMouseEnter(event: MouseEvent) {
    const img = event.target as HTMLImageElement;
    img.style.setProperty("--zoom", "4.5");
  }

  onMouseMove(event: MouseEvent) {
    const img = event.target as HTMLImageElement;
    const rect = img.getBoundingClientRect();

    if (rect) {
      const x = rect.left;
      const y = rect.top;
      const width = rect.width;
      const height = rect.height;

      const horizontal = ((event.clientX - x) / width) * 100;
      const vertical = ((event.clientY - y) / height) * 100;

      img.style.setProperty("--x", `${horizontal}%`);
      img.style.setProperty("--y", `${vertical}%`);
    }
  }

  onMouseLeave(event: MouseEvent) {
    const img = event.target as HTMLImageElement;
    img.style.setProperty("--zoom", "1");
  }
}
