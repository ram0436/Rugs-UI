import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.css"],
})
export class FiltersComponent implements OnInit {
  products: any[] = [];

  initialItemCount: number = 3;
  showAllMaterials: boolean = false;
  showAllShapes: boolean = false;
  showAllWeavingTechniques: boolean = false;
  showAllStyles: boolean = false;
  showAllPatterns: boolean = false;
  showAllDesigners: boolean = false;
  showAllCollections: boolean = false;
  showAllSizes: boolean = false;
  showAllAvailabilities: boolean = false;

  subCategoryId = 0;

  colors = [
    { id: 1, name: "Red", code: "#FF0000" },
    { id: 2, name: "Green", code: "#00FF00" },
    { id: 3, name: "Blue", code: "#0000FF" },
    { id: 4, name: "Black", code: "#000000" },
    { id: 5, name: "White", code: "#FFFFFF" },
    // Add more as needed
  ];

  discounts = [
    { id: 1, percent: "10%" },
    { id: 2, percent: "20%" },
    { id: 3, percent: "30%" },
    { id: 4, percent: "40%" },
    { id: 5, percent: "50%" },
    // Add more as needed
  ];

  availabilities = [
    { id: 1, name: "Ready to Ship" },
    { id: 2, name: "Made to Order" },
    // Add more as needed
  ];

  sizes = [
    { id: 1, name: "60x90 cm" },
    { id: 2, name: "90x150 cm" },
    { id: 3, name: "120x180 cm" },
    { id: 4, name: "150x240 cm" },
    { id: 5, name: "180x270 cm" },
    // Add more as needed
  ];

  materials = [
    { id: 1, name: "Wool" },
    { id: 2, name: "Wool and Bamboo Silk" },
    { id: 3, name: "Wool and Viscose" },
    { id: 4, name: "Wool and Silk" },
    { id: 5, name: "Jute and Hemp" },
    // Add more as needed
  ];

  priceRanges = [
    { id: 1, name: "Under - $200" },
    { id: 2, name: "$200 - $500" },
    { id: 3, name: "$500 - $1,000" },
    { id: 4, name: "$1,000 - $2,000" },
    { id: 5, name: "$2,000 - $3,000" },
    // Add more as needed
  ];

  shapes = [
    { id: 1, name: "Rectangle" },
    { id: 2, name: "Irregular" },
    { id: 3, name: "Round" },
    { id: 4, name: "Runner" },
    { id: 5, name: "Oval" },
    // Add more as needed
  ];

  weavingTechniques = [
    { id: 1, name: "Hand Knotted" },
    { id: 2, name: "Hand Tufted" },
    { id: 3, name: "Hand Loom" },
    { id: 4, name: "Flat Weaves" },
    { id: 5, name: "Patchwork" },
    // Add more as needed
  ];

  styles = [
    { id: 1, name: "Modern" },
    { id: 2, name: "Traditional" },
    { id: 3, name: "Transitional" },
    // Add more as needed
  ];

  patterns = [
    { id: 1, name: "Abstract" },
    { id: 2, name: "Floral and Tropical" },
    { id: 3, name: "Geometric and Stripes" },
    { id: 4, name: "Graphic and Art Deco" },
    { id: 5, name: "Moroccan and Tribal" },
    // Add more as needed
  ];

  designers = [
    { id: 1, name: "Abin Chaudhary" },
    { id: 2, name: "Amdl Circle" },
    { id: 3, name: "Artemis" },
    { id: 4, name: "Ashiesh Shah" },
    { id: 5, name: "Jocelyn Burton" },
    // Add more as needed
  ];

  collections = [
    { id: 1, name: "Aalam" },
    { id: 2, name: "Abrash" },
    { id: 3, name: "Acar" },
    { id: 4, name: "Alhambra" },
    // Add more as needed
  ];

  parentId: number = 0;
  categoryId: number = 0;
  subMenuName: string = "";

  menuId: number = 0;

  selectedCategories: number[] = [];
  selectedColors: number[] = [];
  selectedBrands: number[] = [];
  selectedDiscount: number[] = [];
  selectedAvailability: number[] = [];
  selectedSizes: number[] = [];
  selectedMaterials: number[] = [];
  selectedPriceRanges: number[] = [];
  selectedShapes: number[] = [];
  selectedWeavingTechniques: number[] = [];
  selectedStyles: number[] = [];
  selectedPatterns: number[] = [];
  selectedDesigners: number[] = [];
  selectedCollections: number[] = [];

  brandsExpanded: boolean = false;
  colorsExpanded: boolean = false;

  brandSearchText: string = "";
  colorSearchText: string = "";

  showAllBrands: boolean = false;
  showAllColors: boolean = false;
  showAllDiscounts: boolean = false;

