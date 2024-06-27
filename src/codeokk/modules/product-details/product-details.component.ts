import {
  Component,
  ElementRef,
  HostListener,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { UserService } from "../user/service/user.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { MasterService } from "../service/master.service";
import { Observable, forkJoin } from "rxjs";
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

  similarProducts: any[] = [];

  isHovered: boolean = false;

  @ViewChild("scrollContainer", { static: false }) scrollContainer!: ElementRef;

  isDragging: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;

  showLeftArrow: boolean = false;
  showRightArrow: boolean = true;

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
    this.getProducts();
    if (productCode != null) {
      this.getPostDetails(productCode);
    }
  }

  startDrag(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.pageX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
  }

  stopDrag(): void {
    this.isDragging = false;
  }

  ngAfterViewInit(): void {
    this.checkArrows();
  }

  scrollToRight(): void {
    const container = this.scrollContainer.nativeElement;
    const containerWidth = container.offsetWidth;
    this.smoothScroll(container.scrollLeft + containerWidth, "right");
  }

  scrollToLeft(): void {
    const container = this.scrollContainer.nativeElement;
    const containerWidth = container.offsetWidth;
    this.smoothScroll(container.scrollLeft - containerWidth, "left");
  }

  smoothScroll(target: number, direction: "left" | "right"): void {
    const container = this.scrollContainer.nativeElement;
    const start = container.scrollLeft;
    const distance = target - start;
    const duration = 600; // Duration of the scroll in milliseconds
    const ease = (t: number) => t * (2 - t); // Easing function (ease-out)

    let startTime: number | null = null;

    const animateScroll = (time: number) => {
      if (startTime === null) startTime = time;
      const timeElapsed = time - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = ease(progress);
      container.scrollLeft = start + distance * easeProgress;

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        this.checkArrows();
      }
    };

    requestAnimationFrame(animateScroll);
  }

  checkArrows(): void {
    const container = this.scrollContainer.nativeElement;
    this.showLeftArrow = container.scrollLeft > 0;
    this.showRightArrow =
      container.scrollLeft + container.offsetWidth < container.scrollWidth;
  }

  @HostListener("mousemove", ["$event"])
  onDrag(event: MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    const x = event.pageX - this.scrollContainer.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 2; // Adjust the scrolling speed as necessary
    this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  updateLargeImageUrl(imageUrl: string) {
    this.selectedLargeImageUrl = imageUrl;
  }

  getProducts() {
    this.productService.getAllProducts().subscribe((res) => {
      this.similarProducts = res;
      this.similarProducts.forEach((product) => {
        this.fetchSimilarSizeDetails(product);
      });
      this.isLoading = false;
    });
  }

  fetchSizeDetailsGeneral(
    sizeMappingList: any[],
    updateProductDetailsCallback: (
      productDetails: any,
      sizeDetails: any
    ) => void,
    productDetails: any
  ) {
    if (sizeMappingList) {
      const sizeDetailRequests = sizeMappingList.map((mapping) =>
        this.productService.getProductSizebyProductId(mapping.productId)
      );

      forkJoin(sizeDetailRequests).subscribe((responses: any[]) => {
        const allSizeDetails: any[] = [];

        responses.forEach((sizeDetailsArray, index) => {
          const mapping = sizeMappingList[index];

          const sizes = sizeDetailsArray.map((sizeDetail: any) => {
            const sizeId = this.findSizeIdBySize(sizeDetail.size);
            return {
              size: sizeDetail.size,
              price: sizeDetail.price,
              id: sizeId || null,
            };
          });

          allSizeDetails.push(...sizes);
        });

        const uniqueSizeDetails = this.removeDuplicateSizes(allSizeDetails);

        updateProductDetailsCallback(productDetails, uniqueSizeDetails);
      });
    }
  }

  fetchSimilarSizeDetails(productDetails: any) {
    this.fetchSizeDetailsGeneral(
      productDetails.productSizeMappingList,
      (productDetails, sizeDetails) => {
        productDetails.productSizeDetails = sizeDetails;
      },
      productDetails
    );
  }

  // fetchSimilarSizeDetails(productDetails: any) {
  //   const sizeDetailRequests: Observable<any[]>[] =
  //     productDetails.productSizeMappingList.map((mapping: any) =>
  //       this.productService.getProductSizebyProductId(mapping.productId)
  //     );

  //   forkJoin(sizeDetailRequests).subscribe((responses: any[]) => {
  //     let productSizeDetails: any[] = [];

  //     responses.forEach((sizeDetailsArray, index) => {
  //       const mapping = productDetails.productSizeMappingList[index];
  //       sizeDetailsArray.forEach((sizeDetail: any) => {
  //         const sizeId = this.findSizeIdBySize(sizeDetail.size);

  //         const existingSize = productSizeDetails.find(
  //           (item) => item.size === sizeDetail.size
  //         );

  //         if (!existingSize) {
  //           productSizeDetails.push({
  //             id: sizeId,
  //             size: sizeDetail.size,
  //             price: sizeDetail.price,
  //           });
  //           productSizeDetails = this.removeDuplicateSizes(productSizeDetails);
  //         }
  //       });
  //     });

  //     productDetails.productSizeDetails = productSizeDetails;

  //     this.isLoading = false;
  //   });
  // }

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

  // Refactored fetchSizeDetails function
  fetchSizeDetails(sizeMappingList: any[]) {
    this.fetchSizeDetailsGeneral(
      sizeMappingList,
      (productDetails, sizeDetails) => {
        productDetails.productSize = sizeDetails;
      },
      this.productDetails
    );
  }

  // fetchSizeDetails(sizeMappingList: any[]) {
  //   if (sizeMappingList) {
  //     const sizeDetailRequests = sizeMappingList.map((mapping) =>
  //       this.productService.getProductSizebyProductId(mapping.productId)
  //     );

  //     forkJoin(sizeDetailRequests).subscribe((responses: any[]) => {
  //       this.productDetails.productSize = [];

  //       responses.forEach((sizeDetailsArray, index) => {
  //         const productId = sizeMappingList[index].productId;
  //         const productSizeId = sizeMappingList[index].productSizeId;

  //         const sizes = sizeDetailsArray.map((sizeDetail: any) => {
  //           const sizeId = this.findSizeIdBySize(sizeDetail.size);
  //           return {
  //             size: sizeDetail.size,
  //             price: sizeDetail.price,
  //             id: sizeId || null,
  //           };
  //         });

  //         this.productDetails.productSize = [
  //           ...this.productDetails.productSize,
  //           ...sizes,
  //         ];
  //       });

  //       this.productDetails.productSize = this.removeDuplicateSizes(
  //         this.productDetails.productSize
  //       );
  //     });
  //   }
  // }

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
