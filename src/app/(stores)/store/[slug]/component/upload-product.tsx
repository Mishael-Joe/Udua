import CreateProduct from "@/app/(stores)/store/[slug]/component/createProduct";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { cookies } from "next/headers";

async function UploadProduct({ params }: { params: { slug: string } }) {
  const cookieStore = await cookies();
  const userID: string | undefined = cookieStore.get("userID")?.value;
  return (
    <main className="flex flex-col gap-4 p-4 md:gap-0">
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="#">Inventory</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage> Upload Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-1 xl:grid-cols-1 py-4">
        <CreateProduct id={params.slug} />
      </div>
    </main>
  );
}

export default UploadProduct;
