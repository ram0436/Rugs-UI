import { Component, ElementRef, HostListener, Renderer2 } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  isHovered = false;

  isSearchActive: boolean = false;
  isCartActive: boolean = false;

  isActive = false;

  isScrolledDown: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

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

  toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
  }

  toggleActive(state: boolean) {
    this.isActive = state;
  }

  toggleCart() {
    this.isCartActive = !this.isCartActive;
  }
}
