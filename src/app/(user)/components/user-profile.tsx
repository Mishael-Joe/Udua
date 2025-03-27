"use client";

import { CombinedProduct, User as USER } from "@/types";
import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { addCommasToNumber } from "@/lib/utils";
import { shimmer, toBase64 } from "@/lib/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  ShieldCheck,
  Eye,
  Clock,
  Store,
} from "lucide-react";
import Aside1 from "./aside-1";

type UserProfile = USER & { store: string };

const Profile = () => {
  // State management
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [recentProducts, setRecentProducts] = useState<CombinedProduct[]>([]);

  // Memoized image placeholder
  const blurData = useMemo(
    () => `data:image/svg+xml;base64,${toBase64(shimmer(300, 150))}`,
    []
  );

  /**
   * Fetches user profile data with error handling
   */
  const fetchUserProfile = useCallback(async () => {
    try {
      const { data } = await axios.post<{ data: UserProfile }>(
        "/api/user/userData"
      );
      setUser(data.data);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches recently viewed products from localStorage
   */
  const fetchRecentProducts = useCallback(async () => {
    try {
      const viewedIds = JSON.parse(
        localStorage.getItem("recentlyViewed") || "[]"
      );
      if (viewedIds.length) {
        const { data } = await axios.post("/api/user/recently-viewed", {
          productIds: viewedIds,
        });
        setRecentProducts(data.products);
      }
    } catch (err) {
      console.error("Recent products error:", err);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchUserProfile();
    return () => controller.abort();
  }, [fetchUserProfile]);

  useEffect(() => {
    fetchRecentProducts();
  }, [fetchRecentProducts]);

  if (loading) return <ProfileSkeleton />;
  if (error) return <ErrorState />;
  if (!user) return <ProfileSkeleton />;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-3 py-8">
      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        {/* Navigation Sidebar */}
        <aside className="bg-card rounded-lg shadow-sm hidden md:inline-block">
          <Aside1 />
        </aside>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Profile Header */}
          <section className="bg-card rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <User className="w-6 h-6" />
                {user.firstName}'s Profile
              </h1>
              {user.isVerified && (
                <Badge className="bg-green-100 text-green-800 hover:bg-inherit">
                  <ShieldCheck className="w-4 h-4 mr-1" />
                  Verified Account
                </Badge>
              )}
            </div>

            {/* Profile Details Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <DetailSection
                icon={<User className="w-5 h-5" />}
                title="Personal Information"
                items={[
                  {
                    label: "Full Name",
                    value: `${user.firstName} ${user.otherNames} ${user.lastName}`,
                  },
                  {
                    label: "Email",
                    value: user.email,
                    icon: <Mail className="w-4 h-4" />,
                  },
                  {
                    label: "Phone",
                    value: user.phoneNumber,
                    icon: <Phone className="w-4 h-4" />,
                  },
                ]}
              />

              <DetailSection
                icon={<MapPin className="w-5 h-5" />}
                title="Shipping Address"
                items={[
                  { label: "Address", value: user.address },
                  { label: "City", value: user.cityOfResidence },
                  { label: "State", value: user.stateOfResidence },
                  { label: "Postal Code", value: user.postalCode },
                ]}
              />
            </div>
          </section>

          {/* Store Section */}
          {user.store && (
            <StoreSection storeId={user.store} userName={user.firstName} />
          )}

          {/* Verification Section */}
          {!user.isVerified && <VerificationSection />}

          {/* Recently Viewed Products */}
          {recentProducts.length > 0 && (
            <RecentProductsSection
              products={recentProducts}
              blurData={blurData}
            />
          )}
        </main>
      </div>
    </div>
  );
};

// Sub-components with TypeScript interfaces
interface DetailSectionProps {
  icon: React.ReactNode;
  title: string;
  items: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
  }>;
}

const DetailSection = ({ icon, title, items }: DetailSectionProps) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2 mb-4">
      <div className="bg-primary/10 p-2 rounded-lg">{icon}</div>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>

    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          {item.icon && (
            <span className="text-muted-foreground">{item.icon}</span>
          )}
          <div>
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <p className="font-medium">{item.value || "Not provided"}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface StoreSectionProps {
  storeId: string;
  userName: string;
}

const StoreSection = ({ storeId, userName }: StoreSectionProps) => (
  <section className="bg-card rounded-lg p-6 shadow-sm">
    <div className="flex items-center gap-4 mb-4">
      <Building className="w-8 h-8 text-primary" />
      <h2 className="text-xl font-bold">Store Management</h2>
    </div>

    <div className="space-y-3">
      <p className="text-muted-foreground">
        Welcome back, {userName}. Manage your store products, orders, and
        settings.
      </p>
      <Button
        asChild
        className="mt-4 bg-udua-orange-primary hover:bg-orange-400"
      >
        <Link href={`/store/${storeId}/my-store`}>
          <Store className="w-4 h-4 mr-2" />
          Open Store Dashboard
        </Link>
      </Button>
    </div>
  </section>
);

const VerificationSection = () => (
  <section className="bg-card rounded-lg p-6 shadow-sm border border-yellow-100">
    <div className="flex items-center gap-4 mb-4">
      <ShieldCheck className="w-8 h-8 text-yellow-600" />
      <h2 className="text-xl font-bold">Account Verification</h2>
    </div>

    <div className="space-y-3">
      <p className="text-muted-foreground">
        Verify your account to access full platform features.
      </p>
      <Button
        asChild
        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
      >
        <Link href="/verification">Complete Verification</Link>
      </Button>
    </div>
  </section>
);

interface RecentProductsProps {
  products: CombinedProduct[];
  blurData: string;
}

const RecentProductsSection = ({ products, blurData }: RecentProductsProps) => (
  <section className="bg-card rounded-lg p-6 shadow-sm">
    <div className="flex items-center gap-4 mb-6">
      <Eye className="w-8 h-8 text-primary" />
      <h2 className="text-xl font-bold">Recently Viewed</h2>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} blurData={blurData} />
      ))}
    </div>
  </section>
);

