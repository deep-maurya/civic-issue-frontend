"use client";

import React, { useContext, useState } from "react";
import {
  AlertCircle,
  Camera,
  MapPin,
  ArrowRight,
  BarChart3,
  Zap,
  ChevronRight,
  CheckCircle,
  Bell,
  Shield,
  MessageSquare,
} from "lucide-react";

import Navbar from "@/components/PublicPages/Navbar";
import Footer from "@/components/PublicPages/Footer";
import ReportIssueModal from "@/components/ReportIssueModal";
import { Button } from "@/components/ui/button";
import IssuesMap from "@/components/IssuesMap";
import { useTheme } from "next-themes";
import { ThemeContext } from "@/context/ThemeContext";
import AllIssues from "@/components/Issues/AllIssues";
import { useAuthSelector } from "@/features/auth/hooks.redux";
import { useGetAllIssues } from "@/features/issue/hooks.query";

export interface CivicIssue {
  id: number;
  type:
    | "Garbage"
    | "Street Light"
    | "Water Leakage"
    | "Road"
    | "Drainage"
    | "Electricity"
    | "Parks"
    | "Transport"
    | "Health"
    | "User Location";
  status: "Reported" | "In Progress" | "Resolved" | "Current";
  lat: number;
  lng: number;
  description: string;
}

const civicIssues: CivicIssue[] = [
  {
    id: 1,
    type: "Garbage",
    status: "Reported",
    lat: 19.4778,
    lng: 72.8089,
    description: "Garbage dumped near Vasai Road railway station.",
  },
  {
    id: 2,
    type: "Street Light",
    status: "In Progress",
    lat: 19.4856,
    lng: 72.8156,
    description: "Streetlight not working on Virar West main road.",
  },
  {
    id: 3,
    type: "Water Leakage",
    status: "Resolved",
    lat: 19.4723,
    lng: 72.8023,
    description: "Pipeline leakage near Vasai fort area fixed.",
  },
  {
    id: 4,
    type: "Road",
    status: "Reported",
    lat: 19.4891,
    lng: 72.8212,
    description: "Potholes on Mumbai-Ahmedabad highway near Virar.",
  },
  {
    id: 5,
    type: "Drainage",
    status: "In Progress",
    lat: 19.4654,
    lng: 72.7891,
    description: "Blocked drainage causing waterlogging in Vasai East.",
  },
  {
    id: 6,
    type: "Electricity",
    status: "Reported",
    lat: 19.4923,
    lng: 72.8345,
    description: "Power outage in Virar East residential area.",
  },
  {
    id: 7,
    type: "Parks",
    status: "In Progress",
    lat: 19.4789,
    lng: 72.8123,
    description: "Maintenance required for Vasai public garden.",
  },
  {
    id: 8,
    type: "Transport",
    status: "Reported",
    lat: 19.4756,
    lng: 72.8067,
    description: "Bus stop shelter damaged near Vasai station.",
  },
  {
    id: 9,
    type: "Health",
    status: "Resolved",
    lat: 19.4812,
    lng: 72.8189,
    description: "Medical waste disposal issue resolved at Virar hospital.",
  },
  {
    id: 10,
    type: "Garbage",
    status: "In Progress",
    lat: 19.4678,
    lng: 72.7956,
    description: "Garbage collection irregular in Vasai West slums.",
  },
  {
    id: 11,
    type: "Road",
    status: "Reported",
    lat: 19.4945,
    lng: 72.8278,
    description: "Speed breaker missing near Virar school zone.",
  },
  {
    id: 12,
    type: "Street Light",
    status: "Reported",
    lat: 19.4634,
    lng: 72.7834,
    description: "Dark spot near Vasai fort entrance needs lighting.",
  },
  {
    id: 13,
    type: "Water Leakage",
    status: "In Progress",
    lat: 19.4867,
    lng: 72.8098,
    description: "Water pipeline burst near Virar market area.",
  },
  {
    id: 14,
    type: "Drainage",
    status: "Reported",
    lat: 19.4723,
    lng: 72.8012,
    description: "Sewage overflow in Vasai East residential colony.",
  },
  {
    id: 15,
    type: "Electricity",
    status: "In Progress",
    lat: 19.4898,
    lng: 72.8234,
    description: "Street light pole damaged in Virar West.",
  },
  {
    id: 16,
    type: "Parks",
    status: "Reported",
    lat: 19.4756,
    lng: 72.8145,
    description: "Playground equipment broken in Vasai children park.",
  },
  {
    id: 17,
    type: "Transport",
    status: "In Progress",
    lat: 19.4812,
    lng: 72.8167,
    description: "Auto-rickshaw stand encroachment on main road.",
  },
  {
    id: 18,
    type: "Health",
    status: "Reported",
    lat: 19.4689,
    lng: 72.7923,
    description: "Mosquito breeding in stagnant water near Vasai creek.",
  },
  {
    id: 19,
    type: "Garbage",
    status: "Resolved",
    lat: 19.4956,
    lng: 72.8298,
    description: "Garbage collection point cleaned in Virar North.",
  },
  {
    id: 20,
    type: "Road",
    status: "In Progress",
    lat: 19.4645,
    lng: 72.7876,
    description: "Road widening work in progress near Vasai station.",
  },
];

