"use client";

import React, { useState, useCallback } from "react";
import { ArrowRight, Camera, CheckCircle, MapPin, X } from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker, Libraries } from '@react-google-maps/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reportIssue } from "@/features/issue/api";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthSelector } from "@/features/auth/hooks.redux";
import { useRouter } from "next/navigation";

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
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isLoggedIn } = useAuthSelector();

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
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  // Photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const removePhoto = () => {
    setFormData({ ...formData, photo: null });
    setPhotoPreview(null);
  };

  // Reverse geocode using OpenStreetMap
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`, {
        headers: { 'User-Agent': 'CivicIssueReporter/1.0' }
      });
      const data = await res.json();
      return data?.display_name || "";
    } catch (error) {
      console.error("Geocoding error:", error);
      return "";
    }
  };

  // Map click
  const handleMapClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    setFormData(prev => ({ ...prev, latitude: lat.toFixed(6), longitude: lng.toFixed(6) }));
    const address = await reverseGeocode(lat, lng);
    if (address) setFormData(prev => ({ ...prev, address }));
  }, []);

  // Latitude/Longitude input change
  const handleLatLngChange = async (field: 'latitude' | 'longitude', value: string) => {
    if (value === '' || /^-?\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, [field]: value }));
      const lat = field === 'latitude' ? parseFloat(value) : parseFloat(formData.latitude);
      const lng = field === 'longitude' ? parseFloat(value) : parseFloat(formData.longitude);

      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setMapCenter({ lat, lng });
        setMarkerPosition({ lat, lng });
        const address = await reverseGeocode(lat, lng);
        if (address) setFormData(prev => ({ ...prev, address }));
      }
    }
  };

  // Submit issue
  const handleSubmit = async () => {
    if (!formData.issueType || !formData.description || !formData.address) {
      alert("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await reportIssue({
        issueType: formData.issueType,
        description: formData.description,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        photo: formData.photo,
      });

      // Reset form
      setFormData({ issueType: "", description: "", address: "", latitude: "", longitude: "", photo: null });
      setPhotoPreview(null);
      setMarkerPosition(null);
      setShowMap(false);

      // Show success modal
      setShowSuccessModal(true);

      // Refetch all issues
      queryClient.invalidateQueries({ queryKey: ['getAllIssue'] });
    } catch (error) {
      console.error("Error submitting issue:", error);
      alert("Failed to submit issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Report Issue Modal */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold">{modalTitle}</DialogTitle>
            <DialogDescription className="text-base">{modalDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 mt-4">
            {/* Issue Type */}
            <div>
              <label className="block text-sm font-semibold mb-2">Issue Type <span className="text-red-500">*</span></label>
              <Select value={formData.issueType} onValueChange={(val) => setFormData({ ...formData, issueType: val })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  {issueTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">Description <span className="text-red-500">*</span></label>
              <Textarea
                rows={4}
                placeholder="Describe the issue in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length} characters</p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold mb-2">Location <span className="text-red-500">*</span></label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                    <Input
                      placeholder="e.g., 19.076090"
                      value={formData.latitude}
                      onChange={(e) => handleLatLngChange('latitude', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                    <Input
                      placeholder="e.g., 72.877426"
                      value={formData.longitude}
                      onChange={(e) => handleLatLngChange('longitude', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Textarea
                      rows={2}
                      placeholder="Enter or edit address..."
                      className="pl-10"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <MapPin className="w-4 h-4" /> {showMap ? "Hide Map" : "📍 Pick Location on Map"}
                </button>

                {showMap && isLoaded && (
                  <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={mapCenter}
                      zoom={markerPosition ? 15 : 12}
                      onClick={handleMapClick}
                      options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
                    >
                      {markerPosition && <Marker position={markerPosition} draggable onDragEnd={handleMapClick} />}
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
              <label className="block text-sm font-semibold mb-2">Upload Photo <span className="text-gray-400 font-normal">(Optional)</span></label>
              {!photoPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer relative group">
                  <Camera className="w-12 h-12 mx-auto mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <p className="text-sm text-gray-600 mb-1 font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                  <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handlePhotoChange} />
                </div>
              ) : (
                <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                  <img src={photoPreview} alt="Preview" className="w-full h-48 object-cover" />
                  <button type="button" onClick={removePhoto} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white px-3 py-2 text-sm">{formData.photo?.name}</div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button onClick={handleSubmit} className="w-full flex items-center justify-center" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Report <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md w-[90vw] text-center space-y-6 p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <DialogTitle className="text-xl font-bold">Issue Reported Successfully!</DialogTitle>
            <DialogDescription className="text-sm text-gray-700">
              Your issue has been submitted to <span className="font-semibold text-gray-900">Civic</span>. 
              Our team will review it and take appropriate action. Thank you for helping improve your community!
            </DialogDescription>
            <Button variant="default" className="w-full mt-2" onClick={() => setShowSuccessModal(false)}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportIssueModal;
