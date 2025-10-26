import { useQuery } from "@tanstack/react-query"
import { GetAllIssueResponse } from "./type"
import { getAllIssue } from "./api"

export const useGetAllIssues = () => {
    return useQuery<GetAllIssueResponse>({
      queryKey: ['getAllIssue'],
      queryFn: getAllIssue,
      refetchOnWindowFocus: true, 
    })
  }
  
  