import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { DOCUMENT, DatePipe } from "@angular/common";
import { FormControl } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MasterService } from "src/codeokk/modules/service/master.service";
import { ProductService } from "src/codeokk/shared/service/product.service";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Observable, forkJoin, startWith } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { UserService } from "src/codeokk/modules/user/service/user.service";
import { Common } from "src/codeokk/shared/model/CommonPayload";
import { map } from "rxjs/operators";

interface Brand {
  id: number;
  name: string;
}

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
  providers: [DatePipe],
})
export class AdminDashboardComponent {
  productPayload: Common = new Common();
  cardsCount: any[] = new Array(20);
  showCategories = false;
  showBrands = false;
  showColors = false;
  showProduct = true;
  showOrders: boolean = false;
  showDeleteCategories: boolean = false;

  parentCategories: any[] = [];
  categories: any[] = [];
  subCategories: any[] = [];

  products: any[] = [];
  colors: any[] = [];
  discounts: any[] = [];
  sizes: any[] = [];
  brands: any[] = [];
  selectedDiscountId: number | null = null;

  parentCategory: string = "";
  category: string = "";
  parentCategoryId: number = 0;
  subParentCategoryId: number = 0;
  subcategory: string = "";
  categoryId: number = 0;

  brandSubCategories: any[] = [];

  brandName: string = "";
  brandCategoryId: number = 0;
  colorName: string = "";
  colorCode: string = "";

  selectedSection: string = "categories";

  numericValue: number = 0;
  isInputFocused: boolean = false;
  firstImageUploaded: boolean = false;
  imageProgress: boolean = false;

  productName: string = "";
  productDescription: string = "";
  productSubCategoryId: number = 0;
  productCategoryId: number = 0;
  productParentCategoryId: number = 0;
  productBrandId: number = 0;
  productColorId: number = 0;
  productCode: string = "";
  productSizeId: number = 0;
  productPrice: number = 0;
  tags: any = [];
  tagCtrl = new FormControl("");
  separatorKeysCodes: number[] = [ENTER, COMMA];

  activeMainOption: string = "productEntry";

  brandCtrl = new FormControl();
  filteredBrands!: Observable<Brand[]>;

  product: any = [];

  code: string = "";
  editRoute: boolean = false;
  payload: any = [];

  categoryMap: { [key: number]: any[] } = {};
  subCategoryMap: { [key: number]: any[] } = {};

  selectedParentCategories: number[] = [];
  selectedCategories: number[] = [];
  selectedSubCategories: number[] = [];

  expandedCategories: { [key: number]: boolean } = {};

  selectedProductSizeIds: number[] = [];

  prices: any[] = [];
  discount: any = [];
  materials: any[] = [];
  priceRanges: any[] = [];
  shapes: any[] = [];
  weavingTechniques: any[] = [];
  patterns: any[] = [];
  collections: any[] = [];
  rooms: any[] = [];