const CivicIssueLanding = () => {
  const { isLoggedIn } = useAuthSelector();
  const [isOpen, setIsOpen] = useState(false);
  const themeContext = useContext(ThemeContext);
  const features = [
    {
      icon: <Camera className="w-5 h-5" />,
      title: "Photo Evidence",
      description:
        "Upload photos to provide visual proof of the issue for faster resolution.",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Location Tracking",
      description:
        "Pinpoint exact locations with GPS integration for accurate reporting.",
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Status Updates",
      description:
        "Get real-time notifications about the progress of your reported issues.",
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Community Dashboard",
      description: "View analytics and trends of issues in your neighborhood.",
    },
  ];

  const useCases = [
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Infrastructure Issues",
      desc: "Report potholes, damaged roads, and broken sidewalks",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Street Lighting",
      desc: "Report non-functional or damaged street lights",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Public Safety",
      desc: "Report safety concerns and hazards in public areas",
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Sanitation",
      desc: "Report garbage collection issues and illegal dumping",
    },
  ];

  const steps = [
    {
      title: "Spot the Issue",
      desc: "Notice a problem in your community that needs attention",
      icon: <AlertCircle className="w-8 h-8" />,
    },
    {
      title: "Report Online",
      desc: "Fill out a quick form with details and upload photos",
      icon: <Camera className="w-8 h-8" />,
    },
    {
      title: "Track Progress",
      desc: "Monitor the status and receive updates until resolved",
      icon: <CheckCircle className="w-8 h-8" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8">
            <Zap className="w-4 h-4 mr-2" />
            Building Better Communities Together
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">Report Civic Issues </span>
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Instantly
            </span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Help improve your community by reporting local issues. From potholes
            to broken street lights - make your voice heard and track the
            resolution progress.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-gradient-to-br from-primary to-primary/70 hover:from-primary/90 hover:to-primary/80 text-primary-foreground px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center"
            >
              Report issue now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-10">
            <div className="text-center p-3 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50">
              <div className="text-xl md:text-2xl font-bold text-primary">
                2,547
              </div>
              <div className="text-xs text-foreground/70">Issues Reported</div>
            </div>
            <div className="text-center p-3 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50">
              <div className="text-xl md:text-2xl font-bold text-primary">
                1,893
              </div>
              <div className="text-xs text-foreground/70">Issues Resolved</div>
            </div>
            <div className="text-center p-3 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50">
              <div className="text-xl md:text-2xl font-bold text-primary">
                74%
              </div>
              <div className="text-xs text-foreground/70">Resolution Rate</div>
            </div>
            <div className="text-center p-3 bg-background/50 backdrop-blur-sm rounded-lg border border-border/50">
              <div className="text-xl md:text-2xl font-bold text-primary">
                5,234
              </div>
              <div className="text-xs text-foreground/70">Active Citizens</div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className=" max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto mb-16 pt-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Powerful Features for Citizens
          </h2>
          <p className="text-lg text-foreground/70">
            Everything you need to report, track, and resolve community issues
          </p>
        </div>

        {/* Map */}
        <div className="max-w-7xl mx-auto mb-10">
          <IssuesMap issues={civicIssues} theme={themeContext?.theme} />
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16 pt-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Recent Issues Reported by Community
          </h2>
          <p className="text-lg text-foreground/70">
            Stay informed with the latest concerns raised in your neighborhood
          </p>
        </div>


        {/* All Issues Cards - Full Width */}
        <div className=" w-full">
          <AllIssues />
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Powerful Features for Citizens
          </h2>
          <p className="text-lg text-foreground/70">
            Everything you need to report, track, and resolve community issues
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-foreground/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-accent/20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            What You Can Report
          </h2>
          <p className="text-lg text-foreground/70">
            From infrastructure to sanitation - report any civic issue that
            needs attention
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-background border border-border/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 text-center"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mx-auto mb-4">
                {useCase.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                {useCase.title}
              </h3>
              <p className="text-foreground/70 mb-4">{useCase.desc}</p>
              <button className="flex items-center text-primary font-medium justify-center mx-auto">
                Learn more
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section
        id="how-it-works"
        className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            How CivicReport Works
          </h2>
          <p className="text-lg text-foreground/70">
            Report and resolve civic issues in just three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                {step.title}
              </h3>
              <p className="text-foreground/70">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
            Join thousands of citizens already using CivicReport to improve
            their communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-background text-foreground px-6 py-3 rounded-lg text-base font-semibold hover:bg-accent transition-all duration-300 text-center"
            >
              Report an Issue
            </Button>
          </div>
        </div>
      </section>

      <ReportIssueModal open={isOpen} onOpenChange={setIsOpen} />
      <Footer />
    </div>
  );
};

export default CivicIssueLanding;
