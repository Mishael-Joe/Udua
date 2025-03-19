"use client";

import AdminSignIn from "../component/admin-sign-in"; // Ensure the path is correct
import { createSuperAdmin } from "../../../../scripts/create-super-admin"; // Ensure the path is correct
import Head from "next/head";

function Page() {
  // If you need to run `createSuperAdmin()` on component mount, uncomment and adjust as needed
  // useEffect(() => {
  //   createSuperAdmin();
  // }, []);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        <title>Admin Sign In</title>
      </Head>
      <AdminSignIn />
    </>
  );
}

export default Page;