  allParentCategories: any[] = [];
  allCategories: any[] = [];
  allsubCategories: any[] = [];

  breadcrumb: string = "";

  private allDataLoaded: boolean = false;

  private categorySubcategoriesLoaded: { [key: number]: boolean } = {};

  sliderMin: number = 0;
  sliderMax: number = 5000;
  sliderValue: number = 0;
  sliderMaxValue: number = 5000;
  minValue: number = this.sliderValue;
  maxValue: number = this.sliderMaxValue;
  fromPrice = 0;
  toPrice = 5000;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.parentId = params["parent"];
      if (params["category"] !== undefined)
        this.categoryId = Number(params["category"]);
      if (params["subCategory"] !== undefined)
        this.subCategoryId = Number(params["subCategory"]);
      else this.subCategoryId = 0;

      if (params["category"] !== undefined)
        this.menuId = Number(params["category"]);
    });
  }

  updateSlider() {
    if (this.minValue < this.sliderMin) this.minValue = this.sliderMin;
    if (this.maxValue > this.sliderMax) this.maxValue = this.sliderMax;
    if (this.minValue > this.maxValue) this.minValue = this.maxValue;
    if (this.maxValue < this.minValue) this.maxValue = this.minValue;
    this.sliderValue = this.minValue;
    this.sliderMaxValue = this.maxValue;
  }

  onSliderChange(event: any) {
    const newValue = event.value;
    if (newValue < this.minValue) {
      this.minValue = newValue;
    } else if (newValue > this.maxValue) {
      this.maxValue = newValue;
    }
  }

  toggleBrandsSearch() {
    this.brandsExpanded = !this.brandsExpanded;
  }

  toggleBrand(brandId: number) {
    const index = this.selectedBrands.indexOf(brandId);
    if (index === -1) {
      this.selectedBrands.push(brandId);
    } else {
      this.selectedBrands.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleColorsSearch() {
    this.colorsExpanded = !this.colorsExpanded;
  }

  toggleColor(colorId: number) {
    const index = this.selectedColors.indexOf(colorId);
    if (index === -1) {
      this.selectedColors.push(colorId);
    } else {
      this.selectedColors.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleDiscount(discountId: number) {
    const index = this.selectedDiscount.indexOf(discountId);
    if (index === -1) {
      this.selectedDiscount.push(discountId);
    } else {
      this.selectedDiscount.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleCategory(categoryId: number) {
    const index = this.selectedCategories.indexOf(categoryId);
    if (index === -1) {
      this.selectedCategories.push(categoryId);
    } else {
      this.selectedCategories.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleAvailability(availabilityId: number) {
    const index = this.selectedAvailability.indexOf(availabilityId);
    if (index === -1) {
      this.selectedAvailability.push(availabilityId);
    } else {
      this.selectedAvailability.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleSize(sizeId: number) {
    const index = this.selectedSizes.indexOf(sizeId);
    if (index === -1) {
      this.selectedSizes.push(sizeId);
    } else {
      this.selectedSizes.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleMaterial(materialId: number) {
    const index = this.selectedMaterials.indexOf(materialId);
    if (index === -1) {
      this.selectedMaterials.push(materialId);
    } else {
      this.selectedMaterials.splice(index, 1);
    }
    this.applyFilters();
  }

  togglePriceRange(priceRangeId: number) {
    const index = this.selectedPriceRanges.indexOf(priceRangeId);
    if (index === -1) {
      this.selectedPriceRanges.push(priceRangeId);
    } else {
      this.selectedPriceRanges.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleShape(shapeId: number) {
    const index = this.selectedShapes.indexOf(shapeId);
    if (index === -1) {
      this.selectedShapes.push(shapeId);
    } else {
      this.selectedShapes.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleWeavingTechnique(techniqueId: number) {
    const index = this.selectedWeavingTechniques.indexOf(techniqueId);
    if (index === -1) {
      this.selectedWeavingTechniques.push(techniqueId);
    } else {
      this.selectedWeavingTechniques.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleStyle(styleId: number) {
    const index = this.selectedStyles.indexOf(styleId);
    if (index === -1) {
      this.selectedStyles.push(styleId);
    } else {
      this.selectedStyles.splice(index, 1);
    }
    this.applyFilters();
  }

  togglePattern(patternId: number) {
    const index = this.selectedPatterns.indexOf(patternId);
    if (index === -1) {
      this.selectedPatterns.push(patternId);
    } else {
      this.selectedPatterns.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleDesigner(designerId: number) {
    const index = this.selectedDesigners.indexOf(designerId);
    if (index === -1) {
      this.selectedDesigners.push(designerId);
    } else {
      this.selectedDesigners.splice(index, 1);
    }
    this.applyFilters();
  }

  toggleCollection(collectionId: number) {
    const index = this.selectedCollections.indexOf(collectionId);
    if (index === -1) {
      this.selectedCollections.push(collectionId);
    } else {
      this.selectedCollections.splice(index, 1);
    }
    this.applyFilters();
  }

  resetFilters() {
    this.selectedCategories = [];
    this.selectedColors = [];
    this.selectedBrands = [];
    this.selectedDiscount = [];
    this.selectedAvailability = [];
    this.selectedSizes = [];
    this.selectedMaterials = [];
    this.selectedPriceRanges = [];
    this.selectedShapes = [];
    this.selectedWeavingTechniques = [];
    this.selectedStyles = [];
    this.selectedPatterns = [];
    this.selectedDesigners = [];
    this.selectedCollections = [];
    this.applyFilters();
  }

  showMoreItems(filterType: string) {
    switch (filterType) {
      case "availabilities":
        this.showAllAvailabilities = true;
        break;
      case "colors":
        this.showAllColors = true;
        break;
      case "sizes":
        this.showAllSizes = true;
        break;
      case "materials":
        this.showAllMaterials = true;
        break;
      case "shapes":
        this.showAllShapes = true;
        break;
      case "weavingTechniques":
        this.showAllWeavingTechniques = true;
        break;
      case "styles":
        this.showAllStyles = true;
        break;
      case "patterns":
        this.showAllPatterns = true;
        break;
      case "designers":
        this.showAllDesigners = true;
        break;
      case "collections":
        this.showAllCollections = true;
        break;
      default:
        break;
    }
  }

  showLessItems(filterType: string) {
    switch (filterType) {
      case "availabilities":
        this.showAllAvailabilities = false;
        break;
      case "colors":
        this.showAllColors = false;
        break;
      case "sizes":
        this.showAllSizes = false;
        break;
      case "materials":
        this.showAllMaterials = false;
        break;
      case "shapes":
        this.showAllShapes = false;
        break;
      case "weavingTechniques":
        this.showAllWeavingTechniques = false;
        break;
      case "styles":
        this.showAllStyles = false;
        break;
      case "patterns":
        this.showAllPatterns = false;
        break;
      case "designers":
        this.showAllDesigners = false;
        break;
      case "collections":
        this.showAllCollections = false;
        break;
      default:
        break;
    }
  }

  shouldShowShowMoreLink(items: any[], filterType: string): boolean {
    switch (filterType) {
      case "availabilities":
        return (
          !this.showAllAvailabilities && items.length > this.initialItemCount
        );
      case "colors":
        return !this.showAllColors && items.length > this.initialItemCount;
      case "sizes":
        return !this.showAllSizes && items.length > this.initialItemCount;
      case "materials":
        return !this.showAllMaterials && items.length > this.initialItemCount;
      case "shapes":
        return !this.showAllShapes && items.length > this.initialItemCount;
      case "weavingTechniques":
        return (
          !this.showAllWeavingTechniques && items.length > this.initialItemCount
        );
      case "styles":
        return !this.showAllStyles && items.length > this.initialItemCount;
      case "patterns":
        return !this.showAllPatterns && items.length > this.initialItemCount;
      case "designers":
        return !this.showAllDesigners && items.length > this.initialItemCount;
      case "collections":
        return !this.showAllCollections && items.length > this.initialItemCount;
      default:
        return false;
    }
  }

  shouldShowShowLessLink(filterType: string): boolean {
    switch (filterType) {
      case "availabilities":
        return this.showAllAvailabilities;
      case "colors":
        return this.showAllColors;
      case "sizes":
        return this.showAllSizes;
      case "materials":
        return this.showAllMaterials;
      case "shapes":
        return this.showAllShapes;
      case "weavingTechniques":
        return this.showAllWeavingTechniques;
      case "styles":
        return this.showAllStyles;
      case "patterns":
        return this.showAllPatterns;
      case "designers":
        return this.showAllDesigners;
      case "collections":
        return this.showAllCollections;
      default:
        return false;
    }
  }

  applyFilters() {
    // this.productService.getFilteredProducts({
    //   categories: this.selectedCategories,
    //   colors: this.selectedColors,
    //   brands: this.selectedBrands,
    //   discounts: this.selectedDiscount,
    //   availability: this.selectedAvailability,
    //   sizes: this.selectedSizes,
    //   materials: this.selectedMaterials,
    //   priceRanges: this.selectedPriceRanges,
    //   shapes: this.selectedShapes,
    //   weavingTechniques: this.selectedWeavingTechniques,
    //   styles: this.selectedStyles,
    //   patterns: this.selectedPatterns,
    //   designers: this.selectedDesigners,
    //   collections: this.selectedCollections,
    // }).subscribe((data) => {
    //   this.products = data;
    //   // Additional logic after fetching filtered products
    // });
  }
}
