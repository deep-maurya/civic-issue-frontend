"use client";

import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { useGetAllIssues } from "@/features/issue/hooks.query";

export default function Page() {
  const { data: issues, isLoading, isFetched, refetch } = useGetAllIssues()
  
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable data={issues?.data} isLoading={isLoading} refetch={refetch} />
          </div>
        </div>
      </div>
    </>
  );
}
