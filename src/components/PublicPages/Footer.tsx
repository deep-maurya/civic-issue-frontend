import { QrCode, Zap } from 'lucide-react';
import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className=" border-t border-border bg-background">
      <div className="p-5 border-t border-border text-center text-sm text-foreground/70">
            <p>&copy; 2025 OneQR. All rights reserved. Made with ❤️ for everyone.</p>
          </div>
      </footer>
    </>
  );
};

export default Footer;
