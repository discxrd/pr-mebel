export async function getGeoData({ ip }: { ip: string }): Promise<any> {
  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=country,regionName,city,isp,lat,lon`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching geo data:", error);

    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
