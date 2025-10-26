import { ApiResponse } from "@/types/api.type";

export type upvoteIssue = {
    issue_id: string
  };

  export type updateStatus = {
    issue_id: string,
    status : string
  }

  export type assignIssue = {
    issue_id: string,
    user_id : string
  }


  export interface Issue {
    _id: string
    title: string
    description: string
    location: {
      lat: number
      lng: number
    }
    images: string[]
    upvotes: number
    status: string
    timeline: {
      status: string
      by: string
      date: string
    }[]
    createdBy: {
      _id: string
      name: string
    }
    createdAt: string
    updatedAt: string
  }
  
export type GetAllIssueResponse = ApiResponse<Issue[]>
export type ReportIssuePayload = {
  issueType: string;
  description: string;
  address: string;
  photo?: File | null;
  latitude: Number | null,
  longitude:Number | null
};

export type ReportIssueResponse = {
  success: boolean;
  message: string;
  data: Issue;
};
  
export type upvoteResponse = ApiResponse<{status : String}>;