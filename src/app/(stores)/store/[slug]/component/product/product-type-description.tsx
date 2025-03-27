type ProductTypeDescriptionProps = {
  type: string;
};

const ProductTypeDescription = ({ type }: ProductTypeDescriptionProps) => {
  if (type === "physicalproducts") {
    return (
      <p className="mt-4">
        A Physical Product refers to any tangible, real-world item that can be
        physically touched, held, and delivered to customers. These are goods
        that need to be shipped or delivered after purchase. Physical products
        often have attributes like size, weight, and quantity. They are suitable
        for sellers offering items that require delivery or in-person pickup.
        E.g includes Clothing (T-shirts, shoes, jackets), Electronics (Phones,
        laptops, headphones) etc.
      </p>
    );
  }

  if (type === "digitalproducts") {
    return (
      <p className="mt-4">
        A Digital Product refers to any item that is delivered electronically,
        meaning there is no physical item to ship. These are typically
        downloadable files or access-based services that can be immediately
        accessed online after purchase. Digital products are perfect for
        creators and sellers offering non-tangible goods such as media or
        educational materials. E.g includes eBooks(PDF) etc.
      </p>
    );
  }

  return null;
};

export default ProductTypeDescription;
