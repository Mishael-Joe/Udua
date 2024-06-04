import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function addCommasToNumber(number: number) {
  if (typeof number !== "number") {
    return number; // Return unchanged if it's not a number
  }

  const numberStr = number.toString();
  const parts = numberStr.split(".");

  // Split the number into its integer and decimal parts
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const decimalPart = parts[1] ? "." + parts[1] : "";

  // Combine the integer and decimal parts
  return integerPart + decimalPart;
}

export function getSizeName(value: string) {
  switch (value) {
    case "xs":
      return "X-Small";
    case "s":
      return "Small";
    case "m":
      return "Medium";
    case "l":
      return "Large";
    case "xl":
      return "X-Large";
    case "one-size":
      return "One Size";
  }
}

export const uploadImagesToCloudinary = async (images: File[]) => {
  try {
    // Fetch the timestamp and signature from the server
    const {
      data: { timestamp, signature },
    } = await axios.post("/api/cloudinaryImages");

    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
    const uploadedImageUrls = [];

    for (let image of images) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

      try {
        const uploadResponse = await axios.post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        uploadedImageUrls.push(uploadResponse.data.secure_url);
      } catch (uploadError) {
        console.error(`Error uploading image ${image.name}:`, uploadError);
        throw new Error(`Error uploading image ${image.name}: ${uploadError}`);
      }
    }

    return uploadedImageUrls;
  } catch (error: any) {
    console.error("Error uploading images to Cloudinary:", error);
    throw new Error(`Error uploading images to Cloudinary: ${error.message}`);
  }
};

// const mailOptions = {
//   from: "mishaeljoe55@zohomail.com", // sender address
//   to: "mishaeljoe55@gmail.com", // list of receivers
//   subject: "New Successful Transaction Notification", // Subject line
//   text: "Beging Delivering Process", // plain text body
//   html: `
//     <h1>Great news! A new transaction has been successfully processed on Alfa-Mercado.</h1>
//     <h3>NOTE: Before giving the customer value always confirm the Transaction status to see if it is a success or failure status</h3> </br>
//     <h3>Here are the details:</h3> </br>

//     <p>Transaction Details:</p>
//     <ul>
//       <li> Transaction ID: <b>${transactionId}<b><li>
//       <li> Transaction Amount: <b>${transactionAmount}<b><li>
//       <li> Transaction Reference: <b>${resultTransactionReference}<b><li>
//       <li> Payment Type: <b>${paymentType}<b><li>
//       <li> Processor Response: <b>${processorResponse}</b><li>
//       <li> Transaction Status: <b>${status}<b><li>
//       <li> verification Status: <b>${eventStatus}<b><li>
//       <li> verification message: <b>${eventMessage}<b><li>
//       <li> Transaction Date: <b>${new Date(
//         createdAt
//       ).toLocaleString()}<b><li>
//     </ul>

//     <p>Customer Details:</p>
//       <ul>
//       <li> Customer Name: <b>${customerName}<b><li>
//       <li> Customer Email: <b>${customerEmail}<b><li>
//       <li> Customer Phone Number: <b>${customerPhoneNumber}<b><li>
//       <li> Card Type: <b>${cardType}<b> <li>
//       <li> Delivery Method: <b>${deliveryMethod}<b><li>
//     </ul>

//     <p>Customer Product(s):</p>
//     ${arrOfProducts.map(
//       (product: ProductForMailOptions) =>
//         "\nProduct Name: " +
//         product.product_name +
//         ", \nLink to Product Image: " +
//         product.new_Img +
//         ", \nProduct quantity: " +
//         product.quantity +
//         ", \nProduct price: " +
//         product.price +
//         ", \nCompany Name: " +
//         product.company +
//         ", \nProduct Sizes: " +
//         product.sizes +
//         ", \nProduct Category: " +
//         product.category +
//         ", \nProduct Color: " +
//         product.color
//     )}

//     <h3>NOTE: Before giving the customer value, Please review this information to ensure everything looks correct. If you have any questions or need further assistance, feel free to reach out.</h3>
//     <p>Thank you for your attention, and congratulations on the successful transaction!</p>

//     <b>Best regards</b>
//     <b>Alfa-Mercado Automated Notification</b>
//   `, // html body
// };

// const customersSuccessPayment = {
//   from: "mishaeljoe55@zohomail.com", // sender address
//   to: `${customerEmail}`, // list of receivers
//   subject: "Successful Transaction Notification", // Subject line
//   text: "", // plain text body
//   html: `
//     <h2>Congratulations! We are thrilled to inform you that your recent transaction on Alfa-Mercado was successful. Your purchase has been confirmed, and we are grateful for your trust in us.</h2>
//     <h3>Here are the details:</h3> </br>

//     <p>Transaction Details:</p>
//     <ul>
//       <li> Transaction ID: <b>${transactionId}<b><li>
//       <li> Transaction Amount: <b>${transactionAmount}<b><li>
//       <li> Transaction Reference: <b>${resultTransactionReference}<b><li>
//       <li> Payment Type: <b>${paymentType}<b><li>
//       <li> Processor Response: <b>${processorResponse}</b><li>
//       <li> Transaction Status: <b>${status}<b><li>
//       <li> Transaction Date: <b>${new Date(
//         createdAt
//       ).toLocaleString()}<b><li>
//     </ul>