interface ProductCardProps {
  product: CombinedProduct;
  blurData: string;
}

const ProductCard = ({ product, blurData }: ProductCardProps) => {
  const isPhysical = product.productType === "physicalproducts";
  const imageUrl = isPhysical ? product.images[0] : product.coverIMG[0];
  const title = isPhysical ? product.name : product.title;
  const price = isPhysical
    ? product.price ?? product.sizes?.[0]?.price
    : product.price;

  return (
    <Link
      href={`/product/${product._id}`}
      className="group relative bg-background rounded-lg border p-3 hover:shadow-md transition-shadow"
    >
      <div className="aspect-square relative overflow-hidden rounded-md bg-muted">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
          placeholder="blur"
          blurDataURL={blurData}
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-medium line-clamp-2 text-sm">{title}</h3>
        {price && (
          <p className="text-sm font-semibold">₦{addCommasToNumber(price)}</p>
        )}
      </div>
    </Link>
  );
};

// Loading and Error States
const ProfileSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
    <div className="grid md:grid-cols-[240px_1fr] gap-6">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="space-y-6">
        <Skeleton className="h-[200px] w-full rounded-lg" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    </div>
  </div>
);

const ErrorState = () => (
  <div className="h-screen flex items-center justify-center text-center p-4">
    <div className="max-w-md space-y-4">
      <h2 className="text-xl font-bold text-destructive">
        Failed to Load Profile
      </h2>
      <p className="text-muted-foreground">
        We couldn't load your profile information. Please check your connection
        and try again.
      </p>
      <Button onClick={() => window.location.reload()}>Retry</Button>
    </div>
  </div>
);

export default Profile;

// "use client";

// import { CombinedProduct, User as USER } from "@/types";
// import axios from "axios";
// import { useEffect, useState, useCallback, useMemo } from "react";
// import Link from "next/link";
// import Aside1 from "./aside-1";
// import { Button } from "@/components/ui/button";
// import { addCommasToNumber } from "@/lib/utils";
// import Image from "next/image";
// import { shimmer, toBase64 } from "@/lib/image";
// import { SkeletonLoader } from "@/utils/skeleton-loaders/user-profile-skeleton";

// type User = USER & { store: string };

// const Profile = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(false);
//   const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<
//     CombinedProduct[]
//   >([]);

