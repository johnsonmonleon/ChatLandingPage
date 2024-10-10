import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

// Define a specific type for the Genesys function
interface GenesysFunction {
  (...args: any[]): void; // Function type that can accept any arguments
  q?: any[][]; // Store arguments
  t?: number;  // Timestamp
  c?: object;  // Configuration object
}

// Extend Window to include Genesys
declare global {
  interface Window {
    _genesysJs: string;
    [key: string]: any; // Allow any other keys on the Window interface
    Genesys?: GenesysFunction; // Make Genesys optional
  }
}

@Injectable({
  providedIn: 'root'
})
export class GenesysService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadGenesysScript();
    }
  }

  private loadGenesysScript() {
    (function (g: Window, e: string, n: string, es: object) {
      g['_genesysJs'] = e;

      // Initialize g[e] as a GenesysFunction if it doesn't already exist
      if (!g[e]) {
        g[e] = function (...args: any[]) {
          (g[e].q = g[e].q || []).push(args); // Access g[e] as GenesysFunction
        } as GenesysFunction;
      }

      // Use type assertion to ensure g[e] is treated as a GenesysFunction
      const genesysFunc = g[e] as GenesysFunction;

      genesysFunc.t = Date.now(); // Set timestamp
      genesysFunc.c = es;

      const ys = document.createElement('script');
      ys.async = true;
      ys.src = n;
      ys.charset = 'utf-8';
      document.head.appendChild(ys);
    })(window, 'Genesys', 'https://apps.apne2.pure.cloud/genesys-bootstrap/genesys.min.js', {
      environment: 'prod-apne2',
      deploymentId: 'e0677288-2ed0-4d47-8ab8-f3f25d6da4e5'
    });
  }
}
