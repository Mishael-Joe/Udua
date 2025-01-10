import { siteConfig } from "@/config/site";

function page() {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  return (
    <div className=" md:max-w-5xl md:container md:mx-auto min-h-screen my-auto flex justify-center items-center">
      <div className="py-8 px-4 flex flex-col gap-4">
        <h1 className=" text-xl font-semibold text-center md:text-3xl">
          Udua's Privacy Policy
        </h1>

        <p className=" text-xl">Last updated: {formattedDate}</p>

        <p>
          At <span className=" font-semibold font-mono">{siteConfig.name}</span>{" "}
          we are committed to protecting the privacy of our users. This Privacy
          Policy outlines the information we collect, how we use it, and the
          choices you have regarding your personal information. By using our
          website, you agree to the terms outlined in this policy.
        </p>

        <p className="">Information We Collect:</p>

        <p>
          Personal data means any information that can be used to identify
          directly or indirectly a specific individual. We collect your personal
          data in order to provide tailored products and services and to analyze
          and continually improve our products and services. We may collect,
          use, store, and transfer different kinds of personal data for
          marketing and personal data optimization purposes.
        </p>

        <p>
          You provide us with your personal data when you register your personal
          details on our website and transact with the same.
        </p>

        <p>The personal data we collect includes:</p>

        <ul>
          <li>
            <strong>Information you provide to us:</strong> We receive and store
            the information you provide to us including your identity data,
            contact data, delivery address, and financial data. These types of
            personal data may include:
          </li>
          <ul>
            <li>
              Contact details (such as your name, postal addresses, phone
              numbers, and email addresses)
            </li>
            <li>
              Online registration information (such as your password and other
              authentication information)
            </li>
            <li>
              Payment information (such as your credit card information and
              billing address)
            </li>
            <li>
              Information provided as part of online questionnaires (such as
              responses to any customer satisfaction surveys or market research)
            </li>
            {/* <li>Competition entries/submissions</li> */}
            <li>In certain cases, your marketing preferences</li>
          </ul>
        </ul>

        <h2>
          Information We Automatically Collect or Obtain from Third Parties
        </h2>
        <p>
          We automatically gather and store certain types of information about
          your interactions with the Udua platform, such as your searches,
          views, downloads, and purchases. Additionally, we may receive data
          about you from third parties, including our shipping partners, payment
          service providers, merchants/brands, and advertising networks.
        </p>
        <p>
          This type of personal data can relate to your device (such as a PC,
          tablet, or mobile phone), how you use our websites and apps (as well
          as certain third-party sites we work with), and/or your personal
          preferences, interests, or location. Examples of this information
          include:
        </p>
        <ul>
          <li>Your name and age (or estimated age range)</li>
          <li>
            Details about your device, operating system, browser, and IP address
          </li>
          <li>Unique identifiers linked to your device</li>
          <li>Information on the web pages you've visited</li>
          <li>
            Products you've searched for, viewed, purchased, or added to a
            shopping basket
          </li>
          <li>
            Time spent on specific areas of our site or app, along with the date
            and time of your visit
          </li>
          <li>
            Personal data in user-generated content (like blog posts or social
            media activity)
          </li>
          <li>Your social media username or ID</li>
          <li>
            Your social media profile photo and other profile details (such as
            the number of followers)
          </li>
        </ul>

        <h2>Cookies and Other Identifiers</h2>
        <p>
          A cookie is a small file containing letters and numbers that we place
          on your computer, mobile phone, or tablet with your consent. Cookies
          help us distinguish you from other users of our website and mobile
          applications, enabling us to offer you a more personalized and
          improved browsing experience.
        </p>

        <p className="">How We Use Your Information:</p>

        <p>
          We use your personal data to operate, provide, develop, and improve
          the products and services that we offer, including the following:
        </p>
        <ul>
          <li>Registering you as a new customer.</li>
          <li>Processing and delivering your orders.</li>
          <li>Managing your relationship with us.</li>
          <li>
            Enabling you to participate in promotions, competitions, and
            surveys.
          </li>
          <li>Improving our website, applications, products, and services.</li>
          <li>
            Recommending or advertising products or services that may be of
            interest to you.
          </li>
          <li>
            Enabling you to access certain products and services offered by our
            partners and vendors.
          </li>
          <li>
            Complying with our legal obligations, including verifying your
            identity where necessary.
          </li>
          <li>Detecting fraud.</li>
        </ul>

        <h2>Legal Basis for the Processing of Personal Data</h2>
        <p>
          We will only process your personal data where we have a legal basis to
          do so. The legal basis will depend on the purposes for which we have
          collected and used your personal data. In almost every case, the legal
          basis will be one of the following:
        </p>
        <ul>
          <li>
            <strong>Consent:</strong> For example, where you have provided your
            consent to receive certain marketing from us. You can withdraw your
            consent at any time, including by clicking on the “unsubscribe” link
            at the bottom of any marketing email we send you.
          </li>
          <li>
            <strong>Our legitimate business interests:</strong> Where it is
            necessary for us to understand our customers, promote our services,
            and operate effectively, provided in each case that this is done in
            a legitimate way which does not unduly affect your privacy and other
            rights.
          </li>
          <li>
            <strong>Performance of a contract with you:</strong> This would also
            apply where we need to take steps prior to entering into a contract
            with you. For example, where you have purchased a product from us
            and we need to use your contact details and payment information in
            order to process your order and send the product to you.
          </li>
          <li>
            <strong>Compliance with law:</strong> Where we are subject to a
            legal obligation and need to use your personal data in order to
            comply with that obligation.
          </li>
        </ul>

        <h2>How We Share Your Personal Data</h2>
        <p>
          A. We may need to share your personal data with third parties for the
          following purposes:
        </p>
        <ul>
          <li>
            <strong>Sale of products and services:</strong> In order to deliver
            products and services purchased on our marketplace from third
            parties, we may be required to provide your personal data to such
            third parties.
          </li>
          <li>
            <strong>Working with third party service providers:</strong> We
            engage third parties to perform certain functions on our behalf.
            Examples include fulfilling orders for products or services,
            delivering packages, analyzing data, providing marketing assistance,
            processing payments, transmitting content, assessing and managing
            credit risk, and providing customer service.
          </li>
          <li>
            <strong>Business transfers:</strong> As we continue to develop our
            business, we might sell or buy other businesses or services. In such
            transactions, customer information may be transferred together with
            other business assets.
          </li>
          <li>
            <strong>Detecting fraud and abuse:</strong> We release account and
            other personal data to other companies and organizations for fraud
            protection and credit risk reduction, and to comply with applicable
            law.
          </li>
        </ul>

        <p>B. When we share your personal data with third parties we:</p>
        <ul>
          <li>
            Require them to agree to use your data in accordance with the terms
            of this Privacy Notice, our Privacy Policy and in accordance with
            applicable law;
          </li>
          <li>
            Only permit them to process your personal data for specified
            purposes and in accordance with our instructions. We do not allow
            our third-party service providers to use your personal data for
            their own purposes.
          </li>
        </ul>

        <h2>Data Retention</h2>
        <p>
          We will take every reasonable step to ensure that your personal data
          is processed for the minimum period necessary for the purposes set out
          in this Privacy Policy. Your Personal Data may be retained in a form
          that allows for identification only for as long as:
        </p>
        <ul>
          <li>
            <strong>A.</strong> We maintain an ongoing relationship with you.
            This will enable us to improve your experience with us and to ensure
            that you receive communications from us.
          </li>
          <li>
            <strong>B.</strong> Your Personal Data is necessary in connection
            with the purposes set out in this Privacy Policy and we have a valid
            legal basis.
          </li>
          <li>
            <strong>C.</strong> The duration of:
            <ul>
              <li>
                (i) any applicable limitation period (i.e., any period during
                which a person could bring a legal claim against us), and
              </li>
            </ul>
          </li>
        </ul>
        <p>
          We will actively review the personal data we hold and delete it
          securely, or in some cases anonymise it, when there is no longer a
          legal, business or consumer need for it to be retained.
        </p>

        <h2>Data Security</h2>
        <p>
          We have put in place security measures to prevent your personal data
          from being accidentally lost, used or accessed in an unauthorised way,
          altered or disclosed.
        </p>
        <p>
          In addition, we limit access to your personal data to those employees,
          agents, contractors, and other third parties who have a business need
          to know. They will only process your personal data on our instructions
          and they are subject to a duty of confidentiality.
        </p>
        <p>
          We have put in place procedures to deal with any suspected personal
          data breach and will notify you and any applicable regulator of a
          breach where we are legally required to do so.
        </p>

        <p className=" text-center py-2 font-bold text-lg">Your Choices:</p>

        <p>
          <strong>A.</strong> It is important that the personal data we hold
          about you is accurate and current. Please keep us informed if your
          personal data changes during your relationship with us.
        </p>
        <p>
          <strong>B.</strong> Under certain circumstances, you have rights under
          data protection laws in relation to your personal data, including the
          right to access, correct or erase your personal data, object to or
          restrict processing of your personal data, right to ask that we
          transfer your personal data to a third party, and unsubscribe from our
          emails and newsletters.
        </p>
        <p>
          <strong>C.</strong> Where you wish to permanently delete your data
          from our website and other applications, you can choose the option of
          closing your account. Once your account is closed, all products and
          services that you access through your account will no longer be
          available.
        </p>
        <p>
          <strong>D.</strong> We can refuse to accede to your request where it
          is unreasonable or where you have failed to provide additional
          information necessary to confirm your identity.
        </p>

        <h2>Data Controllers & Contact</h2>
        <p>
          If you have any questions or concerns about Udua's Privacy Notice or
          you are looking for more information on how we process your personal
          data, or wish to exercise your legal rights in respect of your
          personal data, You can contact us by email at [email]
        </p>
        <p>
          We will investigate any complaint about the way we manage Personal
          Data and ensure that we respond to all substantiated complaints within
          prescribed timelines.
        </p>

        <p>
          <span className="font-semibold text-lg">
            Changes to this Privacy Policy:
          </span>{" "}
          - We may update this Privacy Policy periodically. The{" "}
          <strong>'LAST UPDATED'</strong> will indicate the most recent
          revisions.
        </p>

        <p>
          <span className="font-semibold text-lg">Contact Us:</span> - If you
          have any questions or concerns about this Privacy Policy, please
          contact us at contact{siteConfig.name}@gmail.com.
        </p>

        <p>
          Thank you for trusting{" "}
          <span className=" font-semibold font-mono">{siteConfig.name}</span>.
          Your privacy is important to us, and we are dedicated to ensuring the
          security and confidentiality of your personal information.
        </p>
      </div>
    </div>
  );
}

export default page;
