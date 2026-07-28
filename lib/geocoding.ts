export async function reverseGeocode(lat: number, lon: number) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
      { headers: { "User-Agent": "EcoLens-AI-App" } }
    );
    const data = await res.json();
    
    if (data && data.address) {
      // 1. Extract raw values from Nominatim
      let rawCounty = data.address.state || data.address.county || "Mombasa";
      let rawSubCounty = data.address.city_district || data.address.town || data.address.city || "";
      let rawWard = data.address.suburb || data.address.neighbourhood || data.address.village || "";
      const area = data.address.road || data.address.residential || null;

      // 2. Aggressively strip out redundant labels (e.g., changing "Timbwani ward" to "Timbwani")
      const cleanText = (text: string) => text.replace(/(county|sub-?county|ward)/ig, "").trim();
      
      rawCounty = cleanText(rawCounty) || "Mombasa";
      rawSubCounty = cleanText(rawSubCounty);
      rawWard = cleanText(rawWard);

      // 3. The Mombasa Smart-Swap
      // Nominatim often flips these. If 'ward' contains a known Sub-County, we swap them.
      const mombasaSubCounties = ["likoni", "mvita", "nyali", "kisauni", "jomvu", "changamwe"];
      
      if (mombasaSubCounties.includes(rawWard.toLowerCase())) {
         const temp = rawSubCounty;
         rawSubCounty = rawWard;
         rawWard = temp;
      }

      // 4. Proper Capitalization
      const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
      
      const finalCounty = capitalize(rawCounty);
      const finalSubCounty = capitalize(rawSubCounty);
      const finalWard = capitalize(rawWard);

      // 5. Build the strict Administrative Hierarchy String
      let displayStr = `County - ${finalCounty}`;
      
      if (finalSubCounty) {
         displayStr += `, Sub-County - ${finalSubCounty}`;
      }
      
      // Only append Ward if it exists and isn't just a duplicate of the Sub-County
      if (finalWard && finalWard.toLowerCase() !== finalSubCounty.toLowerCase()) {
         displayStr += `, Ward - ${finalWard}`;
      }

      return {
        county: finalCounty,
        subCounty: finalSubCounty || null,
        ward: finalWard || null,
        area,
        displayLocation: displayStr,
      };
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
  }
  
  // Fallback if the API completely fails
  return {
    county: "Mombasa",
    subCounty: null,
    ward: null,
    area: null,
    displayLocation: `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`,
  };
}