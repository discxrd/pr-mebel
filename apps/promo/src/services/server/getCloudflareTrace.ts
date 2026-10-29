export async function getCloudflareTrace(): Promise<any> {
  try {
    const response = await fetch("https://www.cloudflare.com/cdn-cgi/trace", {
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const textData = await response.text();

    // Конвертируем key-value пары в объект
    const data: any = textData
      .trim()
      .split("\n")
      .reduce((obj: any, pair) => {
        const [key, value] = pair.split("=");
        if (key && value) {
          obj[key as keyof any] = value;
        }
        return obj;
      }, {});

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching Cloudflare trace:", error);

    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
