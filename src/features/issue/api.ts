import api from '@/config/axios.config';
import { GetAllIssueResponse, upvoteIssue, upvoteResponse } from './type';

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
        return response.data.data;
    } catch (error) {
        throw error;
    }
}