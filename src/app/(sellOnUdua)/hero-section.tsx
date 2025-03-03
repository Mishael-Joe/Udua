// HeroSection.tsx
// This component is the hero section of the 'Create a Store' page.
// It introduces the page with a clear headline and a call-to-action for users to create their store on Udua.

import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="hero-section py-8 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Grow Your Business, Reach More Audience
        </h1>
        <p className="text-base md:text-lg mb-6">
          Create a store on Udua and start selling to thousands of university
          students today!
        </p>
        <Link
          href="/partner-with-udua/create-store"
          className="bg-udua-blue-primary text-white py-3 px-6 rounded text-lg font-semibold hover:bg-udua-blue-primary/85 transition duration-300"
        >
          Create Your Store
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
