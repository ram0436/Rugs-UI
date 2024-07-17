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

  similarProductsLoaded: boolean = false;

  @ViewChild("scrollContainer", { static: false }) scrollContainer!: ElementRef;

  @ViewChild("entryPointContainer", { static: false })
  entryPointContainer!: ElementRef;

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
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    var productCode;
    this.route.paramMap.subscribe((params) => {
      productCode = params.get("id");
    });
    // this.getProducts();
    if (productCode != null) {
      this.getPostDetails(productCode);
    }
  }

  // ngAfterViewInit(): void {
  //   this.loadWizartScript();
  // }

  loadWizartScript() {
    this.productService
      .loadScript(
        "https://d35so7k19vd0fx.cloudfront.net/production/integration/entry-point.min.js"
      )
      .then(() => {
        const entryPoint = new (window as any).WEntryPoint({
          token: "your token for wizart",
          element: document.getElementById("wizart-btn"),
          vendorCode: "Rug1",
          articleQuery: JSON.stringify({
            vendor_code: "Rug1",
            collection_name: "Rug",
          }),
        });
        entryPoint.render({
          title: "Try in Your Room",
          fontSize: "16px",
          className: "wizart-main-page",
          background: "#f8f8f8",
          color: "#000",
          width: "230px",
          height: "50px",
        });
      })
      .catch((err) => {
        console.error("Error loading script:", err);
      });
  }

  startDrag(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.pageX - this.scrollContainer.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
  }

  stopDrag(): void {
    this.isDragging = false;
  }

  // ngAfterViewInit(): void {
  //   this.checkArrows();
  // }

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
      this.loadWizartScript();
    });
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
