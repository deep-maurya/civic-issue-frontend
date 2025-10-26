import { useQuery } from "@tanstack/react-query"
import { GetAllIssueResponse, Issue } from "./type"
import { getAllIssue, getIssueById } from "./api"

export const useGetAllIssues = () => {
    return useQuery<GetAllIssueResponse>({
      queryKey: ['getAllIssue'],
      queryFn: getAllIssue,
      refetchOnWindowFocus: true, 
    })
  }

export const useGetIssueById = (issue_id: string) => {
    return useQuery<Issue>({
      queryKey: ['getIssueById', issue_id],
      queryFn: () => getIssueById(issue_id) as Promise<Issue>,
      refetchOnWindowFocus: true, 
    })
  }
  
  