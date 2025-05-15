import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { corsHeaders } from "@/lib/cors";

const handler = NextAuth(authOptions);

async function handleRequest(request: Request, handler: any) {
  try {
    const response = await handler(request);
    
    if (response instanceof Response) {
      const headers = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });
      
      // Ensure content type is application/json
      headers.set('Content-Type', 'application/json');
      
      // Clone the response to read its body
      const clonedResponse = response.clone();
      let body;
      
      try {
        body = await clonedResponse.text();
        // Try to parse as JSON to validate
        JSON.parse(body);
      } catch (e) {
        // If not valid JSON, return error response
        return new Response(
          JSON.stringify({ error: 'Invalid response format' }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }
      
      return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }
    
    return response;
  } catch (error) {
    console.error('NextAuth request error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}

export async function GET(request: Request) {
  return handleRequest(request, handler);
}

export async function POST(request: Request) {
  return handleRequest(request, handler);
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
} 