"use client";

import axios from "axios";

export const signOut = async () => {
  try {
    const response = await axios.get("/api/users/signOut");
    if (response.status === 200) {
      localStorage.removeItem("userData");
    }
    return response;
  } catch (error) {
    return error;
  }
};
