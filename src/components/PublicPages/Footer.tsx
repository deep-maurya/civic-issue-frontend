import { QrCode } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
                  <QrCode className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  OneQR
                </span>
              </Link>
              <p className="text-foreground/70 text-sm">
                Create professional QR codes instantly. Free, fast, and easy to use.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="text-foreground/70 hover:text-foreground transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <Link
                    href="/create-qr"
                    className="text-foreground/70 hover:text-foreground transition-colors"
                  >
                    Create QR Code
                  </Link>
                </li>
                <li>
                  <a
                    href="#use-cases"
                    className="text-foreground/70 hover:text-foreground transition-colors"
                  >
                    Use Cases
                  </a>
                </li>
              </ul>
            </div>


            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="text-foreground/70 hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-foreground/70 hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/disclaimer"
                    className="text-foreground/70 hover:text-foreground transition-colors"
                  >
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-foreground/70">
            <p>&copy; 2025 OneQR. All rights reserved. Made with ❤️ for everyone.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
