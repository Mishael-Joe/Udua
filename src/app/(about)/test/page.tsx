// "use client"

// import axios from "axios";
// import { ChangeEvent } from "react";

// async function uploadToS3(e: ChangeEvent<HTMLFormElement>) {
//   const formData = new FormData(e.target);

//   const file = formData.get("file");
//   console.log('file', file)

//   if (!file) {
//     return null;
//   }

//   // @ts-ignore
//   const fileType = encodeURIComponent(file.type);

//   const req = {
//     req: fileType
//   }

//   const { data } = await axios.get(`/api/store/ebooks/media`, {
//     params: {
//         fileType,
//     },
//   });
//   console.log('data', data)

//   const { uploadUrl, key } = data;

//   await axios.put(uploadUrl, file);

//   return key;
// }

// function Page() {
//   async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
//     e.preventDefault();

//     const key = await uploadToS3(e);
//   }

//   return (
//     <>
//       <p>Please select file to upload</p>
//       <form onSubmit={handleSubmit}>
//         <input type="file" accept="image/jpeg image/png" name="file" />
//         <button type="submit">Upload</button>
//       </form>
//     </>
//   );
// }

// export default Page;

"use client";

import axios from "axios";
import { ChangeEvent } from "react";

// Function to handle file upload to S3
async function uploadToS3(e: ChangeEvent<HTMLFormElement>) {
  const formData = new FormData(e.target);
  const file = formData.get("file");

  // Validate file and file type
  if (!file || !(file instanceof File)) {
    console.error("No valid file selected.");
    return null;
  }

  const fileType = encodeURIComponent(file.type); // Encodes the file type

  try {
    // Request a signed URL from the backend
    const data = await axios.get(`/api/store/ebooks/media`, {
      params: { fileType },
    });

    const res = data.data.data
    const { uploadUrl, key } = res;
    console.log("Generated upload URL: ", uploadUrl);



    if (!uploadUrl || typeof uploadUrl !== "string") {
      console.error("Invalid upload URL:", uploadUrl);
      return null;
    }
    

    // Upload the file to S3 using the signed URL
    await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type, // Ensure the file type is set correctly
      },
    });

    return key;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

function Page() {
  // Handle form submission
  async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();

    const key = await uploadToS3(e);
    if (key) {
      console.log(`File uploaded successfully with key: ${key}`);
    } else {
      console.log("File upload failed.");
    }
  }

  return (
    <>
      <p>Please select a file to upload</p>
      <form onSubmit={handleSubmit}>
        {/* Accept only image/jpeg and image/png formats */}
        <input type="file" accept="image/jpeg, image/png" name="file" />
        <button type="submit">Upload</button>
      </form>
    </>
  );
}

export default Page;
