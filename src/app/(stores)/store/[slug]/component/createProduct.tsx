// "use client";

// // Core Imports
// import { useEffect, useMemo, useCallback, useState } from "react";
// import { usePathname, useRouter } from "next/navigation";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import axios from "axios";

// // UI Components
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { ChevronRight, Loader2, Upload, XIcon } from "lucide-react";

// // Utilities & Types
// import { useToast } from "@/components/ui/use-toast";
// import { uploadImagesToCloudinary } from "@/lib/utils";
// import { DigitalProduct, Product } from "@/types";
// import {
//   createDigitalProduct,
//   createProduct,
// } from "@/lib/actions/product.action";
// import {
//   productTypeArr,
//   bookCategories,
//   productCategories,
//   subCategories,
// } from "@/constant/constant";

// // Lazy-loaded Components
// const QuillEditor = dynamic(() => import("react-quill"), {
//   ssr: false,
//   loading: () => (
//     <div className="h-[200px] bg-gray-100 animate-pulse rounded-md" />
//   ),
// });

// // Constants
// const QUILL_MODULES = {
//   toolbar: [
//     ["bold", "italic", "underline", "strike", "blockquote"],
//     [{ list: "ordered" }, { list: "bullet" }],
//     ["clean"],
//   ],
// };

// const QUILL_FORMATS = [
//   "bold",
//   "italic",
//   "underline",
//   "strike",
//   "blockquote",
//   "list",
//   "bullet",
// ];

// type ProductFormProps = {
//   id: string;
// };

// export default function CreateProduct({ id }: ProductFormProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { toast } = useToast();
//   const [productType, setProductType] = useState<
//     "Physical Product" | "Digital Product"
//   >("Physical Product");
//   const [isLoading, setIsLoading] = useState(false);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);

//   // Product State Management
//   const [physicalProduct, setPhysicalProduct] = useState<PhysicalProductState>({
//     /* Initial state */
//   });
//   const [digitalProduct, setDigitalProduct] = useState<DigitalProductState>({
//     /* Initial state */
//   });

//   // Memoized values
//   const sizeOptions = useMemo(
//     () =>
//       physicalProduct.subCategory === "Footwear"
//         ? Array.from({ length: 20 }, (_, i) => (39 + i * 0.5).toFixed(1))
//         : ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"],
//     [physicalProduct.subCategory]
//   );

//   // Cleanup image previews
//   useEffect(
//     () => () => {
//       imagePreviews.forEach(URL.revokeObjectURL);
//     },
//     [imagePreviews]
//   );

//   // Reusable Handlers
//   const handleFileUpload = useCallback(
//     async (files: File[], maxSize: number) => {
//       const validFiles = files.filter(
//         (file) =>
//           file.size <= maxSize &&
//           ["image/jpeg", "image/png", "image/webp"].includes(file.type)
//       );

//       if (validFiles.length !== files.length) {
//         throw new Error("Invalid file type or size");
//       }

//       return uploadImagesToCloudinary(validFiles);
//     },
//     []
//   );

//   // Optimized Validation Logic
//   const validateForm = useCallback(
//     (formData: FormDataType, type: ProductType) => {
//       const errors: string[] = [];

//       // Common validations
//       if (!formData.name?.trim() || formData.name.length < 5) {
//         errors.push("Name must be at least 5 characters");
//       }

//       // Type-specific validations
//       if (type === "Physical Product") {
//         if (!formData.images?.length)
//           errors.push("At least one image required");
//       }

//       return errors.length ? errors.join(", ") : null;
//     },
//     []
//   );

//   // Unified Submit Handler
//   const handleSubmit = useCallback(
//     async (e: React.FormEvent, type: ProductType) => {
//       e.preventDefault();
//       setIsLoading(true);

//       try {
//         const validationError = validateForm(
//           type === "Physical Product" ? physicalProduct : digitalProduct,
//           type
//         );
//         if (validationError) throw new Error(validationError);

//         // Common processing
//         const images = await handleFileUpload(
//           type === "Physical Product"
//             ? physicalProduct.images
//             : digitalProduct.coverIMG,
//           5 * 1024 * 1024
//         );

//         // Type-specific processing
//         const productData =
//           type === "Physical Product"
//             ? await processPhysicalProduct(images)
//             : await processDigitalProduct(images);

//         await (type === "Physical Product"
//           ? createProduct
//           : createDigitalProduct)(productData);
//         router.back();
//       } catch (error) {
//         toast({
//           variant: "destructive",
//           title: "Error",
//           description: error.message,
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     [physicalProduct, digitalProduct, validateForm, handleFileUpload]
//   );

//   // Reusable Components
//   const FormCard = ({ title, description, children }: FormCardProps) => (
//     <Card>
//       <CardHeader>
//         <CardTitle>{title}</CardTitle>
//         {description && <CardDescription>{description}</CardDescription>}
//       </CardHeader>
//       <CardContent className="grid gap-4">{children}</CardContent>
//     </Card>
//   );

//   const FileUploadField = ({
//     name,
//     accept,
//     multiple,
//     onChange,
//   }: FileUploadProps) => (
//     <div className="relative aspect-square group">
//       <label className="flex items-center justify-center w-full h-full cursor-pointer">
//         <Upload className="w-10 h-10 text-muted-foreground transition-colors group-hover:text-primary" />
//         <input
//           name={name}
//           type="file"
//           accept={accept}
//           multiple={multiple}
//           onChange={onChange}
//           className="absolute inset-0 opacity-0 cursor-pointer"
//           aria-label={`Upload ${name}`}
//         />
//       </label>
//     </div>
//   );

