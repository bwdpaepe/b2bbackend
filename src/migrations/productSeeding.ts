import { faker } from "@faker-js/faker";
import { Product } from "../entity/Product";
import { AppDataSource } from "../data-source";

const productRepository = AppDataSource.getRepository(Product);

// Create a function to generate a new value for the voorraad and pictureFilename columns
function generateVoorraadPictureFilenameAndDesription(): [
  number,
  string,
  string
] {
  const voorraad = faker.datatype.number({ min: 0, max: 100 });
  const pictureFilename = `product_picture${faker.datatype.number({
    min: 1,
    max: 25,
  })}.jpg`;
  const beschrijving = faker.commerce.productDescription();
  return [voorraad, pictureFilename, beschrijving];
}

// Generate new data for the voorraad and pictureFilename columns for an existing product
function updateProduct(product: Product): Product {
  const [voorraad, pictureFilename, omscrijving] =
    generateVoorraadPictureFilenameAndDesription();
  product.voorraad = voorraad;
  product.pictureFilename = pictureFilename;
  product.omschrijving = omscrijving;
  return product;
}

// Update the voorraad and pictureFilename columns for all products in the database
async function updateProducts(): Promise<void> {
  const products = await productRepository.find();
  products.forEach((product) => {
    updateProduct(product);
    productRepository.save(product);
  });
}

updateProducts().then(() => console.log("Products updated successfully."));
