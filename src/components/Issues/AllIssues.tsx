"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { issueUpvote } from "@/features/issue/api";
import { useAuthSelector } from "@/features/auth/hooks.redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import IssueModal from "./IssueModal";

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

export default function AllIssues({
  issues,
  isLoading,
  isFetched,
  refetch,
}: {
  issues: Issue[];
  isLoading: boolean;
  isFetched: boolean;
  refetch: () => Promise<void>;
}) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upvoting, setIsUpvoting] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { isLoggedIn } = useAuthSelector();

  const openModal = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
    setShowLoginPrompt(false);
  };

  const handleUpvote = async (issueId: string) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    setIsUpvoting(true);
    try {
      await issueUpvote({ issue_id: issueId });
      await refetch();
      setIsUpvoting(false);
      setShowLoginPrompt(false);
    } catch (error) {
      console.error("Upvote failed", error);
      setIsUpvoting(false);
    }
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {isFetched
          ? issues.map((issue) => (
              <div
                key={issue._id}
                className="bg-background border border-border/50 rounded-xl hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 cursor-pointer"
              >
                <div
                  onClick={() => openModal(issue)}
                  className="w-full h-40 rounded-t-lg overflow-hidden mb-4 bg-gray-100 dark:bg-slate-700 flex items-center justify-center"
                >
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
                  <h3
                    onClick={() => openModal(issue)}
                    className="text-lg font-semibold mb-1 text-foreground group-hover:text-primary transition-colors line-clamp-2"
                  >
                    {issue.title}
                  </h3>

                  <p
                    onClick={() => openModal(issue)}
                    className="text-foreground/70 text-sm mb-3 line-clamp-3"
                  >
                    {issue.description}
                  </p>

                  <div
                    onClick={() => openModal(issue)}
                    className="flex items-center mb-3 space-x-2"
                  >
                    <img
                      src={"/avatar.jpeg"}
                      alt={issue?.reportedBy?.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-foreground/80">
                      {issue?.reportedBy?.name || "Anonymous"}
                    </span>
                  </div>

                  <div
                    onClick={() => openModal(issue)}
                    className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3"
                  >
                    <MapPin className="w-4 h-4 mr-1 text-primary" />
                    <span className="line-clamp-1">{issue.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            disabled={upvoting}
                            onClick={(e) => {
                              e.preventDefault();
                              handleUpvote(issue._id);
                            }}
                            className={`flex items-center space-x-1 px-2 py-1 rounded-md border ${
                              isLoggedIn
                                ? "bg-primary text-white border-primary"
                                : "bg-gray-200 text-gray-600 border-gray-300 cursor-not-allowed"
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{issue.upvotes?.length || 0}</span>
                          </Button>
                        </TooltipTrigger>
                        {!isLoggedIn && (
                          <TooltipContent
                            side="top"
                            className="bg-gray-900 text-white text-xs"
                          >
                            Login to upvote
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>

                    <div className="flex items-center space-x-1 text-xs">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          : Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-background border border-border/50 rounded-xl p-4 animate-pulse"
              >
                <Skeleton height={160} className="mb-4 rounded-lg" />
                <Skeleton height={20} width={`80%`} className="mb-2" />
                <Skeleton height={15} width={`90%`} className="mb-2" />
                <Skeleton height={15} width={`60%`} className="mb-4" />
                <div className="flex items-center space-x-2 mb-3">
                  <Skeleton circle height={24} width={24} />
                  <Skeleton height={15} width={`50%`} />
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <Skeleton height={15} width={`30%`} />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton height={30} width={`30%`} />
                  <Skeleton height={15} width={`20%`} />
                </div>
              </div>
            ))}
      </div>

      <IssueModal
        selectedIssue={selectedIssue}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        showLoginPrompt={showLoginPrompt}
        setShowLoginPrompt={setShowLoginPrompt}
      />
    </div>
  );
}