//   return (
//     <section className="max-w-5xl mx-auto">
//       <h1 className="sr-only">Create Product</h1>

//       <div className="space-y-8">
//         <FormCard
//           title="Product Type"
//           description="Select the type of product you're creating"
//         >
//           <select
//             value={productType}
//             onChange={(e) => setProductType(e.target.value as ProductType)}
//             className="w-full p-3 border rounded-lg bg-background"
//             aria-label="Select product type"
//           >
//             {productTypeArr.map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//         </FormCard>

//         {productType === "Physical Product" && (
//           <form
//             onSubmit={(e) => handleSubmit(e, "Physical Product")}
//             className="space-y-8"
//           >
//             {/* Physical Product Form Sections */}
//             <FormCard
//               title="Product Details"
//               description="Vividly describe your product"
//             >
//               {/* Form Fields */}
//             </FormCard>

//             <FormCard title="Product Images">
//               <FileUploadField
//                 name="images"
//                 accept="image/*"
//                 multiple
//                 onChange={handlePhysicalChange}
//               />
//               {/* Image Previews */}
//             </FormCard>
//           </form>
//         )}

//         {productType === "Digital Product" && (
//           <form
//             onSubmit={(e) => handleSubmit(e, "Digital Product")}
//             className="space-y-8"
//           >
//             {/* Digital Product Form Sections */}
//             <FormCard title="Digital Product Details">
//               {/* Form Fields */}
//             </FormCard>

//             <FormCard title="Cover Image">
//               <FileUploadField
//                 name="coverIMG"
//                 accept="image/*"
//                 onChange={handleDigitalChange}
//               />
//             </FormCard>
//           </form>
//         )}

//         <div className="flex justify-end gap-4">
//           <Button
//             type="submit"
//             disabled={isLoading}
//             aria-busy={isLoading}
//             className="min-w-[120px]"
//           >
//             {isLoading ? (
//               <Loader2 className="animate-spin" />
//             ) : (
//               "Create Product"
//             )}
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { getCookie } from "cookies-next";
import {
  createDigitalProduct,
  createProduct,
} from "@/lib/actions/product.action";
import { DigitalProduct, Product } from "@/types";
import { uploadImagesToCloudinary } from "@/lib/utils";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronRight, Loader2, Upload, XIcon } from "lucide-react";
import {
  bookCategories,
  possibleSizes,
  productCategories,
  productTypeArr,
  subCategories,
} from "@/constant/constant";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import axios from "axios";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

type Products = Omit<Product, "images" | "path" | "price"> & {
  price: string;
  images: File[];
  path?: string;
  storePassword: string;
  // userID: string | undefined;
};

type DigitalProducts = Omit<
  DigitalProduct,
  "coverIMG" | "price" | "coverImageKey" | "coverIMG"
> & {
  price: string;
  storePassword: string;
  pdfFile: File[];
  coverIMG: File[];
};

type storeID = {
  id: string;
};

