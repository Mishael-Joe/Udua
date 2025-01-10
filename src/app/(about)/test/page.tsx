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

    const res = data.data.data;
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

async function deleteFiles(fileKeys: string[]) {
  try {
    const response = await axios.delete(`/api/s3-bucket/delete-action`, {
      params: { keys: fileKeys }, // Pass an array of keys
    });

    console.log("Files deleted:", response.data);
  } catch (error) {
    console.error("Error deleting files:", error);
  }
}

// Call the deleteFiles function with the keys of the files you want to delete
// deleteFiles([
//   "4426f2ff-fd32-4f72-8918-d577cc5e92b0.png",
//   "f9028e18-db4b-4143-9608-88f6cbd174db.pdf",
//   "c89569be-7d3f-49c6-8164-976d233707ad.pdf",
//   "f1002aed-31e1-454d-8d97-57390f0c9542.pdf",
//   "1748d4e2-9406-4185-a83e-63b09b6758ac.octet-stream",
//   "11071f7a-4e03-4df9-9491-de8d9958039f.jpeg",
// ]);

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
        <input
          type="file"
          accept="image/jpeg, image/png, application/pdf"
          name="file"
        />
        <button type="submit">Upload</button>
      </form>
    </>
  );
}

export default Page;