//   // Memoized blur data URL for images
//   const blurData = useMemo(
//     () => `data:image/svg+xml;base64,${toBase64(shimmer(300, 150))}`,
//     []
//   );

//   // Fetch user data with error handling and timeout
//   const fetchUserData = useCallback(async () => {
//     try {
//       const response = await axios.post<{ data: User }>("/api/user/userData");
//       setUser(response.data.data);
//       setLoading(false);
//     } catch (error: any) {
//       console.error("Failed to fetch user data", error.message);
//       setError(true);
//       setLoading(false);
//     }
//   }, []);

//   // Fetch recently viewed products
//   const fetchRecentProducts = useCallback(async (productIds: string[]) => {
//     try {
//       const response = await axios.post("/api/user/recently-viewed", {
//         productIds,
//       });
//       setRecentlyViewedProducts(response.data.products);
//     } catch (error) {
//       console.error("Error fetching recently viewed products:", error);
//     }
//   }, []);

//   useEffect(() => {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => {
//       if (loading) {
//         controller.abort();
//         setError(true);
//         setLoading(false);
//       }
//     }, 10000);

//     fetchUserData();

//     return () => {
//       controller.abort();
//       clearTimeout(timeoutId);
//     };
//   }, [fetchUserData, loading]);

//   useEffect(() => {
//     try {
//       const recentlyViewed = JSON.parse(
//         localStorage.getItem("recentlyViewed") || "[]"
//       );
//       if (recentlyViewed.length) fetchRecentProducts(recentlyViewed);
//     } catch (error) {
//       console.error("Error reading recently viewed:", error);
//     }
//   }, [fetchRecentProducts]);

//   const renderLoading = () => <SkeletonLoader />;

//   const renderError = () => (
//     <div className="w-full min-h-screen flex items-center justify-center">
//       <p className="text-red-600 text-center max-w-xs">
//         Failed to load profile. Please check your connection and try again.
//       </p>
//     </div>
//   );

//   if (loading) return renderLoading();
//   if (error) return renderError();
//   if (!user) return renderLoading();

//   return (
//     <section className="max-w-7xl mx-auto md:px-4 gap-4">
//       <div className="grid min-h-screen md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
//         <aside className="hidden bg-muted/10 md:block">
//           <div className="flex h-full flex-col gap-2">
//             <Aside1 />
//           </div>
//         </aside>

//         <main className="p-4 bg-muted/10 md:border rounded w-full overflow-auto">
//           <ProfileHeader user={user} />
//           <ProfileSections user={user} />
//           <StoreSection user={user} />
//           <VerificationSection user={user} />
//           {/* <AdminSection user={user} /> */}
//           <RecentProducts
//             products={recentlyViewedProducts}
//             blurData={blurData}
//           />
//         </main>
//       </div>
//     </section>
//   );
// };

// // Sub-components for better organization
// const ProfileHeader = ({ user }: { user: User }) => (
//   <div className="pb-4 flex justify-between items-center">
//     <h1 className="text-xl font-semibold">My Profile</h1>
//     {user.isVerified && (
//       <span className="text-sm text-green-600">Verified</span>
//     )}
//   </div>
// );

// const ProfileSections = ({ user }: { user: User }) => (
//   <div className="grid sm:grid-cols-2 gap-6">
//     <DetailSection
//       title="Account Details"
//       items={[
//         {
//           label: "Name",
//           value: `${user.firstName} ${user.otherNames} ${user.lastName}`,
//         },
//         { label: "Email", value: user.email },
//       ]}
//     />

//     <DetailSection
//       title="Shipping Address"
//       items={[
//         {
//           label: "Name",
//           value: `${user.firstName} ${user.otherNames} ${user.lastName}`,
//         },
//         { label: "Email", value: user.email },
//         { label: "Phone", value: user.phoneNumber },
//         { label: "Address", value: user.address },
//         { label: "City", value: user.cityOfResidence },
//         { label: "State", value: user.stateOfResidence },
//         { label: "Postal Code", value: user.postalCode },
//       ]}
//     />
//   </div>
// );

