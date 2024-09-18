// lib/geoapify.ts
export async function fetchCityName(lat: string, lon: string) {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  const apiUrl = `https://api.geoapify.com/v1/geocode/reverse`;

  if (!apiKey) {
    throw new Error(
      "Geoapify API Key is not defined in environment variables."
    );
  }

  const response = await fetch(
    `${apiUrl}?lat=${lat}&lon=${lon}&type=city&apiKey=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch city name");
  }

  const data = await response.json();
  if (data.features && data.features.length > 0) {
    return data.features[0].properties.city;
  } else {
    throw new Error("City name not found");
  }
}
