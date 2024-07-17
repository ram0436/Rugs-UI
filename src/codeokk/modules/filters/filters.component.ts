import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MasterService } from "../service/master.service";
import { ProductService } from "src/codeokk/shared/service/product.service";

@Component({
  selector: "app-filters",
  templateUrl: "./filters.component.html",
  styleUrls: ["./filters.component.css"],
})
export class FiltersComponent implements OnInit {
  @Input() products: any[] = [];

  initialItemCount: number = 5;
  showAllMaterials: boolean = false;
  showAllShapes: boolean = false;
  showAllWeavingTechniques: boolean = false;
  showAllStyles: boolean = false;
  showAllPatterns: boolean = false;
  showAllDesigners: boolean = false;
  showAllCollections: boolean = false;
  showAllSizes: boolean = false;
  showAllAvailabilities: boolean = false;
  showAllPrices: boolean = false;
  showAllRooms: boolean = false;

  subCategoryId = 0;

  colors: any[] = [];
  prices: any[] = [];
  discount: any = [];
  sizes: any[] = [];
  materials: any[] = [];
  priceRanges: any[] = [];
  shapes: any[] = [];
  weavingTechniques: any[] = [];
  patterns: any[] = [];
  collections: any[] = [];
  rooms: any[] = [];

  availabilities = [
    { id: 1, name: "Ready to Ship" },
    { id: 2, name: "Made to Order" },
    // Add more as needed
  ];

