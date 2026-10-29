import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookies = request.cookies;
  const headers = request.headers;
  const searchParams = request.nextUrl.searchParams;

  const cookieVisitorData = cookies.get("visitorData");
  
  if (!cookieVisitorData) {
    const referer = headers.get("referer");
    const visitorData: Record<string, string> = {};
    
    if (referer) visitorData.referer = referer;
    
    for (const [key, value] of searchParams.entries()) {
      visitorData[key] = value;
    }

    // ✅ Правильный способ установки куки — через response
    const response = NextResponse.next();
    response.cookies.set({
      name: "visitorData",
      value: JSON.stringify(visitorData),
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
    });
    
    return response;
  }

  return NextResponse.next();
}

// ✅ Исключаем статику, API и системные файлы
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};