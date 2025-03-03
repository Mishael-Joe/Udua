import React from "react";

const ListOfProhibitedProducts: React.FC = () => {
  return (
    <div className="container max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center pt-4">
        Prohibited Products on Udua
      </h1>

      <p className="mb-4 text-center py-2">Last updated: 3rd March, 2025.</p>

      <p className="mb-4">
        To maintain a safe, lawful, and ethical marketplace, Udua prohibits the
        sale of the following products. Please review this list carefully to
        ensure compliance with our policies.
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>Live Animals and Animal Products:</strong> Products
          encouraging or facilitating animal cruelty, or items incompatible with
          applicable laws regarding animals and animal welfare.
        </li>
        <li>
          <strong>Plants and Seeds:</strong> Products from plants or seeds that
          violate applicable laws and regulations.
        </li>
        <li>
          <strong>Human Body Parts and Remains:</strong> Includes mortuary
          products or any listings involving human body parts or remains.
        </li>
        <li>
          <strong>Tobacco and Related Products:</strong> Tobacco,
          tobacco-containing products, and vaping items.
        </li>
        <li>
          <strong>Alcoholic Beverages:</strong> Any form of alcohol, including
          spirits, wines, or other alcoholic products.
        </li>
        <li>
          <strong>Gambling and Lottery Products:</strong> Products related to
          gambling, betting, or lottery activities.
        </li>
        <li>
          <strong>Pornography and Sexual Services:</strong> Any content or
          services related to pornography, non-consensual sexual acts, or
          illegal sexual themes, including content involving minors.
        </li>
        <li>
          <strong>Violent, Offensive, or Hateful Content:</strong> Products
          promoting violence, terrorism, hate speech, or discrimination based on
          race, gender, religion, ethnicity, sexual orientation, or other
          protected classes.
        </li>
        <li>
          <strong>Weapons and Explosives:</strong> Firearms, ammunition,
          explosives, and controlled devices.
        </li>
        <li>
          <strong>Drugs and Drug Paraphernalia:</strong> Including illegal
          substances and products intended to produce or manufacture drugs.
        </li>
        <li>
          <strong>Hazardous Materials:</strong> Toxic chemicals, explosives,
          radioactive materials, and other hazardous products.
        </li>
        <li>
          <strong>Counterfeit Products:</strong> Items infringing on
          intellectual property rights, including counterfeit goods and
          unlicensed media.
        </li>
        <li>
          <strong>Recalled or Unsafe Products:</strong> Any items subject to
          recall or deemed dangerous or unsafe under applicable law.
        </li>
        <li>
          <strong>Government and Military Items:</strong> Products intended for
          military, police, or government agencies, including government papers
          and documents.
        </li>
        <li>
          <strong>Cash, Currency, and Gift Cards:</strong> Counterfeit currency,
          gift cards, cash equivalents, and similar items.
        </li>
        <li>
          <strong>Products Violating Privacy or Technology Regulations:</strong>{" "}
          Including illegal surveillance equipment, hacking tools, or products
          violating privacy laws.
        </li>
        <li>
          <strong>Prescription Products:</strong> Any item requiring a
          prescription or professional supervision.
        </li>
        <li>
          <strong>Misleading or False Listings:</strong> Products featuring
          false advertising, misleading information, or deceptive descriptions.
        </li>
        <li>
          <strong>Products Prohibited by Applicable Laws:</strong> Any item that
          fails to comply with national or regional laws, including product
          safety regulations.
        </li>
      </ul>

      <p className="mt-6">
        This list is not exhaustive, and Udua reserves the right to remove any
        product or service that violates our policies, community standards, or
        applicable laws. If you have any questions or concerns regarding this
        list, please contact our support team.
      </p>
    </div>
  );
};

export default ListOfProhibitedProducts;