  styles = [
    { id: 1, name: "Modern" },
    { id: 2, name: "Traditional" },
    { id: 3, name: "Transitional" },
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

  parentId: number = 0;
  categoryId: number = 0;
  subMenuName: string = "";

  menuId: number = 0;

  selectedCategories: number[] = [];
  selectedColors: number[] = [];
  selectedBrands: number[] = [];
  selectedDiscount: number[] = [];
  selectedAvailability: number[] = [];
  selectedSizes: any[] = [];
  selectedMaterials: number[] = [];
  selectedPriceRanges: number[] = [];
  selectedShapes: number[] = [];
  selectedWeavingTechniques: number[] = [];
  selectedStyles: number[] = [];
  selectedPatterns: number[] = [];
  selectedDesigners: number[] = [];
  selectedCollections: number[] = [];
  selectedPrices: number[] = [];
  selectedRooms: number[] = [];

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

  constructor(
    private route: ActivatedRoute,
    private masterService: MasterService,
    private productService: ProductService
  ) {}

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes["products"]) {
  //     this.updateFiltersBasedOnProducts();
  //   }
  // }

  ngOnInit() {
    this.masterService.colors$.subscribe((data) => (this.colors = data));
    this.masterService.sizes$.subscribe((data) => (this.sizes = data));
    this.masterService.discounts$.subscribe((data) => (this.discount = data));
    this.masterService.materials$.subscribe((data) => (this.materials = data));
    this.masterService.collections$.subscribe(
      (data) => (this.collections = data)
    );
    this.masterService.shapes$.subscribe((data) => (this.shapes = data));
    this.masterService.patterns$.subscribe((data) => (this.patterns = data));
    this.masterService.priceRanges$.subscribe(
      (data) => (this.priceRanges = data)
    );
    this.masterService.rooms$.subscribe((data) => (this.rooms = data));
    this.masterService.weavingTechniques$.subscribe(
      (data) => (this.weavingTechniques = data)
    );

    this.masterService.fetchData();

    // this.updateFiltersBasedOnProducts();
    this.route.queryParams.subscribe((params) => {
      if (params["priceRange"]) {
        this.selectedPriceRanges = [Number(params["priceRange"])];
      } else {
        this.selectedPriceRanges = [];
      }
      if (params["room"]) {
        this.selectedRooms = [Number(params["room"])];
      } else {
        this.selectedRooms = [];
      }
      if (params["material"]) {
        this.selectedMaterials = [Number(params["material"])];
      } else {
        this.selectedMaterials = [];
      }
      if (params["weavingTechnique"]) {
        this.selectedWeavingTechniques = [Number(params["weavingTechnique"])];
      } else {
        this.selectedWeavingTechniques = [];
      }
      if (params["patternRange"]) {
        this.selectedPatterns = [Number(params["patternRange"])];
      } else {
        this.selectedPatterns = [];
      }
      if (params["color"]) {
        this.selectedColors = [Number(params["color"])];
      } else {
        this.selectedColors = [];
      }
      if (params["shape"]) {
        this.selectedShapes = [Number(params["shape"])];
      } else {
        this.selectedShapes = [];
      }
      if (params["size"]) {
        this.selectedSizes = [Number(params["size"])];
      } else {
        this.selectedSizes = [];
      }
      if (params["collection"]) {
        this.selectedCollections = [Number(params["collection"])];
      } else {
        this.selectedCollections = [];
      }
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
    // const index = this.selectedBrands.indexOf(brandId);
    // if (index === -1) {
    //   this.selectedBrands.push(brandId);
    // } else {
    //   this.selectedBrands.splice(index, 1);
    // }
    if (this.selectedBrands.includes(brandId)) {
      this.selectedBrands = [];
    } else {
      this.selectedBrands = [brandId];
    }
    this.applyFilters();
  }

  toggleColorsSearch() {
    this.colorsExpanded = !this.colorsExpanded;
  }

  toggleColor(colorId: number) {
    // const index = this.selectedColors.indexOf(colorId);
    // if (index === -1) {
    //   this.selectedColors.push(colorId);
    // } else {
    //   this.selectedColors.splice(index, 1);
    // }
    if (this.selectedColors.includes(colorId)) {
      this.selectedColors = [];
    } else {
      this.selectedColors = [colorId];
    }
    this.applyFilters();
  }

  togglePrice(priceId: number) {
    // const index = this.selectedPriceRanges.indexOf(priceId);
    // if (index === -1) {
    //   this.selectedPriceRanges.push(priceId);
    // } else {
    //   this.selectedPriceRanges.splice(index, 1);
    // }
    if (this.selectedPriceRanges.includes(priceId)) {
      this.selectedPriceRanges = [];
    } else {
      this.selectedPriceRanges = [priceId];
    }
    this.applyFilters();
  }

  toggleDiscount(discountId: number) {
    // const index = this.selectedDiscount.indexOf(discountId);
    // if (index === -1) {
    //   this.selectedDiscount.push(discountId);
    // } else {
    //   this.selectedDiscount.splice(index, 1);
    // }
    if (this.selectedDiscount.includes(discountId)) {
      this.selectedDiscount = [];
    } else {
      this.selectedDiscount = [discountId];
    }
    this.applyFilters();
  }

  toggleCategory(categoryId: number) {
    // const index = this.selectedCategories.indexOf(categoryId);
    // if (index === -1) {
    //   this.selectedCategories.push(categoryId);
    // } else {
    //   this.selectedCategories.splice(index, 1);
    // }
    if (this.selectedCategories.includes(categoryId)) {
      this.selectedCategories = [];
    } else {
      this.selectedCategories = [categoryId];
    }
    this.applyFilters();
  }

  toggleAvailability(availabilityId: number) {
    // const index = this.selectedAvailability.indexOf(availabilityId);
    // if (index === -1) {
    //   this.selectedAvailability.push(availabilityId);
    // } else {
    //   this.selectedAvailability.splice(index, 1);
    // }
    if (this.selectedAvailability.includes(availabilityId)) {
      this.selectedAvailability = [];
    } else {
      this.selectedAvailability = [availabilityId];
    }
    this.applyFilters();
  }

  toggleSize(sizeId: number, event: Event) {
    // const isChecked = (event.target as HTMLInputElement).checked;
    // const index = this.selectedSizes.indexOf(sizeId);
    // if (index === -1) {
    //   this.selectedSizes.push(sizeId);
    // } else {
    //   this.selectedSizes.splice(index, 1);
    // }
    if (this.selectedSizes.includes(sizeId)) {
      this.selectedSizes = [];
    } else {
      this.selectedSizes = [sizeId];
    }
    this.applyFilters();

    // if (isChecked) {
    //   if (!this.selectedSizes.includes(size)) {
    //     this.selectedSizes.push(size);
    //   }
    // } else {
    //   const index = this.selectedSizes.indexOf(size);
    //   if (index !== -1) {
    //     this.selectedSizes.splice(index, 1);
    //   }
    // }
    // this.applyFilters();
  }

  toggleMaterial(materialId: number) {
    // const index = this.selectedMaterials.indexOf(materialId);
    // if (index === -1) {
    //   this.selectedMaterials.push(materialId);
    // } else {
    //   this.selectedMaterials.splice(index, 1);
    // }
    if (this.selectedMaterials.includes(materialId)) {
      this.selectedMaterials = [];
    } else {
      this.selectedMaterials = [materialId];
    }
    this.applyFilters();
  }

  toggleRoom(roomId: number) {
    // const index = this.selectedRooms.indexOf(roomId);
    // if (index === -1) {
    //   this.selectedRooms.push(roomId);
    // } else {
    //   this.selectedRooms.splice(index, 1);
    // }
    if (this.selectedRooms.includes(roomId)) {
      this.selectedRooms = [];
    } else {
      this.selectedRooms = [roomId];
    }
    this.applyFilters();
  }

  togglePriceRange(priceRangeId: number) {
    // const index = this.selectedPriceRanges.indexOf(priceRangeId);
    // if (index === -1) {
    //   this.selectedPriceRanges.push(priceRangeId);
    // } else {
    //   this.selectedPriceRanges.splice(index, 1);
    // }
    if (this.selectedPriceRanges.includes(priceRangeId)) {
      this.selectedPriceRanges = [];
    } else {
      this.selectedPriceRanges = [priceRangeId];
    }
    this.applyFilters();
  }

  toggleShape(shapeId: number) {
    // const index = this.selectedShapes.indexOf(shapeId);
    // if (index === -1) {
    //   this.selectedShapes.push(shapeId);
    // } else {
    //   this.selectedShapes.splice(index, 1);
    // }
    if (this.selectedShapes.includes(shapeId)) {
      this.selectedShapes = [];
    } else {
      this.selectedShapes = [shapeId];
    }
    this.applyFilters();
  }

  toggleWeavingTechnique(techniqueId: number) {
    // const index = this.selectedWeavingTechniques.indexOf(techniqueId);
    // if (index === -1) {
    //   this.selectedWeavingTechniques.push(techniqueId);
    // } else {
    //   this.selectedWeavingTechniques.splice(index, 1);
    // }
    if (this.selectedWeavingTechniques.includes(techniqueId)) {
      this.selectedWeavingTechniques = [];
    } else {
      this.selectedWeavingTechniques = [techniqueId];
    }
    this.applyFilters();
  }

  toggleStyle(styleId: number) {
    // const index = this.selectedStyles.indexOf(styleId);
    // if (index === -1) {
    //   this.selectedStyles.push(styleId);
    // } else {
    //   this.selectedStyles.splice(index, 1);
    // }
    if (this.selectedStyles.includes(styleId)) {
      this.selectedStyles = [];
    } else {
      this.selectedStyles = [styleId];
    }
    this.applyFilters();
  }

  togglePattern(patternId: number) {
    // const index = this.selectedPatterns.indexOf(patternId);
    // if (index === -1) {
    //   this.selectedPatterns.push(patternId);
    // } else {
    //   this.selectedPatterns.splice(index, 1);
    // }
    if (this.selectedPatterns.includes(patternId)) {
      this.selectedPatterns = [];
    } else {
      this.selectedPatterns = [patternId];
    }
    this.applyFilters();
  }

  toggleDesigner(designerId: number) {
    // const index = this.selectedDesigners.indexOf(designerId);
    // if (index === -1) {
    //   this.selectedDesigners.push(designerId);
    // } else {
    //   this.selectedDesigners.splice(index, 1);
    // }
    if (this.selectedDesigners.includes(designerId)) {
      this.selectedDesigners = [];
    } else {
      this.selectedDesigners = [designerId];
    }
    this.applyFilters();
  }

  toggleCollection(collectionId: number) {
    // const index = this.selectedCollections.indexOf(collectionId);
    // if (index === -1) {
    //   this.selectedCollections.push(collectionId);
    // } else {
    //   this.selectedCollections.splice(index, 1);
    // }
    if (this.selectedCollections.includes(collectionId)) {
      this.selectedCollections = [];
    } else {
      this.selectedCollections = [collectionId];
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
      case "prices":
        this.showAllPrices = true;
        break;
      case "rooms":
        this.showAllRooms = true;
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
      case "prices":
        this.showAllPrices = false;
        break;
      case "rooms":
        this.showAllRooms = false;
        break;
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
      case "prices":
        return !this.showAllPrices && items.length > this.initialItemCount;
      case "availabilities":
        return (
          !this.showAllAvailabilities && items.length > this.initialItemCount
        );
      case "colors":
        return !this.showAllColors && items.length > this.initialItemCount;
      case "rooms":
        return !this.showAllRooms && items.length > this.initialItemCount;
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
      case "prices":
        return this.showAllPrices;
      case "rooms":
        return this.showAllRooms;
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
    this.masterService.setData({
      selectedColors: this.selectedColors,
      selectedDiscounts: this.selectedDiscount,
      selectedSizes: this.selectedSizes,
      selectedMaterials: this.selectedMaterials,
      selectedPriceRanges: this.selectedPriceRanges,
      selectedShapes: this.selectedShapes,
      selectedWeavingTechniques: this.selectedWeavingTechniques,
      selectedPatterns: this.selectedPatterns,
      selectedCollections: this.selectedCollections,
      selectedRooms: this.selectedRooms,
    });
  }
}
