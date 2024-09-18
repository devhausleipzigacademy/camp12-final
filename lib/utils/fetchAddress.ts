export async function fetchAddress(lat: number, lon: number) {
  const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;
  const apiUrl = `https://api.geoapify.com/v1/geocode/reverse`;

  if (!apiKey) {
    throw new Error(
      "Geoapify API Key is not defined in environment variables."
    );
  }
  

  const response = await fetch(
    `${apiUrl}?lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch address");
  }

  const data = await response.json();

  console.log(data);

  const address = data.results[0].formatted;

  return address;
}
