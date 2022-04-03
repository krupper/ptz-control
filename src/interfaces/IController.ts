interface IController {
  product: string;
  productId: number;
  manufacturer: string;
  vendorId: number;

  on(event: any, cb: any): void;

  init(): void;
  test(): void;
}

export default IController;
