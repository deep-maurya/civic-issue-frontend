"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ThumbsUp,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Opinion {
  _id: string;
  user: User | null;
  comment: string;
  date: string;
}

interface Timeline {
  _id: string;
  status: string;
  by: User | null;
  date: string;
}

interface Issue {
  _id: string;
  title: string;
  description: string;
  location: string;
  images: string[];
  reportedBy: User | null;
  upvotes: User[];
  timeline: Timeline[];
  status: string;
  opinions: Opinion[];
  assignedTo?: User;
  createdAt: string;
}

const issues = [
    {
        "_id": "68fd3d9b9c5022202ef0a517",
        "title": "Pothole on Main Street",
        "description": "Large pothole causing traffic issues near the central park.",
        "location": "Main Street, Downtown",
        "images": [
            "https://res.cloudinary.com/dnxcz7avf/image/upload/v1761426842/civic-issues/tc6bkexrdk4hgqbotf23.png"
        ],
        "reportedBy": {
            "_id": "68fca36c40ea900c68992f3c",
            "name": "Deepak maurya",
            "email": "Deepakmauryahd2@gmail.com"
        },
        "upvotes": [],
        "timeline": [
            {
                "status": "reported",
                "by": {
                    "_id": "68fca36c40ea900c68992f3c",
                    "name": "Deepak maurya",
                    "email": "Deepakmauryahd2@gmail.com"
                },
                "date": "2025-10-25T21:14:03.050Z",
                "_id": "68fd3d9b9c5022202ef0a518"
            }
        ],
        "status": "pending",
        "opinions": [],
        "createdAt": "2025-10-25T21:14:03.073Z",
        "updatedAt": "2025-10-25T21:14:03.073Z",
        "__v": 0
    },
    {
        "_id": "68fd3db79c5022202ef0a522",
        "title": "Pothole on Main Street mumbai",
        "description": "Large pothole causing traffic issues near the central park.",
        "location": "Main Street, Downtown",
        "images": [
            "https://res.cloudinary.com/dnxcz7avf/image/upload/v1761426870/civic-issues/bl9zhdzt9dhm4sxhv97j.png"
        ],
        "reportedBy": {
            "_id": "68fca36c40ea900c68992f3c",
            "name": "Deepak maurya",
            "email": "Deepakmauryahd2@gmail.com"
        },
        "upvotes": [],
        "timeline": [
            {
                "status": "reported",
                "by": {
                    "_id": "68fca36c40ea900c68992f3c",
                    "name": "Deepak maurya",
                    "email": "Deepakmauryahd2@gmail.com"
                },
                "date": "2025-10-25T21:14:31.798Z",
                "_id": "68fd3db79c5022202ef0a523"
            }
        ],
        "status": "pending",
        "opinions": [],
        "createdAt": "2025-10-25T21:14:31.803Z",
        "updatedAt": "2025-10-25T21:14:31.803Z",
        "__v": 0
    }
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "in-progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "assigned":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200";
    case "closed":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return <Clock className="w-4 h-4" />;
    case "in-progress":
      return <Clock className="w-4 h-4" />;
    case "assigned":
      return <User className="w-4 h-4" />;
    case "resolved":
      return <CheckCircle2 className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export default function AllIssues() {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  return (
<div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {issues.map((issue) => (
            <div
              key={issue._id}
              className="bg-background border border-border/50 rounded-xl hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
              onClick={() => openModal(issue)}
            >
              {/* Main Image */}
              <div className="w-full h-40 rounded-t-lg overflow-hidden mb-4 bg-gray-100 dark:bg-slate-700 flex items-center justify-center">
                {issue.images[0] ? (
                  <img
                    src={issue.images[0]}
                    alt={issue.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <MapPin className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                )}
              </div>

              <div className="px-4 py-2">
                {/* Title */}
              <h3 className="text-lg font-semibold mb-1 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {issue.title}
              </h3>

              {/* Description */}
              <p className="text-foreground/70 text-sm mb-3 line-clamp-3">
                {issue.description}
              </p>

              {/* Who created */}
              <div className="flex items-center mb-3 space-x-2">
                <img
                  src={"/avatar.jpeg"}
                  alt={issue?.reportedBy?.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-foreground/80">
                  {issue?.reportedBy?.name || "Anonymous"}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center  text-sm text-gray-500 dark:text-gray-400 mb-3">
                <MapPin className="w-4 h-4 mr-1 text-primary" />
                <span className="line-clamp-1">{issue.location}</span>
              </div>

              {/* Upvote Button & Date */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <button
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md border ${
                    true
                      ? "bg-primary text-white border-primary"
                      : "border-border/50 text-primary hover:bg-primary/10"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    // handleUpvote(issue._id);
                  }}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{issue.upvotes?.length || 0}</span>
                </button>

                <div className="flex items-center space-x-1 text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>

     

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[90vw] lg:max-w-[900px] xl:max-w-[900px] lg:h-[500px] h-[90vh] p-0 overflow-hidden flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full overflow-hidden">
            {/* Left Side - Content */}
            <div className="lg:col-span-2 p-4 md:p-6 overflow-y-auto">
              <DialogHeader className="mb-4 md:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1">
                    <DialogTitle className="text-xl md:text-2xl font-bold mb-2">
                      {selectedIssue?.title}
                    </DialogTitle>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span className="truncate">
                          {selectedIssue?.reportedBy?.name || "Anonymous"}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {selectedIssue &&
                          new Date(
                            selectedIssue.createdAt
                          ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      selectedIssue?.status || ""
                    )} whitespace-nowrap self-start`}
                  >
                    {selectedIssue?.status.toUpperCase()}
                  </span>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-[40px]">
                  <TabsTrigger value="details" className="text-xs sm:text-sm">
                    Details
                  </TabsTrigger>
                  <TabsTrigger value="opinions" className="text-xs sm:text-sm">
                    Opinions ({selectedIssue?.opinions.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="images" className="text-xs sm:text-sm">
                    Images ({selectedIssue?.images.length || 0})
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="details"
                  className="space-y-4 md:space-y-6 pb-6"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      {selectedIssue?.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                      Location
                    </h3>
                    <div className="flex items-center text-gray-700 text-sm md:text-base">
                      <MapPin className="w-4 h-4 mr-2 text-red-500 flex-shrink-0" />
                      <span className="break-words">
                        {selectedIssue?.location}
                      </span>
                    </div>
                  </div>

                  {selectedIssue?.assignedTo && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                        Assigned To
                      </h3>
                      <div className="flex items-center text-gray-700 text-sm md:text-base">
                        <User className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0" />
                        <span className="truncate">
                          {selectedIssue.assignedTo.name}
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                      Upvotes
                    </h3>
                    <div className="flex items-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center space-x-2 text-xs md:text-sm"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="font-semibold">
                          {selectedIssue?.upvotes?.length || 0} support
                        </span>
                      </Button>
                    </div>
                  </div>

                  {/* Timeline for Mobile - Show here on small screens */}
                  <div className="lg:hidden mt-6 pt-6 border-t">
                    <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-600" />
                      Timeline
                    </h3>
                    <div className="space-y-4 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-300 pb-4">
                      {selectedIssue?.timeline.map((t, index) => (
                        <div key={t._id} className="relative pl-10">
                          <div
                            className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(
                              t.status
                            )} border-4 border-white shadow-md`}
                          >
                            {getStatusIcon(t.status)}
                          </div>
                          <div className="bg-white rounded-lg p-3 shadow-sm border hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                              <span
                                className={`font-semibold text-xs px-2 py-1 rounded ${getStatusColor(
                                  t.status
                                )}`}
                              >
                                {t.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-1 truncate">
                              By: {t.by?.name || "System"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(t.date).toLocaleDateString()} at{" "}
                              {new Date(t.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="opinions"
                  className="space-y-3 md:space-y-4 pb-6"
                >
                  {selectedIssue?.opinions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm md:text-base">No opinions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3 md:space-y-4">
                      {selectedIssue?.opinions.map((op) => (
                        <div
                          key={op._id}
                          className="border rounded-lg p-3 md:p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center flex-1 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold mr-3 flex-shrink-0">
                                {(op.user?.name || "A")[0].toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm text-gray-900 truncate">
                                  {op.user?.name || "Anonymous"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(op.date).toLocaleDateString()}
                                  <span className="hidden sm:inline">
                                    {" "}
                                    at{" "}
                                    {new Date(op.date).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm ml-0 sm:ml-11 break-words">
                            {op.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="images" className="space-y-4 pb-6">
                  {selectedIssue?.images.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm md:text-base">
                        No images available
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      {selectedIssue?.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="aspect-square rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
                        >
                          <img
                            src={img}
                            alt={`Issue Image ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Side - Timeline (Desktop Only) */}
            <div className="hidden lg:block bg-gradient-to-br from-gray-50 to-gray-100 border-l p-6 overflow-y-auto">
              <h3 className="font-bold text-lg text-gray-900 mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Timeline
              </h3>
              <div className="space-y-4 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-300">
                {selectedIssue?.timeline.map((t, index) => (
                  <div key={t._id} className="relative pl-10">
                    <div
                      className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(
                        t.status
                      )} border-4 border-white shadow-md`}
                    >
                      {getStatusIcon(t.status)}
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`font-semibold text-sm px-2 py-1 rounded ${getStatusColor(
                            t.status
                          )}`}
                        >
                          {t.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        By: {t.by?.name || "System"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(t.date).toLocaleDateString()} at{" "}
                        {new Date(t.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
