import { Component, ViewChild, ElementRef, HostListener } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent {
  isHovered: boolean = false;

  @ViewChild("scrollContainer", { static: true }) scrollContainer!: ElementRef;

  isDragging: boolean = false;
  startX: number = 0;
  scrollLeft: number = 0;

  showLeftArrow: boolean = false;
  showRightArrow: boolean = true;

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

  @HostListener("mouseleave")
  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }
}
