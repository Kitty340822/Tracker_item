"use server";

import env from "@/lib/env";
import { date } from "drizzle-orm/mysql-core";
import { json } from "stream/consumers";


export interface ISignup {
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  role_permission?: string;
  password?: string;
}

//
// 1. Get all signup data
//
export async function getSignupList (): Promise<ISignup[]> {
  try {
    const response = await fetch("http://localhost:3000/api/signup", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
      cache: "no-store", // ป้องกัน cache
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch signup list: ${response.status}`);
    }

    const json = await response.json();

    if (json.success) {
      return json.data as ISignup[];
    }
    return json.data as ISignup[];
  } catch (error: any) {
    console.error("Error get signup list:", error);
    return json;
  }
} ;

//
// 2. Get signup by ID
//
export async function getSignupById(id: string): Promise<{
  success: boolean;
  data?: ISignup;
  error?: string;
}> {
  try {
    const response = await fetch(`http://localhost:3000/api/signup/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch signup by id: ${response.status}`);
    }

    const { success, data, error } = await response.json();
    return { success, data, error };
  } catch (error: any) {
    console.error("Error get signup by ID:", error);
    return { success: false, error: error.message };
  }
}

//
// 3. Create signup
//
export async function createSignup(user: ISignup): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const response = await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
      body: JSON.stringify(user),
    });

    const { success, error } = await response.json();
    if (!success) throw new Error(error || "API create signup failed.");

    return { success: true, message: "Signup created successfully" };
  } catch (error: any) {
    console.error("Error create signup:", error);
    return { success: false, error: error.message };
  }
}

//
// 4. Delete signup
//
export async function deleteSignupById(id: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const response = await fetch(`http://localhost:3000/api/signup/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        apikey: env.API_KEY,
        apisecret: env.API_SECRET,
      },
    });

    if (!response.ok) throw new Error("Failed to delete signup");

    return { success: true, message: "Signup deleted successfully" };
  } catch (error: any) {
    console.error("Error delete signup:", error);
    return { success: false, error: error.message };
  }
}


// lib/services/signup.service.ts

export const getSignupListv2 = async (): Promise<ISignup[]> => {
  const res = await fetch("http://localhost:3000/api/signup", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: "1234567890",
      apisecret: "abcd",
    },
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const data = await res.json();
  return data;
};
