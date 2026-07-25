export async function reverseGeocode(lat: number, lon: number) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      { headers: { "User-Agent": "EcoLens-AI-App" } }
    );
    const data = await res.json();
    
    if (data && data.address) {
      // Smarter mapping for Kenyan boundaries
      const county = data.address.state || data.address.county || "Mombasa";
      const subCounty = data.address.city_district || data.address.town || data.address.city || "Likoni";
      const ward = data.address.suburb || data.address.neighbourhood || data.address.village || "Unknown Ward";
      const area = data.address.road || data.address.residential || null;

      return {
        county: county.replace(" County", ""),
        subCounty,
        ward,
        area,
        displayLocation: `County - ${county.replace(" County", "")}, Sub-County - ${subCounty}, Ward - ${ward}`,
      };
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
  }
  
  return {
    county: "Unknown",
    subCounty: "Unknown",
    ward: "Unknown",
    area: null,
    displayLocation: `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`,
  };
}