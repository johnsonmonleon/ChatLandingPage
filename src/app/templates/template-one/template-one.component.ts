import { AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, Renderer2 } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GenesysService } from '../../services/genesys.service';

@Component({
  selector: 'app-template-one',
  standalone: true,
  imports: [],
  templateUrl: './template-one.component.html',
  styleUrl: './template-one.component.css'
})
export class TemplateOneComponent implements OnInit, AfterViewInit {
  genesysService = inject(GenesysService);
  renderer = inject(Renderer2);
  el = inject(ElementRef);
  titleService = inject(Title);

  chatBoxPosition: string = 'Default'; //  Default | Center  
  ngOnInit() {
    this.changeFavicon('../assets/template-one/favicon.ico');
    this.titleService.setTitle('Chat Landing Page - Template 1'); 

  }

  changeFavicon(icon: string) {
    const link: HTMLLinkElement = this.renderer.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = `assets/${icon}`;

    // Remove existing favicon if needed
    const existingIcon = document.querySelector("link[rel*='icon']");
    if (existingIcon) {
      this.renderer.removeChild(document.head, existingIcon);
    }

    // Append the new favicon
    this.renderer.appendChild(document.head, link);
  }

  ngAfterViewInit(): void {
    if (this.chatBoxPosition === 'Center') {
      setTimeout(() => {
        const found = this.updateIframeClasses(); // Initial class update
        if (!found) {
          const intervalId = setInterval(() => {
            const foundAgain = this.updateIframeClasses();
            if (foundAgain) {
              clearInterval(intervalId); // Stop the loop if the iframe is found and chat opened
            }
          }, 500); // Check every 500 milliseconds
  
          // Optional: Clear the interval after a certain timeout (e.g., 10 seconds)
          setTimeout(() => clearInterval(intervalId), 10000);
        }
      }, 100); // Adjust timeout as necessary
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if(this.chatBoxPosition == 'Center') {
      this.updateIframeClasses(); // Update classes on resize
    }
  }

  private updateIframeClasses(): boolean {
    const iframes: NodeListOf<HTMLElement> = document.querySelectorAll('.genesys-mxg-container-frame');
    console.log(`Found ${iframes.length} iframes`);
  
    if (iframes.length) {
      const iframeArray = Array.from(iframes);
      for (const iframe of iframeArray) {
        const screenWidth = window.innerWidth;
        console.log(`Detected screen width: ${screenWidth}`);
  
        if (screenWidth >= 992 || screenWidth >= 600) {
          this.addClasses(iframe);
          this.openChat(iframe); // Open chat if on large screen
          return true; // Indicate that the chat was opened
        } else {
          this.removeClasses(iframe);
        }
      }
    } else {
      console.log('Iframe not found, checking again...');
    }
  
    return false; // Indicate that no chat was opened
  }
  
  private openChat(iframe: HTMLElement): void {
    const chatWindow = iframe as HTMLIFrameElement; // Cast to HTMLIFrameElement
    if (chatWindow.contentWindow) {
      // Send a message to open the chat
      chatWindow.contentWindow.postMessage('open', '*');
      console.log('Opening chat box...');
    } else {
      console.error('Chat window not available');
    }
  }

  private addClasses(iframe: HTMLElement): void {
    this.renderer.addClass(iframe, 'position-fixed');
    this.renderer.addClass(iframe, 'top-50');
    this.renderer.addClass(iframe, 'start-50');
    this.renderer.addClass(iframe, 'translate-middle');
  }

  private removeClasses(iframe: HTMLElement): void {
    this.renderer.removeClass(iframe, 'position-fixed');
    this.renderer.removeClass(iframe, 'top-50');
    this.renderer.removeClass(iframe, 'start-50');
    this.renderer.removeClass(iframe, 'translate-middle');
  }
}
