"use client";

import { CombinedProduct, User as USER } from "@/types";
import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNaira } from "@/lib/utils";
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

// type UserProfile = USER & { store: string };

const Profile = () => {
  // State management
  const [user, setUser] = useState<USER | null>(null);
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
      const { data } = await axios.post<{ data: USER }>("/api/user/userData");
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
        <aside className="bg-card rounded-lg shadow-xs hidden md:inline-block">
          <Aside1 />
        </aside>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Profile Header */}
          <section className="bg-card rounded-lg p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <h1 className="sm:text-2xl font-bold flex items-center gap-2">
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
          {user.stores.length > 0 && (
            <StoreSection
              storeId={user.stores[0].storeId}
              userName={user.firstName}
            />
          )}

          {/* Verification Section 66fbae5615b9fec5eac1b9bb */}
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
  <section className="bg-card rounded-lg p-6 shadow-xs">
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
  <section className="bg-card rounded-lg p-6 shadow-xs border border-yellow-100">
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
  <section className="bg-card rounded-lg p-6 shadow-xs">
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
        {price && <p className="text-sm font-semibold">{formatNaira(price)}</p>}
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