function CreateProduct({ id }: storeID) {
  const router = useRouter();
  const pathname = usePathname();
  // const [userID, setUserID] = useState<string | undefined>(id);
  const [productType, setProductType] = useState<
    "Physical Product" | "Digital Product" | string
  >("Physical Product");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  // console.log(`slug ID`, id);

  // useEffect(() => {
  //   if (!userID) {
  //     const cookieName = getCookie("name")?.toString();
  //     setUserID(cookieName || "");
  //   }
  // }, [userID]);

  const [physicalProduct, setPhysicalProduct] = useState<Products>({
    name: "",
    price: "",
    sizes: [],
    productQuantity: "",
    images: [],
    description: "",
    specifications: "",
    category: "",
    subCategory: "",
    storeID: id,
    storePassword: "",
    productType: "Physical Product",
  });

  const [digitalProduct, setDigitalProduct] = useState<DigitalProducts>({
    storeID: id,
    title: "",
    author: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    fileType: "",
    fileSize: 0,
    s3Key: "",
    isbn: "",
    publisher: "",
    language: "",
    pdfFile: [],
    coverIMG: [],
    storePassword: "",
    productType: "Digital Product",
  });

  // Define valid size options based on category or subcategory
  const sizeOptions =
    physicalProduct.subCategory === "Footwear"
      ? [
          "39",
          "39.5",
          "40",
          "40.5",
          "41",
          "41.5",
          "42",
          "42.5",
          "43",
          "43.5",
          "44",
          "44.5",
          "45",
          "45.5",
          "46",
          "46.5",
          "47",
          "47.5",
          "48",
        ]
      : ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  // Allowed file types
  const allowedFileTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  const maxFileSizePerImage = 5242880; // 5MB per image

  const [imagePreviews, setImagePreviews] = useState<string[]>([]); // This will store the image URLs
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Store Cloudinary URLs

  useEffect(() => {
    return () => {
      // Cleanup object URLs when the component unmounts
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    e.preventDefault();

    const { name, value, type, files } = e.target as HTMLInputElement;

    setPhysicalProduct((prev) => {
      if (type === "file" && files) {
        const fileArray = Array.from(files);
        const urls = fileArray.map((file) => URL.createObjectURL(file));
        setImagePreviews(urls); // Create and store image URLs
        return {
          ...prev,
          [name]: Array.from(files), // or files if you want to handle multiple files
        };
      } else {
        return {
          ...prev,
          [name]: value,
        };
      }
    });

    // Reset sub-category if category changes
    if (name === "productCategory") {
      setPhysicalProduct((prev) => ({
        ...prev,
        productSubCategory: "",
      }));
    }

    // console.log(type === "file" && files ? Array.from(files) : "no file");
    // console.log("physicalProduct", physicalProduct);
  };

  const handleDigitalProductChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    e.preventDefault();

    const { name, value, type, files } = e.target as HTMLInputElement;

    if (type === "file" && files) {
      const fileArray = Array.from(files);
      const urls = fileArray.map((file) => URL.createObjectURL(file));

      // Check which file input is being updated (pdfFile or coverIMG)
      if (name === "pdfFile") {
        // Get fileType and fileSize
        const pdfFile = fileArray[0]; // assuming single file upload for PDF
        const fileType = pdfFile.type;
        const fileSize = (pdfFile.size / 1024 / 1024).toFixed(2); // File size in MB
        // Handle PDF file
        setDigitalProduct((prev) => {
          // If it's a file input
          return {
            ...prev,
            [name]: fileArray, // Store the selected PDF file(s)
            fileType: fileType,
            fileSize: Number(fileSize),
          };
        });
      } else if (name === "coverIMG") {
        // Handle Cover Image
        setImagePreviews(urls); // Preview images for coverIMG only
        setDigitalProduct((prev) => {
          // If it's a file input
          return {
            ...prev,
            [name]: fileArray, // Store the selected image(s)
          };
        });
      }
    } else {
      // Handle other non-file inputs (e.g., text, select, textarea)
      setDigitalProduct((prev) => {
        // If it's a file input
        return {
          ...prev,
          [name]: value,
        };
      });
    }

    // Reset sub-category if category changes (this logic can stay the same)
    if (name === "category") {
      setPhysicalProduct((prev) => ({
        ...prev,
        subcategory: "",
      }));
    }

    // console.log("digitalProduct", digitalProduct);
  };

  //   // use this code if product sizes is not optional
  //   // const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   //   const { value, checked } = e.target;
  //   //   setProduct((prev) => {
  //   //     const sizes = checked
  //   //       ? [...prev.productSizes, value] // Add size if checked
  //   //       : prev.productSizes.filter((size) => size !== value); // Remove size if unchecked

  //   //     return {
  //   //       ...prev,
  //   //       productSizes: sizes,
  //   //     };
  //   //   });
  //   // };

  //   // use this code if product sizes is optional
  //   const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
  //     const { value, checked } = e.target;
  //     setPhysicalProduct((prev) => {
  //       const sizes = prev.sizes ?? []; // Default to an empty array if undefined
  //       const updatedSizes = checked
  //         ? [...sizes, value] // Add size if checked
  //         : sizes.filter((size) => size !== value); // Remove size if unchecked

  //       return {
  //         ...prev,
  //         productSizes: updatedSizes,
  //       };
  //     });
  //   };

  // Handle size and size-specific price input
  const handleSizePriceChange = (
    index: number,
    field: "size" | "price" | "quantity",
    value: string
  ) => {
    setPhysicalProduct((prev) => {
      const updatedSizes = [...prev.sizes!];
      updatedSizes[index] = {
        ...updatedSizes[index],
        [field]:
          field === "price" || field === "quantity" ? Number(value) : value,
      };

      return {
        ...prev,
        sizes: updatedSizes,
      };
    });
  };

  // Add a new size input row
  const addSize = () => {
    setPhysicalProduct((prev) => ({
      ...prev,
      price: "",
      productQuantity: "",
      sizes: [...(prev.sizes || []), { size: "", price: 0, quantity: 0 }],
    }));
  };

  // Remove a size input row
  const removeSize = (index: number) => {
    setPhysicalProduct((prev) => ({
      ...prev,
      sizes: prev.sizes!.filter((_, i) => i !== index),
    }));
  };

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const quillFormats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
  ];

  const handleProductDescriptionChange = (newContent: string) => {
    setPhysicalProduct((prev) => {
      return {
        ...prev,
        description: newContent,
      };
    });
    // console.log(physicalProduct.productDescription);
  };

  const handleProductSpecificationChange = (newContent: string) => {
    setPhysicalProduct((prev) => {
      return {
        ...prev,
        specifications: newContent,
      };
    });
    // console.log(physicalProduct.productSpecification);
  };

  const handleDescriptionChange = (newContent: string) => {
    setDigitalProduct((prev) => {
      return {
        ...prev,
        description: newContent,
      };
    });
    // console.log(physicalProduct.productSpecification);
  };

  const handlePhysicalProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const maxTotalFileSize = 15728640; // 15MB total (3 images * 5MB each)

    // Validate product images
    if (physicalProduct.images.length === 0) {
      toast({
        title: `Submission Error`,
        description: `You must select at least one product image.`,
      });
      setIsLoading(false);
      return;
    } else if (physicalProduct.images.length > 3) {
      toast({
        title: `Submission Error`,
        description: `You can only upload up to three product images.`,
      });
      setIsLoading(false);
      return;
    }

    let totalSize = 0;
    for (let image of physicalProduct.images) {
      if (
        !allowedFileTypes.includes(image.type) ||
        image.size > maxFileSizePerImage
      ) {
        toast({
          title: `Submission Error`,
          description: `One or more images have an invalid file type or exceed the allowed size. Accepted formats are JPEG, PNG, and WebP with a maximum size of 5MB per image.`,
        });
        setIsLoading(false);
        return;
      }
      totalSize += image.size;
    }

    if (totalSize > maxTotalFileSize) {
      toast({
        title: `Submission Error`,
        description: `The total file size of all images should not exceed 15MB.`,
      });
      setIsLoading(false);
      return;
    }

    // Validate product name
    if (physicalProduct.name === "" || physicalProduct.name.length < 5) {
      toast({
        title: `Submission Error`,
        description: `Please provide a valid product name with at least 5 characters.`,
      });
      setIsLoading(false);
      return;
    }

    // Validate product price
    if (
      (physicalProduct.category !== "Fashion" &&
        physicalProduct.category !== "Clothing" &&
        (physicalProduct.price === "" ||
          isNaN(Number(physicalProduct.price)) ||
          Number(physicalProduct.price) <= 0)) ||
      ((physicalProduct.category === "Fashion" ||
        physicalProduct.category === "Clothing") &&
        (!physicalProduct.sizes || physicalProduct.sizes.length === 0))
    ) {
      toast({
        title: `Submission Error`,
        description: `Please provide a valid product price or specify product sizes with valid prices.`,
      });
      setIsLoading(false);
      return;
    }

    // Validate size-based prices, quantities, and selected size for Fashion and Clothing
    if (
      (physicalProduct.category === "Fashion" ||
        physicalProduct.category === "Clothing") &&
      physicalProduct.sizes
    ) {
      for (const sizeObj of physicalProduct.sizes) {
        // Validate the size selection
        if (!sizeObj.size || !sizeOptions.includes(sizeObj.size)) {
          toast({
            title: `Submission Error`,
            description: `Please select a valid size for each product variant.`,
          });
          setIsLoading(false);
          return;
        }

        // Validate the price for each size
        if (sizeObj.price <= 0) {
          toast({
            title: `Submission Error`,
            description: `Each product size must have a valid price greater than 0.`,
          });
          setIsLoading(false);
          return;
        }

        // Validate the quantity for each size
        if (sizeObj.quantity <= 0) {
          toast({
            title: `Submission Error`,
            description: `Each product size must have a valid quantity greater than 0.`,
          });
          setIsLoading(false);
          return;
        }
      }
    }

    // Validate product quantity (fallback quantity)
    if (
      (physicalProduct.category !== "Fashion" &&
        physicalProduct.category !== "Clothing" &&
        (physicalProduct.productQuantity === "" ||
          isNaN(Number(physicalProduct.productQuantity)) ||
          Number(physicalProduct.productQuantity) <= 0)) ||
      ((physicalProduct.category === "Fashion" ||
        physicalProduct.category === "Clothing") &&
        (!physicalProduct.sizes || physicalProduct.sizes.length === 0))
    ) {
      toast({
        title: `Submission Error`,
        description: `Please provide a valid product quantity or specify product sizes with valid quantities.`,
      });
      setIsLoading(false);
      return;
    }

    // Validate product description
    if (
      physicalProduct.description === "" ||
      physicalProduct.description.length < 10
    ) {
      toast({
        title: `Submission Error`,
        description: `Please provide a detailed product description with at least 10 characters.`,
      });
      setIsLoading(false);
      return;
    }

    // Validate product specification
    if (
      physicalProduct.specifications === "" ||
      physicalProduct.specifications.length < 10
    ) {
      toast({
        title: `Submission Error`,
        description: `Please provide a product specification with at least 10 characters.`,
      });
      setIsLoading(false);
      return;
    }

    // Validate product category
    if (physicalProduct.category === "") {
      toast({
        title: `Submission Error`,
        description: `Please select a product category.`,
      });
      setIsLoading(false);
      return;
    }

    // Validate store password
    if (physicalProduct.storePassword === "") {
      toast({
        title: `Submission Error`,
        description: `Please enter the store password.`,
      });
      setIsLoading(false);
      return;
    }

    // If all validations pass, proceed with form submission
    try {
      // Upload images to Cloudinary
      const urls = await uploadImagesToCloudinary(physicalProduct.images);
      setImageUrls(urls);

      // Submit product
      await createProduct({
        productType: physicalProduct.productType,
        name: physicalProduct.name,
        price: physicalProduct.price,
        sizes: physicalProduct.sizes,
        productQuantity: physicalProduct.productQuantity,
        images: urls,
        description: physicalProduct.description,
        specifications: physicalProduct.specifications,
        category: physicalProduct.category,
        subCategory: physicalProduct.subCategory,
        path: pathname,
        storeID: physicalProduct.storeID,
        storePassword: physicalProduct.storePassword,
      });

      router.back();
    } catch (error) {
      console.error("Error submitting product:", error);
      toast({
        title: `Submission Error`,
        description: `An unexpected error occurred while submitting the product. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDigitalProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // console.log(product);

    const maxTotalFileSize = 15728640; // 15MB total (3 images * 5MB each)

    // Validate E-book Title
    if (digitalProduct.title === "" || digitalProduct.title.length < 5) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `E-book Title is required (at least 5 characters).`,
      });
      setIsLoading(false);
      return;
    }

    // Validate E-book Author
    if (digitalProduct.author === "" || digitalProduct.author.length < 5) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Author's name is required (at least 5 characters).`,
      });
      setIsLoading(false);
      return;
    }

    // Validate E-book description
    if (
      digitalProduct.description === "" ||
      digitalProduct.description.length < 60
    ) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please provide a brief summary of this E-book (at least 60 characters).`,
      });
      setIsLoading(false);
      return;
    }

    // Validate product category
    if (digitalProduct.category === "") {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please select a category.`,
      });
      setIsLoading(false);
      return;
    }

    // Validate product sub-category
    if (digitalProduct.subcategory === "") {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please select sub-category.`,
      });
      setIsLoading(false);
      return;
    }

    // Validate product price
    if (
      digitalProduct.price === "" ||
      isNaN(Number(digitalProduct.price)) ||
      Number(digitalProduct.price) <= 0
    ) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please enter a valid price.`,
      });
      setIsLoading(false);
      return;
    }

    // Validate E-book language
    if (digitalProduct.language === "" || digitalProduct.language.length < 5) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Language is required.`,
      });
      setIsLoading(false);
      return;
    }

    // Validate product images
    if (digitalProduct.coverIMG.length === 0) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `No cover image selected.`,
      });
      setIsLoading(false);
      return;
    } else if (digitalProduct.coverIMG.length > 3) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Images should be at most 3.`,
      });
      setIsLoading(false);
      return;
    }

    let totalSize = 0;
    for (let image of digitalProduct.coverIMG) {
      if (
        !allowedFileTypes.includes(image.type) ||
        image.size > maxFileSizePerImage
      ) {
        toast({
          variant: "destructive",
          title: `Error`,
          description: `Invalid file type or size. Accepted types are JPEG, PNG, WebP and size up to 5MB.`,
        });
        setIsLoading(false);
        return;
      }
      totalSize += image.size;
    }

    if (totalSize > maxTotalFileSize) {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Total size of all images should not exceed 15MB.`,
      });
      setIsLoading(false);
      return;
    }

    // Validate store password
    if (digitalProduct.storePassword === "") {
      toast({
        variant: "destructive",
        title: `Error`,
        description: `Please input store password.`,
      });
      setIsLoading(false);
      return;
    }

    // Function to handle file upload to S3
    async function uploadToS3(e: File[]) {
      // console.log("valid file selected.", e[0])
      // Validate file and file type
      if (!e[0] || !(e[0] instanceof File)) {
        console.error("No valid file selected.");
        return null;
      }

      const fileType = encodeURIComponent(e[0].type); // Encodes the file type

      try {
        // Request a signed URL from the backend
        const data = await axios.get(`/api/store/ebooks/media`, {
          params: { fileType },
        });

        const res = data.data.data;
        const { uploadUrl, key } = res;
        console.log("Generated upload URL: ", uploadUrl);

        if (!uploadUrl || typeof uploadUrl !== "string") {
          console.error("Invalid upload URL:", uploadUrl);
          return null;
        }

        // Upload the file to S3 using the signed URL
        await axios.put(uploadUrl, e[0], {
          headers: {
            "Content-Type": e[0].type, // Ensure the file type is set correctly
          },
        });

        return key;
      } catch (error) {
        console.error("Error uploading file:", error);
        return null;
      }
    }

    // If all validations pass, proceed with form submission
    try {
      //  Upload PDF to s3 bucket and get the unique key
      const key = await uploadToS3(digitalProduct.pdfFile);
      if (key) {
        console.log(`File uploaded successfully with key: ${key}`);
      } else {
        console.log("File upload failed.");
        return;
      }

      // Upload images to Cloudinary
      const urls = await uploadImagesToCloudinary(digitalProduct.coverIMG);
      setImageUrls(urls);

      // Add logic to handle form submission, e.g., send product data along with URLs to the server
      // console.log("Product submitted with URLs:", {
      //   ...product,
      //   productImage: urls,
      // });

      // TODO:
      await createDigitalProduct({
        title: digitalProduct.title,
        author: digitalProduct.author,
        description: digitalProduct.description,
        category: digitalProduct.category,
        subcategory: digitalProduct.subcategory,
        price: digitalProduct.price,
        fileType: digitalProduct.fileType,
        fileSize: digitalProduct.fileSize,
        s3Key: key,
        language: digitalProduct.language,
        coverIMG: urls,
        isbn: digitalProduct.isbn,
        publisher: digitalProduct.publisher,
        storeID: digitalProduct.storeID,
        productType: digitalProduct.productType,
        storePassword: digitalProduct.storePassword,
      });

      router.back();
    } catch (error) {
      console.error("Error submitting product:", error);
      toast({
        variant: "destructive",
        title: `Error`,
        description: `An error occurred while submitting the product. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className=" max-w-5xl mx-auto">
        <div className=" text-ellipsis">
          {/* <h1 className=" shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 text-ellipsis">
            Add Product
          </h1> */}

          <div>
            <h1 className="font-semibold text-xl">Product Type</h1>

            <div className="grid gap-6 ">
              <div className="grid gap-3">
                <select
                  aria-label="Select Product Type"
                  name="productType"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400"
                >
                  {productTypeArr.map((type) => (
                    <option
                      key={type}
                      value={type}
                      onClick={() => setProductType(type)}
                    >
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {productType === "Physical Product" && (
                <p>
                  A Physical Product refers to any tangible, real-world item
                  that can be physically touched, held, and delivered to
                  customers. These are goods that need to be shipped or
                  delivered after purchase. Physical products often have
                  attributes like size, weight, and quantity. They are suitable
                  for sellers offering items that require delivery or in-person
                  pickup. E.g includes Clothing (T-shirts, shoes, jackets),
                  Electronics (Phones, laptops, headphones) etc.
                </p>
              )}

              {productType === "Digital Product" && (
                <p>
                  A Digital Product refers to any item that is delivered
                  electronically, meaning there is no physical item to ship.
                  These are typically downloadable files or access-based
                  services that can be immediately accessed online after
                  purchase. Digital products are perfect for creators and
                  sellers offering non-tangible goods such as media or
                  educational materials. E.g includes eBooks(PDF) etc.
                </p>
              )}
            </div>
          </div>

          {productType === "Physical Product" && (
            <>
              <form
                className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 pt-3"
                onSubmit={handlePhysicalProductSubmit}
              >
                <div className="flex items-center gap-4 text-ellipsis">
                  <h1 className=" shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 text-ellipsis">
                    Add Product
                  </h1>
                  <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button
                      type="submit"
                      onSubmit={handlePhysicalProductSubmit}
                      className=" hover:bg-udua-orange-primary bg-udua-orange-primary/80"
                    >
                      <span>
                        {isLoading && (
                          <p className="flex flex-row items-center justify-between w-full">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Loading...</span>
                          </p>
                        )}
                        {!isLoading && (
                          <p className="flex flex-row items-center justify-between w-full">
                            <span>Upload</span>
                            <ChevronRight className="mr-2 h-4 w-4" />
                          </p>
                        )}
                      </span>
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                        <CardDescription>
                          Vividly describe your product. We will have to verify
                          this product once it's been uploaded.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <Label className="text-base-semibold text-light-2">
                              Product Name
                            </Label>

                            <Input
                              name="name"
                              value={physicalProduct.name}
                              onChange={(e) => handleChange(e)}
                              className="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-white placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                              type="text"
                              placeholder="Product Name"
                              aria-label="Product Name"
                            />
                          </div>

                          <div className="grid gap-4 lg:grid-cols-2 items-start">
                            <div className="grid gap-3">
                              <Label className="text-base-semibold text-light-2">
                                Product Description
                              </Label>

                              <QuillEditor
                                value={physicalProduct.description}
                                onChange={handleProductDescriptionChange}
                                modules={quillModules}
                                formats={quillFormats}
                                className=" h-fit bg-inherit overflow-x-auto"
                              />
                            </div>

                            <div className="grid gap-3 w-full">
                              <Label className="text-base-semibold text-light-2">
                                Product Specification
                              </Label>

                              <QuillEditor
                                value={physicalProduct.specifications}
                                onChange={handleProductSpecificationChange}
                                modules={quillModules}
                                formats={quillFormats}
                                className=" h-fit bg-inherit overflow-x-auto"
                              />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Stock</CardTitle>
                      </CardHeader>

                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="grid gap-3">
                            <Label className="text-base-semibold text-light-2">
                              Product Price {/*  (Fallback) */}
                            </Label>
                            <Input
                              name="price"
                              value={physicalProduct.price}
                              onChange={handleChange}
                              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 dark:text-white bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                              type="text"
                              placeholder="Product Price"
                              aria-label="Product Price"
                              disabled={physicalProduct.sizes!.length > 0} // Disable fallback price input if sizes are defined
                            />
                          </div>
                          <div className="grid gap-3">
                            <Label className="text-base-semibold text-light-2">
                              Product Quantity
                            </Label>
                            <Input
                              name="productQuantity"
                              value={physicalProduct.productQuantity}
                              onChange={handleChange}
                              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 dark:text-white bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                              type="text"
                              placeholder="Product Quantity"
                              aria-label="Product Quantity"
                              disabled={physicalProduct.sizes!.length > 0} // Disable fallback Product Quantity input if sizes are defined
                            />
                          </div>
                          {(physicalProduct.category === "Clothing" ||
                            physicalProduct.category === "Fashion") && (
                            <p className=" text-xs text-udua-orange-primary">
                              Products under 'Fashion', 'Clothing', and
                              'Footwear' have size-based Prices & Quantity.
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Product Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-6 ">
                            <div className="grid gap-3">
                              <select
                                aria-label="Select category"
                                name="category"
                                value={physicalProduct.category}
                                onChange={handleChange}
                                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                              >
                                <option value="" disabled>
                                  Select a Category
                                </option>
                                {productCategories.map((category) => (
                                  <option key={category} value={category}>
                                    {category}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {physicalProduct.category && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Product Sub-Category</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-6 ">
                              <div className="grid gap-3">
                                <select
                                  aria-label="Select sub-category"
                                  name="subCategory"
                                  value={physicalProduct.subCategory}
                                  onChange={handleChange}
                                  className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                                >
                                  <option value="" disabled>
                                    Select a Sub-Category
                                  </option>
                                  {subCategories[physicalProduct.category]?.map(
                                    (subCategory) => (
                                      <option
                                        key={subCategory}
                                        value={subCategory}
                                      >
                                        {subCategory}
                                      </option>
                                    )
                                  )}
                                </select>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>

                  <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    {(physicalProduct.category === "Clothing" ||
                      physicalProduct.category === "Fashion") && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Product Sizes</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div>
                            {physicalProduct.sizes?.map((sizeObj, index) => {
                              // Get already selected sizes to disable them
                              const selectedSizes = physicalProduct.sizes!.map(
                                (size) => size.size
                              );

                              return (
                                <div
                                  key={index}
                                  className="flex gap-2 items-center mt-2"
                                >
                                  <div className="w-full">
                                    <p className=" pl-2 pb-0.5">Size</p>
                                    <select
                                      value={sizeObj.size}
                                      onChange={(e) =>
                                        handleSizePriceChange(
                                          index,
                                          "size",
                                          e.target.value
                                        )
                                      }
                                      className="w-full border p-2 rounded"
                                    >
                                      <option value="" disabled>
                                        Select Size
                                      </option>
                                      {sizeOptions.map((sizeOption) => (
                                        <option
                                          key={sizeOption}
                                          value={sizeOption}
                                          disabled={selectedSizes.includes(
                                            sizeOption
                                          )}
                                        >
                                          {sizeOption}
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  <div className="w-full">
                                    <p className=" pl-2 pb-0.5">Price</p>
                                    <Input
                                      value={sizeObj.price}
                                      type="number"
                                      min={0}
                                      onChange={(e) =>
                                        handleSizePriceChange(
                                          index,
                                          "price",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Price"
                                      className="w-full"
                                    />
                                  </div>

                                  <div className="w-full">
                                    <p className=" pl-2 pb-0.5">Quantity</p>
                                    <Input
                                      value={sizeObj.quantity}
                                      type="number"
                                      min={0}
                                      onChange={(e) =>
                                        handleSizePriceChange(
                                          index,
                                          "quantity",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Quantity"
                                      className="w-full"
                                    />
                                  </div>

                                  <Button
                                    type="button"
                                    onClick={() => removeSize(index)}
                                    className="bg-transparent hover:bg-transparent hover:text-udua-orange-primary text-udua-orange-primary/80"
                                  >
                                    <XIcon width={15} height={15} />
                                  </Button>
                                </div>
                              );
                            })}

                            <Button
                              type="button"
                              onClick={addSize}
                              className="mt-3 hover:bg-udua-orange-primary bg-udua-orange-primary/80"
                            >
                              Add Size
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                        <CardDescription>
                          <p>
                            Please note: You can change your uploaded image once
                            every month. Make sure to upload the correct image.
                          </p>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2 pb-6 sm:grid-cols-2">
                          <button
                            type="button"
                            className="flex aspect-square relative w-full items-center justify-center rounded-md"
                          >
                            <Upload className="h-10 z-10 w-10 text-muted-foreground" />
                            <span className="sr-only">Upload</span>
                            <Input
                              name="images"
                              onChange={(e) => handleChange(e)}
                              className="block absolute h-full w-full border-dashed px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                              type="file"
                              multiple
                              accept="image/*"
                              placeholder="Product Image"
                              aria-label="Product Image"
                            />
                          </button>

                          <div className=" grid grid-cols-2 gap-2 pt-2">
                            {/* Display selected images */}
                            {imagePreviews && (
                              <>
                                {imagePreviews.map((src, index) => (
                                  <button key={index} className="">
                                    <Image
                                      className="aspect-square rounded-md object-cover"
                                      height="200"
                                      src={src}
                                      alt={`Selected Preview ${index + 1}`}
                                      width="200"
                                      loading="lazy"
                                    />
                                  </button>
                                ))}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-3 border-t-2 pt-3">
                          <Label className="text-base-semibold text-light-2">
                            Store Password
                          </Label>

                          <Input
                            name="storePassword"
                            value={physicalProduct.storePassword}
                            onChange={(e) => handleChange(e)}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-white placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                            type="password"
                            placeholder="Your Store Password"
                            aria-label="Your Store Password"
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <div className="flex items-center justify-center gap-2 md:hidden w-full">
                      <Button
                        type="submit"
                        className=" w-full hover:bg-udua-orange-primary bg-udua-orange-primary/80"
                        onSubmit={handlePhysicalProductSubmit}
                      >
                        <span>
                          {isLoading && (
                            <p className="flex flex-row items-center justify-between w-full">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <span>Loading...</span>
                            </p>
                          )}
                          {!isLoading && (
                            <p className="flex flex-row items-center justify-between w-full">
                              <span>Upload</span>
                              <ChevronRight className="mr-2 h-4 w-4" />
                            </p>
                          )}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}

          {productType === "Digital Product" && (
            <>
              <form
                className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4 pt-3"
                onSubmit={handleDigitalProductSubmit}
              >
                <div className="flex items-center gap-4 text-ellipsis">
                  <h1 className=" shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 text-ellipsis">
                    Add Product
                  </h1>
                  <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button
                      type="submit"
                      onSubmit={handleDigitalProductSubmit}
                      className=" hover:bg-udua-orange-primary bg-udua-orange-primary/80"
                    >
                      <span>
                        {isLoading && (
                          <p className="flex flex-row items-center justify-between w-full">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Loading...</span>
                          </p>
                        )}
                        {!isLoading && (
                          <p className="flex flex-row items-center justify-between w-full">
                            <span>Upload</span>
                            <ChevronRight className="mr-2 h-4 w-4" />
                          </p>
                        )}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                  <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Details</CardTitle>
                        <CardDescription>
                          Vividly describe your product. We will have to verify
                          this product once it's been uploaded.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <Label className="text-base-semibold text-light-2">
                              Title
                            </Label>

                            <Input
                              name="title"
                              value={digitalProduct.title}
                              onChange={(e) => handleDigitalProductChange(e)}
                              className="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-white placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                              type="text"
                              placeholder="Book Title"
                              aria-label="Title of the Book"
                            />
                          </div>

                          <div className="grid gap-3 w-full">
                            <Label className="text-base-semibold text-light-2">
                              Author
                            </Label>

                            <Input
                              name="author"
                              value={digitalProduct.author}
                              onChange={(e) => handleDigitalProductChange(e)}
                              className="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-white placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                              type="text"
                              placeholder="Book Author"
                              aria-label="Author of the Book"
                            />
                          </div>

                          <div className="grid gap-3">
                            <Label className="text-base-semibold text-light-2">
                              Book Description
                            </Label>

                            <QuillEditor
                              value={digitalProduct.description}
                              onChange={handleDescriptionChange}
                              modules={quillModules}
                              formats={quillFormats}
                              className=" h-fit bg-inherit overflow-x-auto"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        {/* <CardTitle>Stock</CardTitle> */}
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <Label className="text-base-semibold text-light-2">
                              Price
                            </Label>

                            <Input
                              name="price"
                              value={digitalProduct.price}
                              onChange={(e) => handleDigitalProductChange(e)}
                              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 dark:text-white bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                              type="text"
                              placeholder="Price"
                              aria-label="Price"
                            />
                          </div>

                          <div className="grid gap-3">
                            <Label className="text-base-semibold text-light-2">
                              Publisher
                            </Label>

                            <Input
                              name="publisher"
                              value={digitalProduct.publisher}
                              onChange={(e) => handleDigitalProductChange(e)}
                              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 dark:text-white bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                              type="text"
                              placeholder="Publisher"
                              aria-label="Publisher"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {/* Category Selection */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-6">
                            <div className="grid gap-3">
                              <select
                                aria-label="Select category"
                                name="category"
                                value={digitalProduct.category}
                                onChange={handleDigitalProductChange}
                                className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                              >
                                <option value="" disabled>
                                  Select a Category
                                </option>
                                {bookCategories.map((categoryArr) => (
                                  <option
                                    key={categoryArr.category}
                                    value={categoryArr.category}
                                  >
                                    {categoryArr.category}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Subcategory Selection */}
                      {digitalProduct.category && (
                        <Card>
                          <CardHeader>
                            <CardTitle>Sub-Category</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-6">
                              <div className="grid gap-3">
                                <select
                                  aria-label="Select sub-category"
                                  name="subcategory"
                                  value={digitalProduct.subcategory}
                                  onChange={handleDigitalProductChange}
                                  className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                                >
                                  <option value="" disabled>
                                    Select a Sub-Category
                                  </option>
                                  {/* Render subcategories dynamically */}
                                  {bookCategories
                                    .find(
                                      (categoryArr) =>
                                        categoryArr.category ===
                                        digitalProduct.category
                                    )
                                    ?.subCategories.map((subCategory) => (
                                      <option
                                        key={subCategory}
                                        value={subCategory}
                                      >
                                        {subCategory}
                                      </option>
                                    ))}
                                </select>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>

                  <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card>
                      <CardHeader>
                        {/* <CardTitle>Product Sizes</CardTitle> */}
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-3">
                          <Label className="text-base-semibold text-light-2">
                            Language
                          </Label>

                          <Input
                            name="language"
                            value={digitalProduct.language}
                            onChange={(e) => handleDigitalProductChange(e)}
                            className="block w-full px-4 py-2 text-gray-700 placeholder-gray-500 dark:text-white bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                            type="text"
                            placeholder="Written in what Language"
                            aria-label="what Language"
                          />
                        </div>
                        <div className="grid gap-3 pt-4">
                          <Label className="text-base-semibold text-light-2">
                            ISBN
                          </Label>

                          <Input
                            name="isbn"
                            value={digitalProduct.isbn}
                            onChange={(e) => handleDigitalProductChange(e)}
                            className="block w-full px-4 py-2 text-gray-700 placeholder-gray-500 dark:text-white bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                            type="text"
                            placeholder="ISBN"
                            aria-label="ISBN"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>Select File</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2 pb-6">
                          <button
                            type="button"
                            className="flex py-8 relative w-full items-center justify-center rounded-md"
                          >
                            <Upload className="h-10 z-10 w-10 text-muted-foreground" />
                            <span className="sr-only">Upload</span>
                            <Input
                              name="pdfFile"
                              onChange={(e) => handleDigitalProductChange(e)}
                              className="block absolute h-32 w-full border-dashed px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                              type="file"
                              accept="application/pdf"
                              placeholder="Select PDF File"
                              aria-label="Select PDF File"
                            />
                          </button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>Cover Image</CardTitle>
                        <CardDescription>
                          <p>
                            Please note: You can change your uploaded image once
                            every month. Make sure to upload the correct image.
                          </p>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-2 pb-6">
                          <button
                            type="button"
                            className="flex aspect-square relative w-full items-center justify-center rounded-md"
                          >
                            <Upload className="h-10 z-10 w-10 text-muted-foreground" />
                            <span className="sr-only">Upload</span>
                            <Input
                              name="coverIMG"
                              onChange={(e) => handleDigitalProductChange(e)}
                              className="block absolute h-full w-full border-dashed px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                              type="file"
                              accept="image/*"
                              placeholder="cover Image"
                              aria-label="Book cover Image"
                            />
                          </button>

                          <div className="grid grid-cols-2 gap-2 pt-2">
                            {/* Display selected images */}
                            {imagePreviews && (
                              <>
                                {imagePreviews.map((src, index) => (
                                  <button key={index}>
                                    <Image
                                      className="aspect-square w-full rounded-md object-cover"
                                      height="200"
                                      src={src}
                                      alt={`Selected Preview ${index + 1}`}
                                      width="200"
                                      loading="lazy"
                                    />
                                  </button>
                                ))}
                              </>
                            )}
                          </div>
                        </div>

                        <div className="grid gap-3 border-t-2 pt-3">
                          <Label className="text-base-semibold text-light-2">
                            Store Password
                          </Label>

                          <Input
                            name="storePassword"
                            value={digitalProduct.storePassword}
                            onChange={(e) => handleDigitalProductChange(e)}
                            className="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-white placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                            type="password"
                            placeholder="Your Store Password"
                            aria-label="Your Store Password"
                          />
                        </div>
                      </CardContent>
                    </Card>
                    <div className="flex items-center justify-center gap-2 md:hidden w-full">
                      <Button
                        type="submit"
                        className=" w-full hover:bg-udua-orange-primary bg-udua-orange-primary/80"
                        onSubmit={handleDigitalProductSubmit}
                      >
                        <span>
                          {isLoading && (
                            <p className="flex flex-row items-center justify-between w-full">
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <span>Loading...</span>
                            </p>
                          )}
                          {!isLoading && (
                            <p className="flex flex-row items-center justify-between w-full">
                              <span>Upload</span>
                              <ChevronRight className="mr-2 h-4 w-4" />
                            </p>
                          )}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>

        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      </div>
    </section>
  );
}

export default CreateProduct;
