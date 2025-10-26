import api from '@/config/axios.config';
import { assignIssue, GetAllIssueResponse, ReportIssuePayload, ReportIssueResponse, updateStatus, upvoteIssue, upvoteResponse } from './type';

export const issueUpvote = async (upvoteIssue: upvoteIssue) => {
    try {
      const response = await api.post<upvoteResponse>(`/issues/${upvoteIssue.issue_id}/upvote`);
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const getAllIssue = async () => {
    try {
        const response = await api.get<GetAllIssueResponse>('/issues');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const changeStaus = async (update_status: updateStatus) => {
  try {
    const response = await api.post<upvoteResponse>(`/issues/${update_status.issue_id}/status`, {
      status : update_status.status
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const assignIssuetouser = async (assignIssue: assignIssue) => {
  try {
    const response = await api.post<upvoteResponse>(`/issues/${assignIssue.issue_id}/assign`, {
      workerId : assignIssue.user_id
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const reportIssue = async (payload: ReportIssuePayload): Promise<any> => {
  try {
    const formData = new FormData(); 
    formData.append('title', payload.issueType);
    formData.append('description', payload.description);
    formData.append('location', payload.address);
    if (payload.longitude !== null) {
      formData.append('longitude', payload.longitude.toString());
    }
    
    if (payload.latitude !== null) {
      formData.append('latitude', payload.latitude.toString());
    }
    if (payload.photo) {
      formData.append('images', payload.photo);
    }

    const response = await api.post<ReportIssueResponse>('/issues', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
    return response.data.data;
  } catch (error) {
    throw error;
  }
};