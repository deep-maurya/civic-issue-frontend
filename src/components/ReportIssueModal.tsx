"use client";

import React, { useState } from "react";
import { ArrowRight, Camera, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type ReportIssueModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modalTitle?: string;
  modalDescription?: string;
};

const ReportIssueModal: React.FC<ReportIssueModalProps> = ({
  open,
  onOpenChange,
  modalTitle = "Report an Issue",
  modalDescription = "Help improve your community by reporting local issues",
}) => {
  const [formData, setFormData] = useState({
    issueType: "",
    description: "",
    location: "",
    photo: null as File | null,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Issue reported successfully! Our team will review it shortly.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-full max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>

        <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
          {/* Issue Type */}
          <div>
            <label className="block text-sm font-medium mb-2">Issue Type *</label>
            <select
              className="w-full px-4 py-3 border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
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
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              rows={4}
              placeholder="Describe the issue in detail..."
              className="w-full px-4 py-3 border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">Location *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-5 h-5 opacity-50" />
              <input
                type="text"
                placeholder="Enter location or address"
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Photo (Optional)
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer relative">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm opacity-70 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs opacity-50">PNG, JPG up to 10MB</p>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) =>
                  setFormData({ ...formData, photo: e.target.files?.[0] ?? null })
                }
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            Submit Report
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIssueModal;
