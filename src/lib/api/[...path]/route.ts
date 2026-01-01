import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://api.truckmatch.app.devlaunchpad.com.au:9090/api";

async function handler(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join("/");
  const url = `${BACKEND_URL}/${path}`;

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Forward authorization header if present
    const authHeader = request.headers.get("Authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    // Forward cookies
    const cookieHeader = request.headers.get("Cookie");
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    const body =
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.text()
        : undefined;

    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
      credentials: "include",
    });

    const data = await response.text();

    // Forward set-cookie headers from backend
    const responseHeaders = new Headers({
      "Content-Type": "application/json",
    });

    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        responseHeaders.append(key, value);
      }
    });

    return new NextResponse(data, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { success: false, message: "Proxy request failed", status: 500 },
      { status: 500 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const OPTIONS = handler;
