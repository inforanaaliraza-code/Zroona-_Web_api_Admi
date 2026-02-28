"use client";

import React, { useState, useRef, useEffect } from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";

const DEFAULT_CENTER = { lat: 24.7136, lng: 46.6753 };

// Empty = only Maps JavaScript API (no Places). Avoids ApiTargetBlockedMapError when Places not enabled.
// Address search uses Geocoder (included in main API) on map click / manual type.
const MAP_LIBRARIES = [];

/**
 * Map block that loads Google Maps only when mounted. Mount this ONLY when:
 * - User is on the location step AND
 * - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set
 * This prevents "This page didn't load Google Maps correctly" from empty/invalid key
 * and ensures the map container is in the DOM with size when the script loads.
 */
export default function EventLocationMapBlock({
  apiKey,
  formik,
  t,
  fieldBoxClass = "h-12 text-base rounded-xl border-2 border-gray-200 bg-gray-50/50 focus:border-[#a797cc] focus:ring-4 focus:ring-purple-100 transition-all",
  placeholderOpacityClass = "placeholder:opacity-60 placeholder:text-gray-400",
  containerHeight = "400px",
  showLabel = true,
  labelKey = "add.tab7",
}) {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [mapLoadedSuccessfully, setMapLoadedSuccessfully] = useState(false);
  const [mapRetryCount, setMapRetryCount] = useState(0);
  const mapLoadedRef = useRef(false);

  const trimmedKey = (apiKey || "").trim();

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script-event",
    googleMapsApiKey: trimmedKey,
    libraries: MAP_LIBRARIES,
    loadingElement: (
      <div className="w-full flex items-center justify-center py-12 bg-gray-50 rounded-xl">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#a797cc] border-t-transparent" />
      </div>
    ),
  });

  useEffect(() => {
    if (loadError) {
      setMapError(loadError.message || (t && t("maps.loadFailed")) || "Failed to load Google Maps.");
    }
  }, [loadError, t]);

  useEffect(() => {
    if (!isLoaded || mapError) return;
    mapLoadedRef.current = false;
    setMapLoadedSuccessfully(false);
    const timer = setTimeout(() => {
      if (!mapLoadedRef.current) {
        setMapError((t && t("maps.loadFailed")) || "Failed to load Google Maps.");
      }
    }, 12000);
    return () => clearTimeout(timer);
  }, [isLoaded, mapError, t]);

  useEffect(() => {
    if (formik.values.latitude && formik.values.longitude) {
      const position = {
        lat: parseFloat(formik.values.latitude),
        lng: parseFloat(formik.values.longitude),
      };
      setMarkerPosition(position);
      if (map && isLoaded) {
        map.setCenter(position);
        map.setZoom(15);
      }
    } else {
      setMarkerPosition(null);
    }
  }, [formik.values.latitude, formik.values.longitude, map, isLoaded]);

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const position = { lat, lng };
    formik.setFieldValue("latitude", lat.toFixed(6));
    formik.setFieldValue("longitude", lng.toFixed(6));
    setMarkerPosition(position);
    if (window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          formik.setFieldValue("event_address", results[0].formatted_address);
        }
      });
    }
  };

  const handleMarkerDragEnd = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const position = { lat, lng };
    formik.setFieldValue("latitude", lat.toFixed(6));
    formik.setFieldValue("longitude", lng.toFixed(6));
    setMarkerPosition(position);
    if (window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          formik.setFieldValue("event_address", results[0].formatted_address);
        }
      });
    }
  };

  const handleRetry = () => {
    setMapError(null);
    setMapLoadedSuccessfully(false);
    mapLoadedRef.current = false;
    setMapRetryCount((c) => c + 1);
    window.location.reload();
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <Label className="text-xs font-semibold mb-1.5 block">
          {(t && t(labelKey)) || "Event Address"} <span className="text-red-500">*</span>
        </Label>
      )}
      <div className="relative">
        <Input
          type="text"
          placeholder={(t && t("add.enterAddressManually")) || "Enter address or click on map..."}
          value={formik.values.event_address || ""}
          onChange={(e) => {
            formik.setFieldValue("event_address", e.target.value);
            if (e.target.value && isLoaded && window.google) {
              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode({ address: e.target.value }, (results, status) => {
                if (status === "OK" && results && results[0]) {
                  const loc = results[0].geometry.location;
                  formik.setFieldValue("latitude", loc.lat().toFixed(6));
                  formik.setFieldValue("longitude", loc.lng().toFixed(6));
                  setMarkerPosition({ lat: loc.lat(), lng: loc.lng() });
                  if (map) {
                    map.setCenter({ lat: loc.lat(), lng: loc.lng() });
                    map.setZoom(15);
                  }
                }
              });
            }
          }}
          className={`${fieldBoxClass} ${placeholderOpacityClass}`}
        />
      </div>

      {mapError ? (
        <div
          className="w-full rounded-xl border-2 border-amber-200 overflow-hidden bg-gradient-to-br from-amber-50/80 to-white flex flex-col items-center justify-center px-5 py-8 text-center"
          style={{ minHeight: containerHeight }}
        >
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <Icon icon="lucide:map-pin-off" className="w-7 h-7 text-amber-600" />
          </div>
          <p className="text-base font-bold text-gray-800 mb-3">{(t && t("maps.loadError")) || "Map unavailable"}</p>
          <p className="text-xs text-gray-600 max-w-md mb-4 leading-relaxed">
            {(t && t("maps.loadErrorHint")) || "You can enter your event address in the field above to continue."}
          </p>
          <div className="w-full max-w-md text-left bg-white border border-amber-200 rounded-xl px-4 py-3 mb-5 shadow-sm">
            <p className="text-sm font-semibold text-amber-800 mb-2">{(t && t("maps.fixTitle")) || "Map not loading? Do these steps:"}</p>
            <ul className="space-y-2 text-xs text-gray-700 leading-relaxed">
              <li>{(t && t("maps.fixStep0")) || "0) Quick test: Create a NEW API key → Application restrictions: None, API restrictions: Don't restrict key → paste in .env.local → restart dev server."}</li>
              <li>{(t && t("maps.fixStep1")) || "1) Use http://localhost:3000 or add http://127.0.0.1:3000/* in API key → Website restrictions."}</li>
              <li>{(t && t("maps.fixStep2")) || "2) Billing must be enabled for this project; wait up to 24h after first payment."}</li>
              <li>{(t && t("maps.fixStep3")) || "3) Enable 'Maps JavaScript API' in APIs & Services → Library."}</li>
            </ul>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleRetry}
              className="px-5 py-2.5 rounded-xl border-2 border-[#a797cc] text-[#a797cc] text-sm font-semibold hover:bg-[#a797cc]/10 transition-colors"
            >
              {(t && t("maps.retry")) || "Retry"}
            </button>
          </div>
        </div>
      ) : isLoaded ? (
        <div key={mapRetryCount} className="relative isolate rounded-b-xl overflow-hidden border-x-2 border-b-2 border-gray-200 shadow-xl" style={{ minHeight: containerHeight, height: containerHeight }}>
          {!mapLoadedSuccessfully && (
            <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-white rounded-b-xl">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#a797cc] border-t-transparent mb-3" />
              <p className="text-sm font-medium text-gray-700">{(t && t("maps.loadingMap")) || "Loading map..."}</p>
            </div>
          )}
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%", borderRadius: "0 0 0.75rem 0.75rem" }}
            center={markerPosition || DEFAULT_CENTER}
            zoom={markerPosition ? 15 : 10}
            onClick={handleMapClick}
            onLoad={(mapInstance) => {
              mapLoadedRef.current = true;
              setMap(mapInstance);
              setMapLoadedSuccessfully(true);
            }}
            options={{
              mapTypeControl: true,
              fullscreenControl: true,
              streetViewControl: false,
              zoomControl: true,
              mapTypeId: "roadmap",
            }}
          >
            {markerPosition && (
              <Marker position={markerPosition} draggable onDragEnd={handleMarkerDragEnd} />
            )}
          </GoogleMap>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-sm text-gray-500">{(t && t("maps.loadingMap")) || "Loading map..."}</p>
        </div>
      )}
    </div>
  );
}
