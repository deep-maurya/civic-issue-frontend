"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight, Camera, MapPin, X, Navigation } from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker, Libraries } from '@react-google-maps/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { reportIssue } from "@/features/issue/api";

type ReportIssueModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modalTitle?: string;
  modalDescription?: string;
};

const mapContainerStyle = { width: '100%', height: '400px', borderRadius: '8px' };
const defaultCenter = { lat: 19.0760, lng: 72.8777 };
const libraries: Libraries = ['places'];

const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  open,
  onOpenChange,
  modalTitle = "Report an Issue",
  modalDescription = "Help improve your community by reporting local issues",
}) => {
  const [formData, setFormData] = useState({
    issueType: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
    photo: null as File | null,
  });
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const issueTypes = [
    "Pothole",
    "Street Light",
    "Garbage Collection",
    "Water Leakage",
    "Broken Sidewalk",
    "Illegal Dumping",
    "Other",
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData({ ...formData, photo: null });
    setPhotoPreview(null);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'CivicIssueReporter/1.0'
          }
        }
      );
      const data = await response.json();
      if (data && data.display_name) {
        return data.display_name;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }
    return "";
  };

  const handleMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPosition({ lat, lng });
      setFormData(prev => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      }));
      const address = await reverseGeocode(lat, lng);
      if (address) {
        setFormData(prev => ({
          ...prev,
          address: address,
        }));
      }
    }
  }, []);

  const handleLatLngChange = async (field: 'latitude' | 'longitude', value: string) => {
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
      const lat = field === 'latitude' ? parseFloat(value) : parseFloat(formData.latitude);
      const lng = field === 'longitude' ? parseFloat(value) : parseFloat(formData.longitude);

      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
      
        const address = await reverseGeocode(lat, lng);
        if (address) {
          setFormData(prev => ({
            ...prev,
            address: address,
          }));
        }
      }
    }
  };

  const handleSubmit = async() => {
    if (!formData.issueType || !formData.description || !formData.address) {
      alert("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await reportIssue({
        issueType: formData.issueType,
        description: formData.description,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        photo: formData.photo,
      });      
      // Reset form
      setFormData({
        issueType: "",
        description: "",
        address: "",
        latitude: "",
        longitude: "",
        photo: null,
      });
      setPhotoPreview(null);
      setShowMap(false);
      setMarkerPosition(null);
      
      alert("✓ Issue reported successfully! Our team will review it shortly.");
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting issue:", error);
      alert("Failed to submit issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold">{modalTitle}</DialogTitle>
          <DialogDescription className="text-base">{modalDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Issue Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Issue Type <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={formData.issueType}
              onChange={(e) =>
                setFormData({ ...formData, issueType: e.target.value })
              }
            >
              <option value="">Select issue type</option>
              {issueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Describe the issue in detail..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length} characters
            </p>
          </div>

          {/* Location Section */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {/* Latitude and Longitude Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                  <input
                    type="text"
                    placeholder="e.g., 19.076090"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    value={formData.latitude}
                    onChange={(e) => handleLatLngChange('latitude', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                  <input
                    type="text"
                    placeholder="e.g., 72.877426"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                    value={formData.longitude}
                    onChange={(e) => handleLatLngChange('longitude', e.target.value)}
                  />
                </div>
              </div>

              {/* Address Field */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    rows={2}
                    placeholder="Enter or edit address..."
                    className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg bg-background focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-sm"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Map Toggle */}
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <MapPin className="w-4 h-4" />
                {showMap ? "Hide Map" : "📍 Pick Location on Map"}
              </button>

              {/* Google Map */}
              {showMap && isLoaded && (
                <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={mapCenter}
                    zoom={markerPosition ? 15 : 12}
                    onClick={handleMapClick}
                    options={{
                      streetViewControl: false,
                      mapTypeControl: false,
                      fullscreenControl: false,
                    }}
                  >
                    {markerPosition && (
                      <Marker
                        position={markerPosition}
                        draggable={true}
                        onDragEnd={handleMapClick}
                      />
                    )}
                  </GoogleMap>
                  <div className="bg-blue-50 p-3 text-xs text-blue-800 text-center font-medium">
                    Click anywhere on the map or drag the marker to set location
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Upload Photo <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            
            {!photoPreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer relative group">
                <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                <p className="text-sm text-gray-600 mb-1 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handlePhotoChange}
                />
              </div>
            ) : (
              <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white px-3 py-2 text-sm">
                  {formData.photo?.name}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                Submit Report
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIssueModal;