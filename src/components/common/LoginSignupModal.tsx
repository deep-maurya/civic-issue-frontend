"use client";

import React from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type LoginSignupModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const LoginSignupModal: React.FC<LoginSignupModalProps> = ({ open, onOpenChange }) => {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[90vw] text-center">
        <div className="flex flex-col items-center justify-center">
          <X className="w-12 h-12 text-red-500 rounded-full bg-red-200" />
          <DialogTitle className="text-xl font-bold mt-5">Login Required</DialogTitle>
          <DialogDescription className="text-sm text-gray-700">
            You need to be logged in to post an issue. Please log in or sign up to continue.
          </DialogDescription>
          <div className="flex flex-col mt-5 sm:flex-row gap-2 w-full">
            <Button variant="default" className="w-full sm:flex-1" onClick={() => onOpenChange(false)}>
                Cancel
            </Button>
            <Button variant="default" className="w-full sm:flex-1" onClick={() => router.push('/auth/login')}>
                Login
            </Button>
            <Button variant="outline" className="w-full sm:flex-1" onClick={() => router.push('/auth/signup')}>
                Sign Up
            </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginSignupModal;
