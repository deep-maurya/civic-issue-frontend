import React from 'react';
import Navbar from '@/components/PublicPages/Navbar';
import Footer from '@/components/PublicPages/Footer';
import { FileText, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-foreground/70">
            Please read these terms carefully before using our QR code generation service.
          </p>
          <p className="text-sm text-foreground/60 mt-2">
            Last updated: January 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-8 space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-primary" />
                Acceptance of Terms
              </h2>
              <p className="text-foreground/70">
                By accessing and using OneQR, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                Use License
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Permitted Use</h3>
                  <p className="text-foreground/70">
                    You may use OneQR to create QR codes for personal, educational, and commercial purposes. The service is provided free of charge for all users.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Restrictions</h3>
                  <ul className="space-y-2 text-foreground/70">
                    <li>• You may not use the service for illegal activities</li>
                    <li>• You may not attempt to reverse engineer or hack our service</li>
                    <li>• You may not use the service to create malicious QR codes</li>
                    <li>• You may not abuse or overload our servers</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-primary" />
                User Responsibilities
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Content Responsibility</h3>
                  <p className="text-foreground/70">
                    You are solely responsible for the content you encode in QR codes. We do not monitor or control the content of QR codes created using our service.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Compliance</h3>
                  <p className="text-foreground/70">
                    You must ensure that your use of QR codes complies with all applicable laws and regulations in your jurisdiction.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Accuracy</h3>
                  <p className="text-foreground/70">
                    You are responsible for ensuring the accuracy of the information encoded in your QR codes.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Uptime</h3>
                  <p className="text-foreground/70">
                We strive to maintain high service availability, but we do not guarantee uninterrupted access. The service may be temporarily unavailable due to maintenance, updates, or technical issues.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Modifications</h3>
                  <p className="text-foreground/70">
                    We reserve the right to modify, suspend, or discontinue the service at any time without notice.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-foreground/70">
                OneQR is provided "as is" without warranties of any kind. We shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Our Rights</h3>
                  <p className="text-foreground/70">
                    The OneQR service, including its design, functionality, and code, is protected by intellectual property laws.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Your Content</h3>
                  <p className="text-foreground/70">
                    You retain all rights to the content you encode in QR codes. We do not claim ownership of your content.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Privacy</h2>
              <p className="text-foreground/70">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
              <p className="text-foreground/70">
                We reserve the right to modify these terms at any time. We will notify users of significant changes by posting the updated terms on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-foreground/70">
                If you have any questions about these terms, please contact us at{' '}
                <a href="mailto:legal@oneqr.com" className="text-primary hover:underline">
                  legal@oneqr.com
                </a>
              </p>
            </section>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-primary mb-2">Questions?</h3>
              <p className="text-foreground/70">
                If you have any questions about these terms of service, please don't hesitate to contact us at{' '}
                <a href="mailto:legal@oneqr.com" className="text-primary hover:underline font-medium">
                  legal@oneqr.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
