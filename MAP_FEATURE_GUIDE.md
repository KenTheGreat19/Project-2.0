# Job Location Map Feature

## Overview
The ApplyNHire platform now includes an interactive world map that helps users find jobs near their location. This feature uses OpenStreetMap and the Leaflet library to display job locations with distance calculations.

## Features

### 🗺️ Interactive Map
- **World Map View**: Interactive map showing all available job locations
- **Job Markers**: Each job is marked with a pin on the map showing its location
- **Click to View**: Click on any marker to see job details and view the full posting

### 📍 Location-Based Search
- **User Location Detection**: Click "Use My Location" to automatically detect your position
- **Distance Calculation**: See how far each job is from your current location
- **Nearest Jobs List**: View the 5 nearest jobs sorted by distance

### 🎯 Smart Geocoding
- **Automatic Location Conversion**: Job locations are automatically converted to coordinates
- **Rate Limiting**: Built-in delays to respect OpenStreetMap's usage policies
- **Caching**: Duplicate locations are cached to reduce API calls

### 📊 Job Details on Map
Each job marker shows:
- Job Title
- Company Name
- Location
- Distance from you (if location enabled)
- Salary Range (if available)
- Direct link to job details

## How It Works

### For Applicants

1. **Visit the Homepage**: The map appears below the search bar
2. **Enable Location** (Optional): Click "Use My Location" button to:
   - Center the map on your position
   - Show distances to all jobs
   - Sort jobs by proximity
3. **Explore Jobs**: 
   - Pan and zoom the map to explore different regions
   - Click markers to see job details
   - Click "View Details" to see the full job posting

### For Employers

Jobs are automatically displayed on the map based on the location you entered when posting. Make sure to use clear, specific locations (e.g., "New York, USA" instead of just "Office").

## Technical Details

### Components

- **`JobMap.tsx`**: Main map component using React-Leaflet
- **`JobMapClient.tsx`**: Client-side wrapper with view mode toggle
- **`JobMapSection.tsx`**: Server component that fetches jobs from database

### Libraries Used

- **Leaflet**: Open-source JavaScript map library
- **React-Leaflet**: React components for Leaflet
- **OpenStreetMap**: Free tile provider for map imagery
- **Nominatim**: Free geocoding service from OpenStreetMap

### Distance Calculation

Uses the Haversine formula to calculate distances:
```
Distance = 2 × R × arcsin(√(sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)))
```
Where R = Earth's radius (6,371 km)

## Usage Limits

### Geocoding (Nominatim)
- **Rate Limit**: 1 request per second
- **Usage Policy**: Must include User-Agent header
- **Limit**: Maximum 50 jobs per page to avoid rate limiting

### Best Practices

1. **Location Format**: Use standard formats:
   - ✅ "London, United Kingdom"
   - ✅ "San Francisco, CA, USA"
   - ✅ "Tokyo, Japan"
   - ❌ "Downtown" (too vague)
   - ❌ "My office" (not geocodable)

2. **Performance**: 
   - Map loads up to 50 jobs at once
   - Geocoding happens progressively with 1-second delays
   - Duplicate locations are cached

3. **Privacy**:
   - User location is only used in the browser
   - No location data is sent to the server
   - Users must explicitly enable location sharing

## Browser Compatibility

The map feature requires:
- Modern browser with JavaScript enabled
- Support for HTML5 Geolocation API (for location detection)
- Canvas support for map rendering

Tested on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Future Enhancements

Potential improvements:
- [ ] Clustering for dense job areas
- [ ] Heat maps showing job concentration
- [ ] Custom filters (salary, job type) directly on map
- [ ] Save favorite locations
- [ ] Multi-location search (e.g., "show jobs in NYC or SF")
- [ ] Commute time estimation
- [ ] Integration with Google Maps for directions

## Troubleshooting

### Map Not Loading
- Check browser console for errors
- Ensure JavaScript is enabled
- Verify network connection

### Location Detection Failed
- Grant location permissions in browser
- Check if HTTPS is enabled (required for geolocation)
- Try manually browsing the map instead

### Jobs Not Appearing
- Check if jobs have valid location data
- Some locations may not be geocodable
- Rate limiting may delay marker appearance

### Distance Inaccurate
- Distances are "as the crow flies" (straight line)
- Does not account for roads or terrain
- Use as rough estimates only

## API Reference

### JobMap Props

```typescript
interface JobMapProps {
  jobs: Array<{
    id: string
    title: string
    company: string
    location: string
    type: string
    salaryMin?: number | null
    salaryMax?: number | null
  }>
  onJobClick?: (jobId: string) => void
}
```

### Distance Calculation

```typescript
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number
```

Returns distance in kilometers.

## Credits

- Map tiles by [OpenStreetMap](https://www.openstreetmap.org/copyright)
- Geocoding by [Nominatim](https://nominatim.org/)
- Map library by [Leaflet](https://leafletjs.com/)
- React integration by [React-Leaflet](https://react-leaflet.js.org/)