//     <h4>Your order is now being processed, and you can expect the following:</h4>
//     <p>Shipping Information:</p>
//     <ul>
//       <li> Estimated Delivery Date: <b>3 days<b><li>
//       <li> Delivery Method: <b>${deliveryMethod}<b><li>
//     </ul>

//     <p>Product Details:</p>
//     ${arrOfProducts.map(
//       (product: ProductForMailOptions) =>
//         "\nProduct Name: " +
//         product.product_name +
//         ", \nProduct quantity: " +
//         product.quantity +
//         ", \nProduct price: " +
//         product.price
//     )}

//     <p>Payment Summary:</p>
//     <ul>
//       <li> Total Amount: <b>${transactionAmount}<b> <li>
//     </ul>

//     <p>If you have any questions or concerns regarding your order, feel free to contact our support team at mishaeljoe55@zohomail.com.</p>
//     <p>Thank you for choosing Alfa-Mercado. We appreciate your business and look forward to serving you again in the future.</p>

//     <b>Best regards</b>
//     <b>Alfa-Mercado Team</b>
//   `, // html body
// };

// await transporter.sendMail(mailOptions);
// await transporter.sendMail(customersSuccessPayment);

// const mailOptions = {
//   from: "mishaeljoe55@zohomail.com", // sender address
//   to: `${customerEmail}`, // list of receivers
//   subject: "Failed Transaction Notification", // Subject line
//   text: "unsuccessful Payment", // plain text body
//   html: `
//     <h1>Failed Transaction Notification</h1> </br>

//     <h3>Dear ${customerName}, </h3> </br>

//     <p>We hope this message finds you well. We regret to inform you that your recent transaction on Alfa-Mercado was unsuccessful. Our records indicate that there was an issue with the payment method you provided.</p> </br>

//     <p>Transaction Details:</p>
//     <ul>
//       <li> Transaction ID: <b>${transactionId}<b><li>
//       <li> Transaction Amount: <b>${transactionAmount}<b><li>
//       <li> Transaction Reference: <b>${resultTransactionReference}<b><li>
//       <li> Payment Type: <b>${paymentType}<b><li>
//       <li> Processor Response: <b>${processorResponse}</b><li>
//       <li> Transaction Status: <b>${status}<b><li>
//       <li> Transaction Date: <b>${new Date(
//         createdAt
//       ).toLocaleString()}<b><li>
//     </ul>

//     <p>Please review your payment details and ensure that they are accurate. If you believe there has been an error, you may want to contact your financial institution or try an alternative payment method.</p>
//     <p>If you continue to experience issues, feel free to reach out to our support team at mishaeljoe55@zohomail.com</p>
//     <p>We apologize for any inconvenience this may have caused. Thank you for choosing Alfa-Mercado, and we appreciate your understanding.</p>

//     <b>Best regards,</b>
//     <p>Alfa-Mercado Team</p>
//   `, // html body
// };

// const automatedFailNotification = {
//   from: "mishaeljoe55@zohomail.com", // sender address
//   to: `mishaeljoe55@gmail.com`, // list of receivers
//   subject: "Alert: Failed Transaction Notification on Alfa-Mercado", // Subject line
//   text: "unsuccessful Payment", // plain text body
//   html: `
//     <h1>Failed Transaction Notification</h1> </br>

//     <h3>Dear Mishael, </h3> </br>

//     <p>This is an automated notification from Alfa-Mercado regarding a failed transaction. Please review the details below:</p> </br>

//     <p>Transaction Details:</p>
//     <ul>
//       <li> Customer Name: <b>${customerName}<b><li>
//       <li> Transaction ID: <b>${transactionId}<b><li>
//       <li> Transaction Amount: <b>${transactionAmount}<b><li>
//       <li> Transaction Reference: <b>${resultTransactionReference}<b><li>
//       <li> Payment Type: <b>${paymentType}<b><li>
//       <li> Processor Response: <b>${processorResponse}</b><li>
//       <li> Transaction Status: <b>${status}<b><li>
//       <li> Transaction Date: <b>${new Date(
//         createdAt
//       ).toLocaleString()}<b><li>
//     </ul>

//     <b>Action Required:</b>
//     <p>Please investigate the issue promptly. Check the provided transaction details and identify the cause of the failure. If necessary, reach out to the customer to provide assistance or request updated payment information.</p>
//     <p>If you need further assistance or have any questions, feel free to contact our support team.</p>
//     <p>Thank you for your attention to this matter.</p>

//     <b>Best regards,</b>
//     <p>Alfa-Mercado Automated System</p>
//   `, // html body
// };

// await transporter.sendMail(mailOptions);
// await transporter.sendMail(automatedFailNotification);

// type ProductForMailOptions = {
//   product_name: number;
//   quantity: number;
//   color?: string[];
//   new_Img: string;
//   sizes?: string[];
//   company?: string;
//   name: string;
//   category?: string[];
//   price: number;
// };
