import CreateProduct from "@/utils/shared/forms/createProduct";
import SellerAside from "@/app/(sellerDashboard)/component/seller-aside";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

async function UploadProduct() {
  return (
    <div className="grid min-h-screen max-w-6xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/10 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <SellerAside />
        </div>
      </div>
      <div className="flex flex-col">
        <main className="flex flex-col gap-4 p-4 md:gap-0 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/my-products?tab=products">Products</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage> Upload Product</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-lg font-semibold md:text-2xl">Add Product</h1>
          </div>

          <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1">
            <CreateProduct />
          </div>
        </main>
      </div>
    </div>
  );
}

export default UploadProduct;
