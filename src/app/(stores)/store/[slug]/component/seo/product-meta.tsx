import Head from "next/head";

type ProductMetaProps = {
  title: string;
  description: string;
  type: "physical" | "digital";
  category?: string;
  imageUrl?: string;
};

const ProductMeta = ({
  title,
  description,
  type,
  category,
  imageUrl,
}: ProductMetaProps) => {
  const pageTitle = `Create ${
    type === "physical" ? "Physical" : "Digital"
  } Product | Udua Marketplace`;
  const pageDescription =
    description ||
    `Add a new ${type} product to your Udua store. ${
      type === "physical"
        ? "Sell clothing, electronics, and more."
        : "Sell e-books, digital downloads, and more."
    }`;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta
        name="keywords"
        content={`create product, add product, sell online, e-commerce, ${type} products${
          category ? `, ${category}` : ""
        }`}
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      {imageUrl && <meta property="twitter:image" content={imageUrl} />}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: pageTitle,
            description: pageDescription,
            publisher: {
              "@type": "Organization",
              name: "Udua Marketplace",
              logo: {
                "@type": "ImageObject",
                url: "https://udua.com/logo.png",
              },
            },
          }),
        }}
      />
    </Head>
  );
};

export default ProductMeta;
