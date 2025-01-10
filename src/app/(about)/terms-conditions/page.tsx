import { siteConfig } from "@/config/site";

function page() {
  // const currentDate = new Date().getFullYear();
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  return (
    <div className=" md:max-w-5xl md:container md:mx-auto min-h-screen my-auto flex justify-center items-center">
      <div className="py-8 px-4 flex flex-col gap-4">
        <h1 className=" text-xl font-semibold text-center md:text-3xl">
          UDUA'S TERMS AND CONDITIONS
        </h1>

        <p className=" text-xl">Last updated: {formattedDate}</p>

        <h2>1. Introduction</h2>
        <p>
          1.1. “Udua” is the trading name for Udua, an e-commerce platform that
          operates through a website and mobile application (“marketplace”)
          along with supporting IT logistics and payment infrastructure for the
          sale and purchase of consumer products and services (“products”)
          within the university ecosystem.
        </p>

        <p>
          1.2. These general terms and conditions apply to both buyers and
          sellers on the marketplace and govern your use of the marketplace and
          related services.
        </p>

        <p>
          1.3. By using our marketplace, you accept these general terms and
          conditions in full. If you disagree with these terms and conditions or
          any part of them, you must not use our marketplace.
        </p>

        <p>
          1.4. If you use our marketplace in the course of a business or
          organizational project, then by doing so you:
        </p>

        <ul>
          <li>
            1.4.1. Confirm that you have obtained the necessary authority to
            agree to these general terms and conditions;
          </li>
          <li>
            1.4.2. Bind both yourself and the person, company, or other legal
            entity that operates that business or organizational project to
            these terms and conditions; and
          </li>
          <li>
            1.4.3. Agree that the term “you” in these general terms and
            conditions shall reference both the individual user and the relevant
            person, company, or legal entity unless the context requires
            otherwise.
          </li>
        </ul>

        <h2>2. Registration and Account</h2>
        <p>
          2.1. You may not register with our marketplace if you are under 18
          years of age. By using our marketplace or agreeing to these general
          terms and conditions, you warrant and represent to us that you are at
          least 18 years of age.
        </p>

        <p>
          2.2. If you register for an account with our marketplace, you will be
          asked to provide an email address/user ID and password, and you agree
          to:
        </p>

        <ul>
          <li>2.2.1. Keep your password confidential;</li>
          <li>
            2.2.2. Be responsible for any activity on our marketplace arising
            out of any failure to keep your password confidential, and you may
            be held liable for any losses arising out of such a failure.
          </li>
          <li>
            2.2.3. Your account shall be used exclusively by you, and you shall
            not transfer your account to any third party. If you authorize any
            third party to manage your account on your behalf, this shall be at
            your own risk.
          </li>
          <li>
            2.2.4. We may suspend or cancel your account and/or edit your
            account details at any time in our sole discretion and without
            notice or explanation. If we cancel any products or services you
            have paid for but not received, and you have not breached these
            general terms and conditions, we will refund you in respect of the
            same.
          </li>
        </ul>

        <p>
          You may diactivate your account on our marketplace by contacting us.
        </p>

        <h2>3. Terms and Conditions of Sale</h2>
        <p>3.1. You acknowledge and agree that:</p>

        <ul>
          <li>
            3.1.1. The marketplace provides an online platform for sellers to
            sell and buyers to purchase products;
          </li>
          <li>
            3.1.2. We shall accept binding sales on behalf of sellers, but
            (unless Udua is indicated as the seller) Udua is not a party to the
            transaction between the seller and the buyer; and
          </li>
          <li>
            3.1.3. A contract for the sale and purchase of a product will come
            into force between the buyer and seller, and accordingly, you commit
            to buying or selling the relevant product upon the buyer’s
            confirmation of purchase via the marketplace.
          </li>
        </ul>

        <p>
          3.2. Subject to these general terms and conditions, the seller’s terms
          of business shall govern the contract for sale and purchase between
          the buyer and the seller. Notwithstanding this, the following
          provisions will be incorporated into the contract of sale and
          purchase:
        </p>

        <ul>
          <li>
            3.2.1. The price for a product will be as stated in the relevant
            product listing;
          </li>
          <li>
            3.2.2. The price for the product must include all taxes and comply
            with applicable laws in force from time to time;
          </li>
          <li>
            3.2.3. Delivery charges, packaging charges, handling charges,
            administrative charges, insurance costs, and other ancillary costs
            and charges, where applicable, will only be payable by the buyer if
            this is expressly and clearly stated in the product listing.
            Delivery of digital products may be made electronically;
          </li>
          <li>
            3.2.4. Products must be of satisfactory quality, fit, and safe for
            any purpose specified in, and conform in all material respects to,
            the product listing and any other description of the products
            supplied or made available by the seller to the buyer; and
          </li>
          <li>
            3.2.5. In respect of physical products sold, the seller warrants
            that they have good title to and are the sole legal and beneficial
            owner of the products and/or have the right to supply the products
            pursuant to this agreement. The products are not subject to any
            third-party rights or restrictions, including intellectual property
            rights or any criminal, insolvency, or tax investigation
            proceedings. For digital products, the seller warrants that they
            have the right to supply the digital products to the buyer.
          </li>
        </ul>

        <h2>4. Returns and Refunds</h2>

        <p>
          4.1. Returns of products by buyers and acceptance of returned products
          by sellers shall be managed by us in accordance with the returns page
          on the marketplace as may be amended from time to time. Acceptance of
          returns shall be at our discretion subject to compliance with
          applicable laws of the territory.
        </p>

        <p>
          4.2. Refunds in respect of returned products shall be managed in
          accordance with the refunds page on the marketplace as may be amended
          from time to time. Our rules on refunds shall be exercised at our
          discretion subject to applicable laws of the territory. We may offer
          refunds in our discretion:
        </p>
        <ul>
          <li>4.2.1. In respect of the product price;</li>
          <li>
            4.2.2. Local and/or international shipping fees (as stated on the
            refunds page); and
          </li>
          <li>
            By way of mobile money transfer, bank transfers, or such other
            methods as we may determine from time to time.
          </li>
        </ul>

        <p>
          4.3. Returned products shall be accepted and refunds issued by Udua
          acting for and on behalf of the seller. Notwithstanding paragraphs 4.1
          and 4.2 above, in respect of digital products or services, Udua shall
          issue refunds in respect of failures in delivery only. Refunds of
          payment for such products for any other reasons shall be subject to
          the seller’s terms and conditions of sale.
        </p>

        <p>
          4.4. Changes to our returns page or refunds page shall be effective in
          respect of all purchases made from the date of publication of the
          change on our website.
        </p>

        <h2>5. Payments (Payment Information and Guidelines)</h2>

        <h4> 5.1 Payment Methods Accepted by Udua</h4>
        <p>
          Udua accepts the following methods of payment (availability may vary
          depending on your region):
        </p>
        <ul>
          {/* <li>Payment on delivery</li> */}
          <li>Debit & Credit card</li>
          <li>Bank transfer</li>
          {/* <li>Mobile money transfer</li> */}
        </ul>

        {/* <h4>1.1 Payment on Delivery</h4>
        <p>
          You may make payments for your purchases from the Udua marketplace
          once the goods are delivered to you. You can provide the exact amount
          of the purchase price to the delivery agent in cash or by paying the
          exact amount via mobile money to the Udua payment details that will be
          provided by the delivery agent.
        </p> */}

        <h4>5.1.1 Debit & Credit Cards</h4>
        <p>
          You may make payments for your purchases from the Udua marketplace
          using your debit or credit card. You will be required to input your
          card details during the checkout process. Please refer to Udua’s terms
          and conditions and privacy notice for information on how your details
          are processed.
        </p>

        <h4>5.1.2 Bank Transfer</h4>
        <p>
          You may make payments for your purchases from the Udua marketplace via
          bank transfer. You will be required to input your bank information
          during the checkout process.
        </p>

        {/* <h4>1.4 Mobile Money</h4>
        <p>
          You may make payments for your purchases via mobile money transfer.
          You will be required to input your mobile money account details during
          the checkout process. For more details on how your information is
          processed, please refer to Udua’s privacy policy.
        </p> */}

        {/* <h4>2. Adding or Changing Payment Methods</h4>
        <p>
          You can add a new payment method or change your existing payment
          method at any time by logging into your Udua account and updating your
          profile. You may also add or remove payment methods that are linked to
          your account through UduaPay.
        </p> */}

        <h2>6. Rules About Your Content</h2>

        <p>6.1. In these general terms and conditions, "your content" means:</p>
        <ul>
          <li>
            6.1.1. All works and materials (including, without limitation, text,
            graphics, images, audio material, video material, audio-visual
            material, scripts, software, and files) that you submit to us or our
            marketplace for storage, publication, processing, or onward
            transmission.
          </li>
          <li>
            6.1.2. All communications on the marketplace, including product
            reviews, feedback, and comments.
          </li>
        </ul>

        <p>
          6.2. Your content and its use by us in accordance with these general
          terms and conditions must be accurate, complete, and truthful.
        </p>

        <p>
          6.3. Your content must be appropriate, civil, and tasteful, and must
          accord with generally accepted standards of internet etiquette. Your
          content must not:
        </p>
        <ul>
          <li>
            6.3.1. Be offensive, obscene, indecent, pornographic, lewd,
            suggestive, or sexually explicit;
          </li>
          <li>
            6.3.2. Depict violence in an explicit, graphic, or gratuitous
            manner;
          </li>
          <li>
            6.3.3. Be blasphemous, or breach racial or religious hatred or
            discrimination legislation;
          </li>
          <li>
            6.3.4. Be deceptive, fraudulent, threatening, abusive, harassing,
            anti-social, menacing, hateful, discriminatory, or inflammatory;
          </li>
          <li>
            6.3.5. Cause annoyance, inconvenience, or needless anxiety to any
            person;
          </li>
          <li>6.3.6. Constitute spam.</li>
        </ul>

        <p>
          6.4. Your content must not be illegal or unlawful, infringe any
          person's legal rights, or be capable of giving rise to legal action
          against any person (in any jurisdiction and under any applicable law).
          Specifically, your content must not:
        </p>
        <ul>
          <li>
            6.4.1. Infringe any copyright, moral right, database right,
            trademark right, design right, or any other intellectual property
            right;
          </li>
          <li>
            6.4.2. Infringe any right of confidence, right of privacy, or rights
            under data protection legislation;
          </li>
          <li>
            6.4.3. Breach any contractual obligation owed to any person or any
            court order.
          </li>
        </ul>

        <p>
          6.5. You must not use our marketplace to link to any website or web
          page that, if posted on our marketplace, would breach these general
          terms and conditions.
        </p>

        <p>
          6.6. You must not submit any material to our marketplace that is or
          has ever been the subject of any threatened or actual legal
          proceedings or other similar complaint.
        </p>

        <p>
          6.7. The review function on the marketplace may be used to facilitate
          buyer reviews on products. You shall not use the review function or
          any other form of communication to provide inaccurate, inauthentic, or
          fake reviews.
        </p>

        <p>6.8. You must not interfere with a transaction by:</p>
        <ul>
          <li>
            6.8.1. Contacting another user to buy or sell an item listed on the
            marketplace outside of the marketplace;
          </li>
          <li>
            6.8.2. Communicating with a user involved in an active or completed
            transaction to warn them away from a particular buyer, seller, or
            item;
          </li>
          <li>
            6.8.3. Contacting another user with the intent to collect any
            payments.
          </li>
        </ul>

        <p>
          6.9. You acknowledge that all users of the marketplace are solely
          responsible for interactions with other users. You shall exercise
          caution and good judgment in your communication with users, and you
          must not send them personal information, including credit card
          details.
        </p>

        <p>
          6.10. We may periodically review your content and reserve the right to
          remove any content at our discretion for any reason whatsoever.
        </p>

        <p>
          6.11. If you learn of any unlawful material or activity on our
          marketplace, or any material or activity that breaches these general
          terms and conditions, you may inform us by contacting us.
        </p>

        <h2>7. Our Rights to Use Your Content</h2>

        <p>
          7.1. You grant to us a worldwide, irrevocable, non-exclusive,
          royalty-free license to use, reproduce, store, adapt, publish,
          translate, and distribute your content on our marketplace and across
          our marketing channels, as well as in any existing or future media.
        </p>

        <p>
          7.2. You grant to us the right to sub-license the rights licensed
          under section 7.1.
        </p>

        <p>
          7.3. You grant to us the right to bring an action for infringement of
          the rights licensed under section 7.1.
        </p>

        <p>
          7.4. You hereby waive all your moral rights in your content to the
          maximum extent permitted by applicable law, and you warrant and
          represent that all other moral rights in your content have been waived
          to the maximum extent permitted by applicable law.
        </p>

        <p>
          7.5. Without prejudice to our other rights under these general terms
          and conditions, if you breach our rules on content in any way, or if
          we reasonably suspect that you have breached our rules on content, we
          may delete, unpublish, or edit any or all of your content.
        </p>

        <h2>8. Use of Website and Mobile Applications</h2>

        <p>
          8.1. In this section, the words "marketplace" and "website" shall be
          used interchangeably to refer to Udua's websites.
        </p>

        <p>8.2. You may:</p>
        <ul>
          <li>8.2.1. view pages from our website in a web browser;</li>
          <li>
            8.2.2. download pages from our website for caching in a web browser;
          </li>
          <li>
            8.2.3. print pages from our website for your own personal and
            non-commercial use, provided that such printing is not systematic or
            excessive;
          </li>
          <li>
            8.2.4. stream audio and video files from our website using the media
            player on our website; and
          </li>
          <li>
            8.2.5. use our marketplace services by means of a web browser
            subject to the other provisions of these general terms and
            conditions.
          </li>
        </ul>

        <p>
          8.3. Except as expressly permitted by section 8.2 or the other
          provisions of these general terms and conditions, you must not
          download any material from our website or save any such material to
          your computer.
        </p>

        <p>
          8.4. You may only use our website for your own personal and business
          purposes in respect of selling or purchasing products on the
          marketplace.
        </p>

        <p>
          8.5. Except as expressly permitted by these general terms and
          conditions, you must not edit or otherwise modify any material on our
          website.
        </p>

        <p>
          8.6. Unless you own or control the relevant rights in the material,
          you must not:
        </p>
        <ul>
          <li>
            8.6.1. republish material from our website (including republication
            on another website);
          </li>
          <li>8.6.2. sell, rent, or sub-license material from our website;</li>
          <li>8.6.3. show any material from our website in public;</li>
          <li>
            8.6.4. exploit material from our website for a commercial purpose;
            or
          </li>
          <li>8.6.5. redistribute material from our website.</li>
        </ul>

        <p>
          8.7. Notwithstanding section 8.6, you may forward links to products on
          our website and redistribute our newsletter and promotional materials
          in print and electronic form to any person.
        </p>

        <p>
          8.8. We reserve the right to suspend or restrict access to our
          website, areas of our website, and/or functionality on our website. We
          may, for example, suspend access to the website during server
          maintenance or updates. You must not circumvent or attempt to bypass
          any access restriction measures on the website.
        </p>

        <p>8.9. You must not:</p>
        <ul>
          <li>
            8.9.1. use our website in any way or take any action that causes or
            may cause damage to the website or impairment of its performance,
            availability, accessibility, integrity, or security;
          </li>
          <li>
            8.9.2. use our website in any unethical, unlawful, illegal,
            fraudulent, or harmful manner, or in connection with any unlawful,
            illegal, fraudulent, or harmful purpose or activity;
          </li>
          <li>8.9.3. hack or otherwise tamper with our website;</li>
          <li>
            8.9.4. probe, scan, or test the vulnerability of our website without
            permission;
          </li>
          <li>
            8.9.5. circumvent any authentication or security systems on our
            website;
          </li>
          <li>
            8.9.6. use our website to copy, store, host, transmit, send, use,
            publish, or distribute any material consisting of (or linked to) any
            spyware, virus, Trojan horse, worm, keystroke logger, rootkit, or
            other malicious software;
          </li>
          <li>
            8.9.7. impose an unreasonably large load on our website resources
            (including bandwidth, storage, and processing capacity);
          </li>
          <li>
            8.9.8. decrypt or decipher any communications sent by or to our
            website without permission;
          </li>
          <li>
            8.9.9. conduct any systematic or automated data collection
            activities (such as scraping, data mining, or data harvesting)
            without express written consent;
          </li>
          <li>
            8.9.10. access or interact with our website using automated means
            except for search engine indexing;
          </li>
          <li>
            8.9.11. use our website except by means of our public interfaces;
          </li>
          <li>
            8.9.12. use data from our website for direct marketing activities
            (including email, SMS, or telemarketing); or
          </li>
          <li>8.9.13. interfere with the normal use of our website.</li>
        </ul>

        <h2>9. Copyright and Trademarks</h2>

        <p>
          9.1. Subject to the express provisions of these general terms and
          conditions:
        </p>
        <ul>
          <li>
            9.1.1. We, together with our licensors, own and control all the
            copyright and other intellectual property rights in our website and
            the material on our website; and
          </li>
          <li>
            9.1.2. All the copyright and other intellectual property rights in
            our website and the material on our website are reserved.
          </li>
        </ul>

        <p>
          9.2. Udua's logos and other registered and unregistered trademarks are
          trademarks belonging to us; we do not give permission for the use of
          these trademarks, and such use may constitute an infringement of our
          rights.
        </p>

        <p>
          9.3. The third-party registered and unregistered trademarks or service
          marks on our website are the property of their respective owners. We
          do not endorse, nor are we affiliated with, any of the holders of such
          rights, and therefore cannot grant any license to exercise those
          rights.
        </p>

        <h2>10. Data Privacy</h2>

        <p>
          10.1. Buyers agree to the processing of their personal data in
          accordance with the terms of Udua’s Privacy Policy.
        </p>

        <p>
          10.2. Udua shall process all personal data obtained through the
          marketplace and related services in accordance with the terms of Our
          Privacy Policy.
        </p>

        <p>
          10.3. Sellers shall be directly responsible to buyers for any misuse
          of their personal data, and Udua shall bear no liability to buyers in
          respect of any misuse by sellers of their personal data.
        </p>

        <h2>11. Due Diligence and Audit Rights</h2>

        <p>
          11.1. We operate an anti-fraud and anti-money laundering compliance
          program and reserve the right to perform due diligence checks on all
          users of the marketplace.
        </p>

        <p>
          11.2. You agree to provide to us all such information, documentation,
          and access to your business premises as we may require:
        </p>

        <ul>
          <li>
            11.2.1. in order to verify your adherence to and performance of your
            obligations under these terms and conditions;
          </li>
          <li>
            11.2.2. for the purpose of disclosures pursuant to a valid order by
            a court or other governmental body; or
          </li>
          <li>
            11.2.3. as otherwise required by law or applicable regulation.
          </li>
        </ul>

        <h2>12. Udua’s Role as a Marketplace</h2>

        <p>12.1. You acknowledge that:</p>

        <ul>
          <li>
            12.1.1. Udua facilitates a marketplace for buyers and third-party
            sellers;
          </li>
          <li>
            12.1.2. The relevant seller of the product (whether a third-party
            seller or Udua itself) shall at all times remain exclusively liable
            for the products they sell on the marketplace; and
          </li>
          <li>
            12.1.3. In the event of an issue arising from the purchase of a
            product, the buyer should seek recourse from the relevant seller by
            following the process set out in Udua's Dispute Resolution Policy.
          </li>
        </ul>

        <p>
          12.2. We commit to ensuring that sellers submit information relating
          to their products that is complete, accurate, and up to date. To this
          end:
        </p>

        <ul>
          <li>
            12.2.1. The relevant seller warrants and represents the completeness
            and accuracy of their product information;
          </li>
          <li>
            12.2.2. The relevant seller warrants and represents that the
            material on the marketplace is up to date; and
          </li>
          <li>
            12.2.3. If a buyer has a complaint about the accuracy or
            completeness of the product information, they may seek recourse from
            the relevant seller by following Udua's Dispute Resolution Policy.
          </li>
        </ul>

        <p>
          12.3. We do not warrant that the marketplace will operate without
          fault or that it will remain available during events beyond Udua’s
          control (force majeure), including but not limited to natural
          disasters, hacking, terrorist attacks, or pandemics.
        </p>

        <p>
          12.4. We reserve the right to discontinue or alter our marketplace
          services and to stop publishing the marketplace at any time at our
          discretion, without notice or explanation. You will not be entitled to
          any compensation or other payment upon the discontinuance or
          alteration of services. This is without prejudice to any unfulfilled
          orders or other existing liabilities.
        </p>

        <p>
          12.5. If we discontinue or alter the marketplace under circumstances
          not related to force majeure, we will provide prior notice to buyers
          and sellers of not less than fifteen (15) days with guidance on
          pending transactions or liabilities.
        </p>

        <p>
          12.6. We do not guarantee any commercial results from the use of the
          marketplace.
        </p>

        <p>
          To the maximum extent permitted by applicable law, and subject to
          section 13.1 below, we exclude all representations and warranties
          related to the subject matter of these terms and conditions, our
          marketplace, and its use.
        </p>

        <h2>13. Limitations and Exclusions of Liability</h2>

        <p>13.1. Nothing in these general terms and conditions will:</p>
        <ul>
          <li>
            13.1.1. Limit any liabilities in any way that is not permitted under
            applicable law; or
          </li>
          <li>
            13.1.2. Exclude any liabilities or statutory rights that may not be
            excluded under applicable law.
          </li>
        </ul>

        <p>
          13.2. The limitations and exclusions of liability set out in this
          section 13 and elsewhere in these general terms and conditions:
        </p>
        <ul>
          <li>13.2.1. Are subject to section 13.1; and</li>
          <li>
            13.2.2. Govern all liabilities arising under these general terms and
            conditions or relating to the subject matter of these general terms
            and conditions, including liabilities arising in contract, in tort
            (including negligence), and for breach of statutory duty except to
            the extent expressly provided otherwise in these general terms and
            conditions.
          </li>
        </ul>

        <p>
          13.3. In respect of services offered to you free of charge, we will
          not be liable to you for any loss or damage of any nature whatsoever.
        </p>

        <p>
          13.4. Our aggregate liability to you in respect of any contract to
          provide services under these general terms and conditions shall not
          exceed the total amount paid and payable to us under the contract.
          Each separate transaction on the marketplace shall constitute a
          separate contract for the purposes of this section 13.
        </p>

        <p>
          13.5. Notwithstanding section 13.4 above, we will not be liable to you
          for any loss or damage of any nature, including in respect of:
        </p>
        <ul>
          <li>
            13.5.1. Any losses occasioned by any interruption or dysfunction to
            the website;
          </li>
          <li>
            13.5.2. Any losses arising out of any event or events beyond our
            reasonable control;
          </li>
          <li>
            13.5.3. Any business losses including (without limitation) loss of
            or damage to profits, income, revenue, use, production, anticipated
            savings, business, contracts, commercial opportunities, or goodwill;
          </li>
          <li>
            13.5.4. Any loss or corruption of any data, database, or software;
            or
          </li>
          <li>
            13.5.5. Any special, indirect, or consequential loss or damage.
          </li>
        </ul>

        <p>
          13.6. We accept that we have an interest in limiting the personal
          liability of our officers and employees. Having regard to that
          interest, you acknowledge that we are a limited liability entity; you
          agree that you will not bring any claim personally against our
          officers or employees in respect of any losses you suffer in
          connection with the marketplace or these general terms and conditions
          (this does not limit or exclude the liability of the limited liability
          entity itself for the acts and omissions of our officers and
          employees).
        </p>

        {/* <p>
          13.7. Our marketplace includes hyperlinks to other websites owned and
          operated by third parties; such hyperlinks are not recommendations. We
          have no control over third-party websites and their contents, and we
          accept no responsibility for them or for any loss or damage that may
          arise from your use of them.
        </p> */}

        <h2>14. Indemnification</h2>

        <p>
          14.1. You hereby indemnify us and undertake to keep us indemnified
          against:
        </p>
        <ul>
          <li>
            14.1.1. Any and all losses, damages, costs, liabilities, and
            expenses (including, without limitation, legal expenses and any
            amounts paid by us to any third party in settlement of a claim or
            dispute) incurred or suffered by us and arising directly or
            indirectly out of your use of our marketplace or any breach by you
            of any provision of these general terms and conditions or the Udua
            codes, policies, or guidelines; and
          </li>
          <li>
            14.1.2. Any VAT liability or other tax liability that we may incur
            in relation to any sale, supply, or purchase made through our
            marketplace, where that liability arises out of your failure to pay,
            withhold, declare, or register to pay any VAT or other tax properly
            due in any jurisdiction.
          </li>
        </ul>

        <h2>15. Breaches of these General Terms and Conditions</h2>

        <p>
          15.1. If we permit the registration of an account on our marketplace,
          it will remain open indefinitely subject to these general terms and
          conditions.
        </p>

        <p>
          15.2. If you breach these general terms and conditions or if we
          reasonably suspect that you have breached these general terms and
          conditions or any Udua codes, policies, or guidelines in any way, we
          may:
        </p>
        <ul>
          <li>15.2.1. Temporarily suspend your access to our marketplace;</li>
          <li>
            15.2.2. Permanently prohibit you from accessing our marketplace;
          </li>
          <li>
            15.2.3. Block computers using your IP address from accessing our
            marketplace;
          </li>
          <li>
            15.2.4. Contact any or all of your internet service providers and
            request that they block your access to our marketplace;
          </li>
          <li>
            15.2.5. Suspend or delete your account on our marketplace; and/or
          </li>
          <li>
            15.2.6. Commence legal action against you whether for breach of
            contract or otherwise.
          </li>
        </ul>

        <p>
          15.3. Where we suspend, prohibit, or block your access to our
          marketplace or a part of our marketplace, you must not take any action
          to circumvent such suspension or prohibition or blocking (including,
          without limitation, creating and/or using a different account).
        </p>

        <h2>16. Entire Agreement</h2>

        <p>
          16.1. These general terms and conditions and the Udua codes, policies,
          and guidelines (and in respect of sellers, the seller terms and
          conditions) shall constitute the entire agreement between you and us
          in relation to your use of our marketplace and shall supersede all
          previous agreements between you and us in relation to your use of our
          marketplace.
        </p>

        <h2>
          <span className="font-semibold text-lg">17. Changes to Terms:</span>
        </h2>

        <p>
          17.1 We may update these Terms and Conditions from time to time. The{" "}
          <strong>Last updated</strong> will indicate the most recent revisions.
          Continued use of our services after changes constitutes acceptance of
          the modified terms.
        </p>

        <h2>
          <span className="font-semibold text-lg">18. Contact Us:</span>
        </h2>

        <p>
          18.1 If you have any questions or concerns about these Terms and
          Conditions, please contact us at contact{siteConfig.name}@gmail.com.{" "}
        </p>

        <p>
          Thank you for choosing{" "}
          <span className=" font-semibold font-mono">{siteConfig.name}</span>.
          We appreciate your adherence to these terms as they contribute to a
          safe and enjoyable shopping experience for all users.
        </p>

        {/* <p>Welcome to <span className=' font-semibold font-mono'>{siteConfig.name}</span> By using our website, you agree to comply with and be bound by the following Terms and Conditions. Please read these terms carefully before using our services.</p>

        <p><span className='font-semibold text-lg'>1. Acceptance of Terms:</span> - By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.</p>

        <p><span className='font-semibold text-lg'>2. Use of Services:</span> - You must be at least 15 years old to use our services. By using our website, you affirm that you are at least 15 years old or have the consent of a parent or guardian.</p>

        {/* <p><span className='font-semibold text-lg'>3. User Account:</span> - You may be required to create a user account to access certain features of our website. You are responsible for maintaining the confidentiality of your account information.</p> *

        <p><span className='font-semibold text-lg'>3. Order and Payment:</span> - When you place an order on our website, you agree to provide accurate and complete information for the purchase.</p>

        <p><span className='font-semibold text-lg'>4. Product Information:</span> - We strive to provide accurate product information, but we do not guarantee the accuracy, completeness, or reliability of any product descriptions or other content on the site.</p>

        <p><span className='font-semibold text-lg'>5. Intellectual Property:</span> - All content on our website, including logos, images, and text, is the property of <span className=' font-semibold font-mono'>{siteConfig.name}</span> and is protected by intellectual property laws. You may not use, reproduce, or distribute any content without our written permission.</p>

        <p><span className='font-semibold text-lg'>6. Limitation of Liability:</span> - <span className=' font-semibold font-mono'>{siteConfig.name}</span> is not liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our website or products.</p>

        <p><span className='font-semibold text-lg'>7. Indemnification:</span> - You agree to indemnify and hold <span className=' font-semibold font-mono'>{siteConfig.name}</span> harmless from any claims, damages, or expenses arising out of your use of our services.</p>

        <p><span className='font-semibold text-lg'>8. Termination:</span> - We reserve the right to terminate or suspend your account and access to our services at our discretion, without prior notice.</p>

        <p><span className='font-semibold text-lg'>9. Governing Law:</span> - These Terms and Conditions are governed by and construed in accordance with the laws of [Your Country/State].</p>

        <p><span className='font-semibold text-lg'>10. Changes to Terms:</span> - We may update these Terms and Conditions from time to time. The <strong>Effective Date</strong> will indicate the most recent revisions. Continued use of our services after changes constitutes acceptance of the modified terms.</p>

        <p><span className='font-semibold text-lg'>11. Contact Us:</span> - If you have any questions or concerns about these Terms and Conditions, please contact us at contact{siteConfig.name}@gmail.com. </p>
        
        <p>Thank you for choosing <span className=' font-semibold font-mono'>{siteConfig.name}</span>. We appreciate your adherence to these terms as they contribute to a safe and enjoyable shopping experience for all users.</p> */}
      </div>
    </div>
  );
}

export default page;
