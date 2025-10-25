import React from 'react';
import Navbar from '@/components/PublicPages/Navbar';
import Footer from '@/components/PublicPages/Footer';
import { AlertTriangle, Shield, Info, CheckCircle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full mb-6">
            <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Disclaimer</h1>
          <p className="text-lg text-foreground/70">
            Important information about the use of our QR code generation service.
          </p>
          <p className="text-sm text-foreground/60 mt-2">
            Last updated: January 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-background/50 backdrop-blur-sm border border-border/50 rounded-lg p-8 space-y-8">
            
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-orange-800 dark:text-orange-200 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Important Notice
              </h2>
              <p className="text-orange-700 dark:text-orange-300">
                Please read this disclaimer carefully before using OneQR. By using our service, you acknowledge that you have read, understood, and agree to be bound by this disclaimer.
              </p>
            </div>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Info className="w-6 h-6 text-primary" />
                Service Disclaimer
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">No Warranties</h3>
                  <p className="text-foreground/70">
                    OneQR is provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, regarding the service, including but not limited to the accuracy, reliability, or availability of the service.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Use at Your Own Risk</h3>
                  <p className="text-foreground/70">
                    Your use of the service is at your own risk. We shall not be liable for any damages, including but not limited to direct, indirect, incidental, special, or consequential damages.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary" />
                QR Code Content
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">User Responsibility</h3>
                  <p className="text-foreground/70">
                    You are solely responsible for the content you encode in QR codes. We do not monitor, review, or control the content of QR codes created using our service.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Content Accuracy</h3>
                  <p className="text-foreground/70">
                    We do not verify the accuracy, legality, or appropriateness of the content you encode in QR codes. It is your responsibility to ensure that your content is accurate and complies with applicable laws.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Malicious Content</h3>
                  <p className="text-foreground/70">
                    We do not endorse or support the creation of QR codes containing malicious, illegal, or harmful content. Users who create such content do so at their own risk and may be subject to legal action.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-primary" />
                Technical Limitations
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Service Availability</h3>
                  <p className="text-foreground/70">
                    We do not guarantee that the service will be available at all times. The service may be temporarily unavailable due to maintenance, updates, technical issues, or other factors beyond our control.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">QR Code Compatibility</h3>
                  <p className="text-foreground/70">
                    While we strive to generate QR codes that are compatible with standard QR code readers, we cannot guarantee compatibility with all devices or applications.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Data Loss</h3>
                  <p className="text-foreground/70">
                    We are not responsible for any data loss that may occur while using our service. We recommend keeping backups of important data.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
              <p className="text-foreground/70">
                Our service may integrate with or link to third-party services. We are not responsible for the content, privacy policies, or practices of these third-party services. Your use of third-party services is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Maximum Liability</h3>
                  <p className="text-foreground/70">
                    In no event shall OneQR, its officers, directors, employees, or agents be liable for any damages exceeding the amount paid by you for the service, or $100, whichever is greater.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Excluded Damages</h3>
                  <p className="text-foreground/70">
                    We shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
              <p className="text-foreground/70">
                You agree to indemnify and hold harmless OneQR and its affiliates from any claims, damages, or expenses arising from your use of the service or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
              <p className="text-foreground/70">
                This disclaimer shall be governed by and construed in accordance with applicable laws. Any disputes arising from this disclaimer shall be resolved in the appropriate courts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to Disclaimer</h2>
              <p className="text-foreground/70">
                We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting. Your continued use of the service constitutes acceptance of the modified disclaimer.
              </p>
            </section>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-primary mb-2">Questions?</h3>
              <p className="text-foreground/70">
                If you have any questions about this disclaimer, please contact us at{' '}
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
