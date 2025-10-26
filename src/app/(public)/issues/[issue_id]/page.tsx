"use client";

import React from "react";
import Navbar from "@/components/PublicPages/Navbar";
import Footer from "@/components/PublicPages/Footer";
import { useParams } from "next/navigation";
import { useGetIssueById } from "@/features/issue/hooks.query";
import { Loader2, MapPin, Calendar, User, ThumbsUp, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialShareGrid from "@/components/common/SocialShareGrid";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function IssueDetails() {
  const { issue_id } = useParams();
  const { data: issue, isLoading, error } = useGetIssueById(issue_id as string);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto py-10">
          <Skeleton height={40} width={300} className="mb-4" />
          <Skeleton count={5} />
          <div className="mt-6 flex gap-4">
            <Skeleton circle height={40} width={40} />
            <Skeleton circle height={40} width={40} />
            <Skeleton circle height={40} width={40} />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <img src="/undraw_taken_mshk.svg" alt="Not Found" className="w-80" />
          <h2 className="text-2xl font-bold">Issue Not Found</h2>
          <p className="text-gray-500">
            The issue you are looking for does not exist or has been removed.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Banner */}
      <div className="w-full h-80 overflow-hidden bg-black">
        <img
          src={issue.images?.[0] || "/placeholder.jpg"}
          alt={issue.title || "Issue Image"}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container max-w-6xl mx-auto py-10 px-4 grid lg:grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">{issue.title}</h1>
          <p className="text-lg text-foreground/80 leading-relaxed">{issue.description}</p>

          {/* Upvote Button */}
          <Button size="lg" variant="default" className="flex items-center gap-2 text-base">
            <ThumbsUp size={20} />
            Support This Issue
          </Button>

          {/* Upvotes */}
          {issue.upvotes?.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-4">
              {issue.upvotes.map((upvote) => (
                <div key={upvote._id} className="flex items-center gap-2">
                  <img
                    src={upvote.profilePicture || "/avatar.jpeg"}
                    alt={upvote.name || "Anonymous"}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="text-sm font-medium">{upvote.name || "Anonymous"}</span>
                </div>
              ))}
            </div>
          )}

          {/* Sharing */}
          <div className="flex flex-col gap-3 border-t pt-6 mt-10">
            <h2 className="text-lg font-semibold text-foreground">Rally Support for This Issue</h2>
            <p className="text-sm text-foreground/70 -mt-2">
              Share it with your circle and help bring attention where it’s needed most.
            </p>
            <SocialShareGrid
              platforms={["facebook", "twitter", "linkedin", "whatsapp"]}
              meta={{
                url: `https://civic-issue-frontend.vercel.app/issues/${issue._id}`,
                title: issue.title,
              }}
              showName={false}
            />
          </div>
        </div>

        {/* Right Column - Timeline */}
        <div className="bg-muted p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Timeline</h3>
          <div className="space-y-4 relative before:absolute before:left-4 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-300">
            {issue.timeline?.map((t) => (
              <div key={t.date} className="relative pl-10">
                <div
                  className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(
                    t.status
                  )} border-4 border-white shadow-md`}
                >
                  {getStatusIcon(t.status)}
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold text-sm px-2 py-1 rounded ${getStatusColor(t.status)}`}>
                      {t.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">By: {(t.by as any)?.name || "Anonymous"}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(t.date).toLocaleDateString()} at{" "}
                    {new Date(t.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
