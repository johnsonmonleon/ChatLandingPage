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
export class TemplateOneComponent implements OnInit {
  genesysService = inject(GenesysService);
  renderer = inject(Renderer2);
  el = inject(ElementRef);
  titleService = inject(Title);

  chatBoxPosition: string = 'Center'; //  Default | Center  
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

    if(this.chatBoxPosition == 'Center') {
      this.updateIframeClasses(); // Initial class update

      // SetInterval as a fallback
      const intervalId: ReturnType<typeof setInterval> = setInterval(() => {
        this.updateIframeClasses();
      }, 500); // Check every 500 milliseconds
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if(this.chatBoxPosition == 'Center') {
      this.updateIframeClasses(); // Update classes on resize
    }
  }

  private updateIframeClasses(): void {
    // Querying the document directly
    const iframes: NodeListOf<HTMLElement> = document.querySelectorAll('.genesys-mxg-container-frame');

    if (iframes.length) {
      iframes.forEach((iframe: HTMLElement) => {
        const screenWidth = window.innerWidth;

        // Add classes for large screens
        if (screenWidth >= 992) { // Large screens (≥ 992px)
          this.addClasses(iframe);
          this.openChat(iframe); // Open chat if on large screen
        } else if(screenWidth >= 600) {
          this.addClasses(iframe);
          this.openChat(iframe); // Open chat if on large screen
        } else {
          // Remove classes on medium and small screens
          this.removeClasses(iframe);
        }
      });
    } else {
      console.log('Iframe not found, checking again...'); // Log when not found
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

  private openChat(iframe: HTMLElement): void {
    const chatWindow = iframe as HTMLIFrameElement; // Cast to HTMLIFrameElement
    if (chatWindow.contentWindow) {
      chatWindow.contentWindow.postMessage('open', '*'); // Send a message to open the chat
      console.log('Opening chat box...');
    } else {
      console.error('Chat window not available');
    }
  }
}
