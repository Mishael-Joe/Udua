import CreateProduct from "@/utils/shared/forms/createProduct";

async function Page() {
  return (
    <>
      <h1 className="text-center py-6">Add Product</h1>

      <CreateProduct />
    </>
  );
}

export default Page;