  constructor(
    private masterService: MasterService,
    private snackBar: MatSnackBar,
    private productService: ProductService,
    private router: Router,
    private datePipe: DatePipe,
    private userService: UserService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params["editProduct"]) {
        this.toggleSection("product");
      }
    });

    this.getAllColors();
    this.getAllDiscounts();
    this.getAllProductSizes();
    this.getAllMaterials();
    this.getAllCollections();
    this.getAllShapes();
    this.getAllPatterns();
    this.getAllPriceRanges();
    this.getAllRooms();
    this.getAllWeaingTechniques();
    for (var i = 0; i < this.cardsCount.length; i++) {
      this.cardsCount[i] = "";
    }
    // this.getAllParentCategories();
    // this.getAllBrands();
    // forkJoin({
    //   brands: this.getAllBrands(),
    // }).subscribe((results: any) => {
    //   this.brands = results.brands;
    //   this.setupFilteredBrands();
    // });
    this.route.queryParams.subscribe((params) => {
      this.code = params["code"];
      if (this.code !== undefined) {
        this.editRoute = true;
        this.productPayload.inStock = false;
        this.getProductDetails(this.code);
      } else {
        this.productPayload.inStock = true;
      }
    });
  }

  getAllMaterials() {
    this.masterService.getAllMaterial().subscribe((res: any) => {
      this.materials = res;
    });
  }

  getAllCollections() {
    this.masterService.getAllCollection().subscribe((res: any) => {
      this.collections = res;
    });
  }

  getAllShapes() {
    this.masterService.getAllShape().subscribe((res: any) => {
      this.shapes = res;
    });
  }

  getAllPatterns() {
    this.masterService.getAllPattern().subscribe((res: any) => {
      this.patterns = res;
    });
  }

  getAllPriceRanges() {
    this.masterService.getAllPriceRange().subscribe((res: any) => {
      this.priceRanges = res;
    });
  }

  getAllRooms() {
    this.masterService.getAllRoom().subscribe((res: any) => {
      this.rooms = res;
    });
  }

  getAllWeaingTechniques() {
    this.masterService.getAllWeavingTechnique().subscribe((res: any) => {
      this.weavingTechniques = res;
    });
  }

  getProductDetails(productCode: any) {
    this.productService
      .getProductByProductCode(productCode)
      .subscribe((data: any) => {
        this.product = data;
        data.productImageList.forEach((image: any, index: any) => {
          this.cardsCount[index] = image.imageURL;
        });
        this.productPayload.name = data.name;
        this.productPayload.description = data.description;
        this.productPayload.colorId = data.color[0]?.id || 0;
        this.productPayload.materialId = data.material[0]?.id || 0;
        this.productPayload.shapeId = data.shape[0]?.id || 0;
        this.productPayload.weavingTechniqueId =
          data.weavingTechnique[0]?.id || 0;
        this.productPayload.collectionId = data.collection[0]?.id || 0;
        this.productPayload.patternId = data.pattern[0]?.id || 0;
        this.productPayload.roomId = data.room[0]?.id || 0;
        this.productPayload.priceRangeId = data.priceRange[0]?.id || 0;
        this.productPayload.price = data.price || 0;
        this.productPayload.discountId = data.discount[0]?.id || null;
        this.productPayload.inStock = data.inStock;
        this.productPayload.isNewLaunch = data.isNewLaunch;
        this.productPayload.productCode = data.productCode;
        this.productPayload.tagList = data.tagList || [];
        this.productPayload.inStock = data.inStock;
        this.productPayload.productImageList = data.productImageList.map(
          (img: any) => ({
            id: img.id,
            imageURL: img.imageURL,
          })
        );
        this.productPayload.productSizeMappingsList =
          data.productSizeMappingList.map(
            (mapping: any) => mapping.productSizeId
          );
        // if (data.brand && data.brand.length > 0) {
        //   this.productPayload.productBrandId = data.brand[0].id;

        //   this.brandCtrl.setValue(data.brand[0]);
        // }
        // this.productPayload.productParentCategoryId =
        //   data.parentCategory[0]?.id || 0;
        // this.onParentCategoryChange(
        //   this.productPayload.productParentCategoryId
        // );
        // this.productPayload.productCategoryId = data.category[0]?.id || 0;
        // this.onCategoryChange(this.productPayload.productCategoryId);
        // this.productPayload.productSubCategoryId = data.subCategory[0]?.id || 0;
        // this.productPayload.productBrandId = data.brand[0]?.id || 0;
        // this.productPayload.productSizeId = data.productSize[0]?.id || 0;
      });
  }

  // setupFilteredBrands() {
  //   this.filteredBrands = this.brandCtrl.valueChanges.pipe(
  //     startWith(""),
  //     map((value) => (typeof value === "string" ? value : value?.name || "")),
  //     map((name) => (name ? this._filterBrands(name) : this.brands.slice()))
  //   );
  // }

  // private _filterBrands(name: string): Brand[] {
  //   const filterValue = name.toLowerCase();
  //   return this.brands.filter(
  //     (brand) => brand.name.toLowerCase().indexOf(filterValue) === 0
  //   );
  // }

  // displayBrand(brand: any): string {
  //   return brand.name || "";
  // }

  // onBrandSelected(event: MatAutocompleteSelectedEvent) {
  //   const selectedBrand: Brand = event.option.value;
  //   // this.productPayload.productBrandId = selectedBrand.id;
  // }

  getAllDiscounts() {
    this.masterService.getAllDiscount().subscribe((res: any) => {
      this.discounts = res;
    });
  }

  updateProduct(productId: any) {
    this.loadInitialPayload();
    var finalPayload = this.addAttachmentsPayload(this.payload);
    if (this.validatePostForm(finalPayload))
      this.productService
        .updateProduct(productId, finalPayload)
        .subscribe((data) => {
          this.showNotification("Product Updated Succesfully");
        });
  }

  loadInitialPayload() {
    let discountId: number | null = this.productPayload.discountId;
    // let discountId: number | null = this.productPayload.selectedDiscountId;

    if (discountId === null) {
      discountId = 0;
    }

    const productSizeMappingsList =
      this.productPayload.productSizeMappingsList.map((sizeId: number) => ({
        id: 0,
        productId: this.product.id || 0,
        productSizeId: sizeId,
        price: this.productPayload.price,
      }));

    this.payload = {
      createdBy: Number(localStorage.getItem("id")),
      createdOn: new Date().toISOString(),
      modifiedBy: Number(localStorage.getItem("id")),
      modifiedOn: new Date().toISOString(),
      id: this.product.id || 0,
      name: this.productPayload.name,
      colorId: this.productPayload.colorId,
      materialId: this.productPayload.materialId,
      shapeId: this.productPayload.shapeId,
      weavingTechniqueId: this.productPayload.weavingTechniqueId,
      collectionId: this.productPayload.collectionId,
      patternId: this.productPayload.patternId,
      roomId: this.productPayload.roomId,
      priceRangeId: this.productPayload.priceRangeId,
      price: this.productPayload.price,
      discountId: discountId,
      inStock: this.productPayload.inStock,
      isNewLaunch: this.productPayload.isNewLaunch,
      productCode: this.productPayload.productCode,
      description: this.productPayload.description,
      productSizeMappingsList: productSizeMappingsList,
      tagList: this.productPayload.tagList,
      // parentCategoryId: this.productPayload.productParentCategoryId,
      // categoryId: this.productPayload.productCategoryId,
      // subCategoryId: this.productPayload.productSubCategoryId,
      // brandId: this.productPayload.productBrandId,
      // colorId: this.productPayload.productColorId,
    };
  }

  postProduct() {
    this.loadInitialPayload();
    var finalPayload = this.addAttachmentsPayload(this.payload);
    if (this.validatePostForm(finalPayload))
      this.productService.addProduct(finalPayload).subscribe((data) => {
        this.showNotification("Product Added Succesfully");
      });
  }

  validatePostForm(payload: any): boolean {
    let flag = false;
    if (payload.name == "") {
      this.showNotification("Name is required");
    } else if (payload.name.length < 5 || payload.name.length > 50) {
      this.showNotification("Title should be between 5 and 50 characters");
    } else if (payload.description == "") {
      this.showNotification("Description is required");
    } else if (
      payload.description.length < 10 ||
      payload.description.length > 500
    ) {
      this.showNotification(
        "Description should be between 10 and 500 characters"
      );
    } else if (!payload.productCode) {
      this.showNotification("Product code is required");
    } else if (!payload.materialId) {
      this.showNotification("Material is required");
    } else if (!payload.patternId) {
      this.showNotification("Pattern is required");
    } else if (!payload.shapeId) {
      this.showNotification("Shape is required");
    } else if (!payload.collectionId) {
      this.showNotification("Collection is required");
    } else if (!payload.priceRangeId) {
      this.showNotification("Price Range is required");
    } else if (!payload.weavingTechniqueId) {
      this.showNotification("Weaving Technique is required");
    } else if (!payload.roomId) {
      this.showNotification("Room is required");
    } else if (!payload.colorId) {
      this.showNotification("Color ID is required");
    } else if (payload.productSizeMappingsList <= 0) {
      this.showNotification("Product size ID is required");
    } else if (payload.tagList.length <= 0) {
      this.showNotification("At least 1 tag is required");
    } else if (!payload.price) {
      this.showNotification("Price is required");
    } else if (payload.productImageList.length < 2) {
      this.showNotification("At least 2 images are required");
    } else {
      flag = true;
    }
    return flag;
  }

  getAllColors() {
    this.masterService.getAllColor().subscribe((res: any) => {
      this.colors = res;
    });
  }

  getAllBrands() {
    // return this.masterService.getAllBrands();
    return "";
  }

  getAllProductSizes() {
    this.masterService.getAllProductSize().subscribe((res: any) => {
      this.sizes = res;
    });
  }

  getAllParentCategories() {
    // this.masterService.getAllParentCategories().subscribe((data: any) => {
    //   this.parentCategories = data;
    //   this.parentCategories.forEach((parentCategory) => {
    //     parentCategory.expanded = false;
    //     parentCategory.completed = false;
    //     this.getCategoryByParentCategoryId(parentCategory.id);
    //   });
    // });
  }

  isParentCategorySelected(parentCategoryId: number) {
    return this.selectedParentCategories.includes(parentCategoryId);
  }

  toggleParentCategory(parentCategory: any) {
    if (this.expandedCategories[parentCategory.id]) {
      delete this.expandedCategories[parentCategory.id];
    } else {
      this.expandedCategories[parentCategory.id] = true;
    }
  }

  toggleParentCategorySelection(parentCategory: any) {
    const index = this.selectedParentCategories.indexOf(parentCategory.id);
    if (index === -1) {
      this.selectedParentCategories.push(parentCategory.id);
      this.expandedCategories[parentCategory.id] = true;
      const categories = this.categoryMap[parentCategory.id] || [];
      categories.forEach((category) => {
        if (!this.selectedCategories.includes(category.id)) {
          this.selectedCategories.push(category.id);
        }
        const subCategories = this.subCategoryMap[category.id] || [];
        subCategories.forEach((subCategory) => {
          if (!this.selectedSubCategories.includes(subCategory.id)) {
            this.selectedSubCategories.push(subCategory.id);
          }
        });
      });
    } else {
      this.selectedParentCategories.splice(index, 1);
      this.expandedCategories[parentCategory.id] = false;
      const categories = this.categoryMap[parentCategory.id] || [];
      categories.forEach((category) => {
        const categoryIndex = this.selectedCategories.indexOf(category.id);
        if (categoryIndex !== -1) {
          this.selectedCategories.splice(categoryIndex, 1);
        }
        const subCategories = this.subCategoryMap[category.id] || [];
        subCategories.forEach((subCategory) => {
          const subCategoryIndex = this.selectedSubCategories.indexOf(
            subCategory.id
          );
          if (subCategoryIndex !== -1) {
            this.selectedSubCategories.splice(subCategoryIndex, 1);
          }
        });
      });
    }
  }

  isParentCategoryExpanded(parentCategoryId: number): boolean {
    return this.expandedCategories[parentCategoryId] || false;
  }

  isCategorySelected(categoryId: number) {
    return this.selectedCategories.includes(categoryId);
  }

  toggleCategorySelection(category: any): void {
    const index = this.selectedCategories.indexOf(category.id);
    if (index === -1) {
      this.selectedCategories.push(category.id);
      const subCategories = this.subCategoryMap[category.id] || [];
      subCategories.forEach((subCategory) => {
        if (!this.selectedSubCategories.includes(subCategory.id)) {
          this.selectedSubCategories.push(subCategory.id);
        }
      });
    } else {
      this.selectedCategories.splice(index, 1);
      const subCategories = this.subCategoryMap[category.id] || [];
      subCategories.forEach((subCategory) => {
        const subCategoryIndex = this.selectedSubCategories.indexOf(
          subCategory.id
        );
        if (subCategoryIndex !== -1) {
          this.selectedSubCategories.splice(subCategoryIndex, 1);
        }
      });
    }
  }

  isSubCategorySelected(subCategoryId: number) {
    return this.selectedSubCategories.includes(subCategoryId);
  }

  toggleSubCategorySelection(subCategory: any) {
    const index = this.selectedSubCategories.indexOf(subCategory.id);
    if (index === -1) {
      this.selectedSubCategories.push(subCategory.id);
    } else {
      this.selectedSubCategories.splice(index, 1);
    }
  }

  deleteSelectedCategories() {
    if (this.selectedParentCategories.length > 0) {
      this.selectedParentCategories.forEach((parentCategoryId) => {
        this.deleteParentCategory(parentCategoryId);
        const categoriesToDelete = this.categoryMap[parentCategoryId] || [];
        categoriesToDelete.forEach((category) => {
          this.deleteCategory(category.id);
          const subCategoriesToDelete = this.subCategoryMap[category.id] || [];
          subCategoriesToDelete.forEach((subCategory) => {
            this.deleteSubCategory(subCategory.id);
          });
        });
      });
      this.showNotification("Parent category deleted successfully");
      this.selectedParentCategories = [];
      this.selectedCategories = [];
      this.selectedSubCategories = [];
    } else {
      if (this.selectedCategories.length > 0) {
        this.selectedCategories.forEach((categoryId) => {
          this.deleteCategory(categoryId);
          const subCategoriesToDelete = this.subCategoryMap[categoryId] || [];
          subCategoriesToDelete.forEach((subCategory) => {
            this.deleteSubCategory(subCategory.id);
          });
        });
        this.showNotification("Category deleted successfully");
        this.selectedCategories = [];
        this.selectedSubCategories = [];
      } else if (this.selectedSubCategories.length > 0) {
        this.selectedSubCategories.forEach((subCategoryId) => {
          this.deleteSubCategory(subCategoryId);
        });
        this.showNotification("Subcategory deleted successfully");
        this.selectedSubCategories = [];
      }
    }
  }

  deleteParentCategory(parentId: any) {
    // this.masterService
    //   .removeParentCategory(parentId)
    //   .subscribe((data: any) => {});
  }
  deleteCategory(categoryId: any) {
    // this.masterService.removeCategory(categoryId).subscribe((data: any) => {});
  }
  deleteSubCategory(subCategoryId: any) {
    // this.masterService
    //   .removeSubCategory(subCategoryId)
    //   .subscribe((data: any) => {});
  }

  onSubParentCategoryChange(parentCategoryId: number) {
    // this.masterService
    //   .getCategoryByParentCategoryId(parentCategoryId)
    //   .subscribe((data: any) => {
    //     this.categories = data;
    //   });
  }

  onParentCategoryChange(parentCategoryId: number) {
    // this.masterService
    //   .getCategoryByParentCategoryId(parentCategoryId)
    //   .subscribe((data: any) => {
    //     this.categories = data;
    //   });
  }

  onCategoryChange(CategoryId: number) {
    // this.masterService
    //   .getSubCategoryByCategoryId(CategoryId)
    //   .subscribe((data: any) => {
    //     this.subCategories = data;
    //   });
  }

  // onSubCategoryChange(subCategoryId: number) {
  //   this.masterService
  //     .getBrandBySubCategoryId(subCategoryId)
  //     .subscribe((data: any) => {
  //       this.brands = data;
  //     });
  // }

  allowOnlyNumbers(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;
    const numericInput = inputValue.replace(/[^0-9.-]/g, "");
    inputElement.value = numericInput;
    this.numericValue = parseFloat(numericInput);
  }

  onInputFocus() {
    this.isInputFocused = true;
  }

  onInputBlur() {
    if (!this.productPrice) {
      this.isInputFocused = false;
    }
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || "").trim();
    if (value) {
      this.productPayload.tagList.push({
        id: 0,
        name: value,
        projectCodeId: 0,
      });
    }
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.productPayload.tagList.indexOf(fruit);
    if (index >= 0) {
      this.productPayload.tagList.splice(index, 1);
    }
  }

  selectFile() {
    if (this.document) {
      const uploadElement = this.document.getElementById("fileUpload");
      if (uploadElement) {
        uploadElement.click();
      }
    }
  }

  selectImage(event: any): void {
    var files = event.target.files;
    const formData = new FormData();
    this.imageProgress = true;
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    this.productService
      .uploadProjectCodeImages(formData)
      .subscribe((data: any) => {
        this.imageProgress = false;
        let imagesLength = data.length;
        let dataIndex = 0;

        for (
          let j = 0;
          j < this.cardsCount.length && dataIndex < data.length;
          j++
        ) {
          if (this.cardsCount[j] === "") {
            this.cardsCount[j] = data[dataIndex];
            dataIndex++;
            imagesLength--;
          }

          if (!this.firstImageUploaded) {
            this.firstImageUploaded = true;
          }
        }
      });
  }
  deleteBackgroundImage(index: any): void {
    for (let i = index; i < this.cardsCount.length - 1; i++) {
      this.cardsCount[i] = this.cardsCount[i + 1];
    }
    this.cardsCount[this.cardsCount.length - 1] = "";
  }

  addAttachmentsPayload(commonPayload: any): any {
    var imageList: { id: number; imageURL: any }[] = [];
    this.cardsCount.forEach((imageURL) => {
      if (imageURL != "") imageList.push({ id: 0, imageURL: imageURL });
    });

    var payload = Object.assign({}, commonPayload, {
      productImageList: imageList,
    });
    return payload;
  }

  getCategoryByParentCategoryId(parentCategoryId: number) {
    // this.masterService
    //   .getCategoryByParentCategoryId(parentCategoryId)
    //   .subscribe((data: any) => {
    //     this.categoryMap[parentCategoryId] = data.map((category: any) => ({
    //       ...category,
    //       expanded: false,
    //       completed: false,
    //     }));
    //     data.forEach((category: any) => {
    //       this.getSubCategoryByCategoryId(category.id);
    //       this.getBrandsByCategoryId(category.id);
    //     });
    //   });
  }

  getSubCategoryByCategoryId(categoryId: number) {
    // this.masterService
    //   .getSubCategoryByCategoryId(categoryId)
    //   .subscribe((data: any) => {
    //     this.subCategoryMap[categoryId] = data.map((subCategory: any) => ({
    //       ...subCategory,
    //       completed: false,
    //     }));
    //     data.forEach((subCategory: any) => {
    //       this.getBrandsBySubCategoryId(subCategory.id);
    //     });
    //     this.brandSubCategories = this.brandSubCategories.concat(data);
    //     this.brandSubCategories = Array.from(
    //       new Set(
    //         this.brandSubCategories.map((subCategory) => subCategory.name)
    //       )
    //     ).map((name) =>
    //       this.brandSubCategories.find(
    //         (subCategory) => subCategory.name === name
    //       )
    //     );
    //   });
  }

  getBrandsByCategoryId(categoryId: number) {
    // this.masterService
    //   .getBrandByCategoryId(categoryId)
    //   .subscribe((data: any) => {
    //     this.brands = this.brands.concat(data);
    //     this.removeDuplicateBrands();
    //   });
  }

  getBrandsBySubCategoryId(subCategoryId: number) {
    // this.masterService
    //   .getBrandBySubCategoryId(subCategoryId)
    //   .subscribe((data: any) => {
    //     this.brands = this.brands.concat(data);
    //     this.removeDuplicateBrands();
    //   });
  }

  removeDuplicateBrands() {
    const uniqueBrandNames: Set<string> = new Set();
    const uniqueBrands: { id: number; name: string; subCategoryId: number }[] =
      [];

    this.brands.forEach((brand) => {
      if (!uniqueBrandNames.has(brand.name)) {
        uniqueBrandNames.add(brand.name);
        uniqueBrands.push(brand);
      }
    });

    this.brands = uniqueBrands;
  }

  addParentCategory() {
    const payload = {
      createdBy: Number(localStorage.getItem("id")),
      createdOn: new Date().toISOString(),
      modifiedBy: Number(localStorage.getItem("id")),
      modifiedOn: new Date().toISOString(),
      name: this.parentCategory,
    };

    // this.masterService.addParentCategory(payload).subscribe((response) => {
    //   this.showNotification("Added Parent Category Successfully");
    // });
  }

  addCategory() {
    const payload = {
      createdBy: Number(localStorage.getItem("id")),
      createdOn: new Date().toISOString(),
      modifiedBy: Number(localStorage.getItem("id")),
      modifiedOn: new Date().toISOString(),
      name: this.category,
      parentCategoryId: this.parentCategoryId,
    };

    // this.masterService.addCategory(payload).subscribe((response) => {
    //   this.showNotification("Added Category Successfully");
    // });
  }

  addSubCategory() {
    const payload = {
      id: 0,
      name: this.subcategory,
      categoryId: this.categoryId,
    };

    // this.masterService.addSubCategory(payload).subscribe((response) => {
    //   this.showNotification("Added Sub Category Successfully");
    // });
  }

  addBrand() {
    const payload = {
      id: 0,
      name: this.brandName,
      subCategoryId: 0,
    };

    // this.masterService.addBrand(payload).subscribe((response) => {
    //   this.showNotification("Added Brand Successfully");
    // });
  }

  addColor() {
    const payload = {
      id: 0,
      name: this.colorName,
      code: this.colorCode,
    };
    // this.masterService.addColor(payload).subscribe((response) => {
    //   this.showNotification("Added Color Successfully");
    // });
  }

  showNotification(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 5000,
      horizontalPosition: "end",
      verticalPosition: "top",
    });
  }

  toggleMainOption(option: string) {
    // if (this.activeMainOption === option) {
    //   this.activeMainOption = "";
    //   this.resetSections();
    // } else {
    // }
    this.activeMainOption = option;
    if (option === "productEntry") {
      this.showOrders = false;
      this.toggleSection("categories");
    } else if (option === "manageOrders") {
      this.resetSections();
      this.selectedSection = "";
      this.showOrders = true;
    }
  }

  resetSections() {
    this.showCategories = false;
    this.showBrands = false;
    this.showColors = false;
    this.showProduct = false;
    this.showOrders = false;
    this.showDeleteCategories = false;
  }

  toggleSection(section: string) {
    this.activeMainOption = "productEntry";
    this.resetSections();
    switch (section) {
      case "categories":
        this.showCategories = true;
        break;
      case "brands":
        this.showBrands = true;
        break;
      case "colors":
        this.showColors = true;
        break;
      case "product":
        this.showProduct = true;
        break;
      case "delete-categories":
        this.showDeleteCategories = true;
        break;
      default:
        break;
    }

    this.selectedSection = section;
  }
}
