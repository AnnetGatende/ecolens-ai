export async function reverseGeocode(latitude: number, longitude: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
  
    try {
      const response = await fetch(url, {
        headers: {
          // Nominatim requires a user-agent
          "User-Agent": "EcoLens-AI/1.0",
        },
      });
  
      if (!response.ok) throw new Error("Geocoding failed");
  
      const data = await response.json();
      const address = data.address || {};
  
      const county = address.county || address.state_district || address.state || null;
      const subCounty = address.city || address.town || address.municipality || null;
      const ward = address.suburb || address.village || address.district || null;
      const area = address.neighbourhood || address.residential || address.hamlet || address.road || null;
  
      // Create a fallback display location by filtering out nulls
      const locationParts = [area, ward, subCounty, county].filter(Boolean);
      const displayLocation = locationParts.length > 0 ? locationParts.join(", ") : "Unknown Location";
  
      return {
        county,
        subCounty,
        ward,
        area,
        displayLocation,
      };
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return {
        county: null,
        subCounty: null,
        ward: null,
        area: null,
        displayLocation: "Unknown Location",
      };
    }
  }