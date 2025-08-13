// Location and Maps Utilities

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLong = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLong / 2) * Math.sin(dLong / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const getDistanceMatrix = async (origins, destinations) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  
  if (!apiKey) {
    console.error('Google Maps API key not found')
    return null
  }

  const originStr = origins.map(o => `${o.lat},${o.lng}`).join('|')
  const destStr = destinations.map(d => `${d.lat},${d.lng}`).join('|')
  
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originStr}&destinations=${destStr}&units=metric&key=${apiKey}`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.status === 'OK' && data.rows[0]?.elements[0]?.status === 'OK') {
      return data.rows[0].elements[0]
    } else {
      console.error('Distance Matrix API error:', data)
      return null
    }
  } catch (error) {
    console.error('Distance Matrix API error:', error)
    return null
  }
}

export const formatDistance = (distanceKm) => {
  if (!distanceKm) return 'Unknown'
  
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`
  } else if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)}km`
  } else {
    return `${Math.round(distanceKm)}km`
  }
}

export const getLocationName = async (lat, lng) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  
  if (!apiKey) {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    )
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      // Get a nice short address
      const result = data.results[0]
      const addressComponents = result.address_components
      
      // Try to get area + city
      const area = addressComponents.find(c => c.types.includes('sublocality') || c.types.includes('locality'))?.long_name
      const city = addressComponents.find(c => c.types.includes('administrative_area_level_2'))?.long_name
      
      if (area && city) {
        return `${area}, ${city}`
      } else {
        return result.formatted_address.split(',').slice(0, 2).join(',')
      }
    }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  } catch (error) {
    console.error('Geocoding error:', error)
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }
}