"use server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  token = null,
) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${baseUrl}${endpoint}`, options);

  const data = await response.json();

  console.log("=========================================================");
  console.log("request to: ", `${baseUrl}${endpoint}`);
  console.log("=========================================================");
  console.log("response: ", data);
  console.log("=========================================================");

  if (!response.ok) {
  const errorMessage = data?.status?.message ?? `Request failed with status ${response.status}`;
  throw new Error(errorMessage);
}

  return data;
}

export async function getAuthToken() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  return token || null;
}