// const DetailSection = ({
//   title,
//   items,
// }: {
//   title: string;
//   items: { label: string; value: string }[];
// }) => (
//   <div className="w-full p-3 border rounded">
//     <h2 className="py-2 font-medium">{title}</h2>
//     <div className="space-y-2">
//       {items.map((item) => (
//         <p key={item.label}>
//           <span className="font-semibold">{item.label}:</span> {item.value}
//         </p>
//       ))}
//     </div>
//   </div>
// );

// const StoreSection = ({ user }: { user: User }) =>
//   user.store && (
//     <InfoSection title={`Hi ${user.firstName},`} className="mt-4">
//       <p className="pb-3">My store.</p>
//       <p className="max-w-xl">
//         Store owners can create and manage their own store, including
//         customizing the store layout, adding product categories, and managing
//         product listings.
//       </p>
//       <Link
//         href={`/store/${user.store}/my-store`}
//         className="flex justify-end pt-3"
//       >
//         <Button
//           variant="link"
//           className="text-udua-orange-primary hover:underline"
//         >
//           Manage Store
//         </Button>
//       </Link>
//     </InfoSection>
//   );

// const VerificationSection = ({ user }: { user: User }) =>
//   !user.isVerified && (
//     <InfoSection title={`Hi ${user.firstName},`} className="mt-4">
//       <p className="pb-3">Welcome to Udua.</p>
//       <p className="max-w-xl">
//         To complete your registration and access all features, please verify
//         your account.
//       </p>
//       <Link href="/verification" className="flex justify-end pt-3">
//         <Button className="bg-udua-orange-primary hover:bg-udua-orange-primary/80">
//           Verify Account
//         </Button>
//       </Link>
//     </InfoSection>
//   );

// // const AdminSection = ({ user }: { user: User }) =>
// //   user.isAdmin && (
// //     <InfoSection title="Admin Portal" className="mt-4">
// //       <p className="max-w-xl">
// //         Access administrative tools and manage platform settings.
// //       </p>
// //       <Link href="/admin/create-store" className="flex justify-end pt-3">
// //         <Button
// //           variant="outline"
// //           className="border-udua-orange-primary text-udua-orange-primary"
// //         >
// //           Admin Dashboard
// //         </Button>
// //       </Link>
// //     </InfoSection>
// //   );

// const RecentProducts = ({
//   products,
//   blurData,
// }: {
//   products: CombinedProduct[];
//   blurData: string;
// }) =>
//   products.length > 0 && (
//     <section className="border p-4 rounded-md shadow mt-6 overflow-x-auto">
//       <h2 className="text-xl font-semibold mb-4">Recently Viewed Products</h2>
//       <div className="flex gap-4 overflow-auto pb-4">
//         {products.map((product) => (
//           <ProductCard
//             key={product._id}
//             product={product}
//             blurData={blurData}
//           />
//         ))}
//       </div>
//     </section>
//   );

// const ProductCard = ({
//   product,
//   blurData,
// }: {
//   product: CombinedProduct;
//   blurData: string;
// }) => {
//   const isPhysical = product.productType === "physicalproducts";
//   const imageUrl = isPhysical ? product.images[0] : product.coverIMG[0];
//   const title = isPhysical ? product.name : product.title;
//   const price = isPhysical
//     ? product.price ?? product.sizes?.[0]?.price
//     : product.price;

//   return (
//     <Link href={`/product/${product._id}`} className="group text-sm ">
//       <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 w-40 h-40 md:h-52">
//         <Image
//           placeholder="blur"
//           blurDataURL={blurData}
//           src={imageUrl}
//           alt={title}
//           fill
//           className="object-cover"
//           sizes="(max-width: 640px) 160px, 208px"
//         />
//       </div>
//       <h3 className="mt-1 font-medium line-clamp-1">{title}</h3>
//       {price && (
//         <p className="mt-1 font-medium">&#8358; {addCommasToNumber(price)}</p>
//       )}
//     </Link>
//   );
// };

// const InfoSection = ({
//   title,
//   children,
//   className,
// }: {
//   title: string;
//   children: React.ReactNode;
//   className?: string;
// }) => (
//   <div className={`w-full border rounded-md p-3 ${className}`}>
//     <h3 className="font-semibold mb-2">{title}</h3>
//     {children}
//   </div>
// );

// export default Profile;
