import React from 'react';
import Navbar from '@/components/PublicPages/Navbar';
import Footer from '@/components/PublicPages/Footer';
import { Shield, Eye, Lock, Database } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-foreground/70">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-foreground/60 mt-2">
            Last updated: January 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-8 space-y-8">
            
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="w-6 h-6 text-primary" />
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">QR Code Data</h3>
                  <p className="text-foreground/70">
                    When you create QR codes using our service, we temporarily process the content you provide (URLs, text, contact information, etc.) to generate the QR code. This data is processed locally in your browser and is not stored on our servers unless you explicitly save it.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Usage Analytics</h3>
                  <p className="text-foreground/70">
                    We may collect anonymous usage statistics to improve our service, including page views, feature usage, and error reports. This data does not include personal information.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Cookies</h3>
                  <p className="text-foreground/70">
                    We use essential cookies to maintain your preferences (like theme selection) and improve your experience. We do not use tracking cookies or third-party analytics.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary" />
                How We Use Your Information
              </h2>
              <ul className="space-y-2 text-foreground/70">
                <li>• Generate QR codes based on your input</li>
                <li>• Maintain your preferences and settings</li>
                <li>• Improve our service and user experience</li>
                <li>• Provide customer support when requested</li>
                <li>• Ensure the security and functionality of our service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-primary" />
                Data Storage and Security
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Local Processing</h3>
                  <p className="text-foreground/70">
                    QR code generation happens entirely in your browser. Your data is not sent to our servers unless you choose to save it.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Data Retention</h3>
                  <p className="text-foreground/70">
                    If you save QR codes, we store only the essential data needed to recreate them. You can delete your saved QR codes at any time.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Security Measures</h3>
                  <p className="text-foreground/70">
                    We implement appropriate security measures to protect your information, including encryption in transit and at rest.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Access and Control</h3>
                  <p className="text-foreground/70">
                    You have the right to access, update, or delete your saved QR codes at any time through our service.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Data Portability</h3>
                  <p className="text-foreground/70">
                    You can export your QR code data in standard formats for use with other services.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Contact Us</h3>
                  <p className="text-foreground/70">
                    If you have questions about your data or this privacy policy, please contact us at{' '}
                    <a href="mailto:privacy@oneqr.com" className="text-primary hover:underline">
                      privacy@oneqr.com
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
              <p className="text-foreground/70">
                We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-primary mb-2">Questions?</h3>
              <p className="text-foreground/70">
                If you have any questions about this privacy policy or our data practices, please don't hesitate to contact us at{' '}
                <a href="mailto:privacy@oneqr.com" className="text-primary hover:underline font-medium">
                  privacy@oneqr.com
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
