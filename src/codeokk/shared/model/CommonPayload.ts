export class Common {
  id: number = 0;
  name: string = "";
  colorId: number = 0;
  materialId: number = 0;
  shapeId: number = 0;
  weavingTechniqueId: number = 0;
  collectionId: number = 0;
  patternId: number = 0;
  roomId: number = 0;
  priceRangeId: number = 0;
  price: number = 0;
  discountId: number = 0;
  inStock: boolean = true;
  isNewLaunch: boolean = true;
  productCode: string = "";
  description: string = "";
  tagList: any[] = [];
  productImageList: { id: number; imageURL: any }[] = [];
  productSizeMappingsList: any[] = [];
}
