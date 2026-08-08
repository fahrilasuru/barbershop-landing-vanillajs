const headerSheet = new CSSStyleSheet();
headerSheet.replaceSync(`
    ::slotted(a) {
        width: 100%;
        padding-block: 6px;
        font-weight: 600;
        color: oklch(0.85 0 0);
        text-decoration: none;
        letter-spacing: 0.3px;
        text-align: center;
        transition: color 0.2s;
    }

    ::slotted(a:hover) {
        color: var(--gold);
    }

    .container {
        position: relative;
        justify-content: space-between;
        padding: 20px;
    }

    .navigation {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 50;
        gap: 2rem;
        flex-direction: column;
        width: 100%;
        padding-block: 1rem;
        border-top: 1px solid oklch(from var(--gold) l c h / 15%);
        border-radius: 0 0 20px 20px;
        background: var(--dark-grey);
        box-shadow: 0 12px 30px oklch(0 0 0 / 60%);
    }

    .backdrop,
    .navigation {
        display: none;
    }

    .backdrop.show,
    .navigation.show {
        display: flex;
    }

    .cta {
        font-size: 22px;
        color: var(--text-light);
    }

    @media(min-width: 768px) {
        ::slotted(a) {
            width: auto;
            padding: 0;
            text-align: start;
        }

        .container {
            justify-content: center;
            width: fit-content;
            margin: 2rem auto 0;
            padding-inline: 50px;
            border-radius: 20px;
        }

        .hamburger,
        .backdrop, .backdrop.show {
            display: none;
        }

        .navigation {
            position: initial;
            inset: initial;
            z-index: initial;
            display: flex;
            flex-direction: row;
            gap: 1rem;
            width: initial;
            padding: 0;
            border: initial;
            border-radius: initial;
            background: initial;
            box-shadow: initial;
        }

        .cta {
            padding: 10px 28px;
            background: var(--gold);
            font-size: 14px;
            color: oklch(0.15 0 0);
        }
    }
`);

const footerSheet = new CSSStyleSheet();
footerSheet.replaceSync(`
    ::slotted(a) {
        font-weight: 500;
        color: oklch(0.85 0 0);
        text-decoration: none;
        transition: color 0.2s;
    }

    ::slotted(a:hover) {
        color: var(--gold);
    }
`);

class NavigationBar extends HTMLElement {
    #isOpen = false;
    #ticking = false;
    #threshold = 50;
    #hiddenOffset = 0;
    #lastScroll = 0;
    #prefersReducedMotion;
    #resizeObserver;
    #scrollHandler = () => this.handleScroll();

    #backdrop;
    #navigation;
    #cta;

    constructor() {
        super();

        const container = document.createElement("header");
        container.className = "container";
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.gap = "2rem";
        container.style.maxWidth = "1200px";
        container.style.border = "1px solid oklch(from var(--gold) l c h / 20%)";
        container.style.backgroundColor = "var(--dark-grey)";
        
        const hamburger = document.createElement("button");
        hamburger.innerHTML = "&#9776";
        hamburger.className = "hamburger";
        hamburger.style.padding = "0";
        hamburger.style.border = "none";
        hamburger.style.background = "transparent";
        hamburger.style.fontSize = "2rem";
        hamburger.style.color = "inherit";
        hamburger.style.lineHeight = "1";
        hamburger.style.cursor = "pointer";
        hamburger.addEventListener("click", () => this.toggleLinks());

        this.#backdrop = document.createElement("div");
        this.#backdrop.className = "backdrop";
        this.#backdrop.style.position = "fixed";
        this.#backdrop.style.inset = "0";
        this.#backdrop.style.background = "oklch(0 0 0 / 70%)";
        this.#backdrop.addEventListener("click", () => this.toggleLinks());

        this.#navigation = document.createElement("nav");
        this.#navigation.className = "navigation";
        this.#navigation.style.alignItems = "center";

        const navigationLinks = document.createElement("slot");

        this.#cta = document.createElement("a");
        this.#cta.className = "cta";
        this.#cta.style.borderRadius = "15px";
        this.#cta.style.fontWeight = "700";
        this.#cta.style.textDecoration = "none";
        this.#cta.style.letterSpacing = "0.5px";

        this.#navigation.appendChild(navigationLinks);
        container.appendChild(hamburger);
        container.appendChild(this.#backdrop);
        container.appendChild(this.#navigation);
        container.appendChild(this.#cta);

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.adoptedStyleSheets = [headerSheet];
        shadowRoot.appendChild(container);
    }

    connectedCallback() {
        document.documentElement.style.setProperty("--navbar-visibility", "visible");
        this.style.position = "fixed";
        this.style.top = "0";
        this.style.left = "0";
        this.style.zIndex = "9999";
        this.style.width = "100%";
        this.style.transition = "transform 0.3s ease";

        this.updateHeight();
        this.#resizeObserver = new ResizeObserver(() => this.updateHeight());
        this.#resizeObserver.observe(this);

        window.addEventListener("scroll", this.#scrollHandler);
        this.#prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    discknnectedCallback() {
        this.#resizeObserver.disconnect();
        window.removeEventListener("scroll", this.#scrollHandler, { passive: true });
    }

    static get observedAttributes() {
        return ["cta-text", "cta-href"];
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (newValue === oldValue) return;

        switch (attr) {
            case "cta-text":
                this.#cta.textContent = newValue;
                break;

            case "cta-href":
                this.#cta.href = newValue;
                break;
        }
    }

    updateHeight() {
        const height = this.offsetHeight;
        document.documentElement.style.setProperty("--navbar-height", `${height}px`);
        
        this.#threshold = height;
    }

    handleScroll() {
        if (this.#ticking) return;

        requestAnimationFrame(() => this.toggleBar());
        this.#ticking = true;
    }

    toggleBar() {
        const currentScroll = Math.max(0, window.scrollY);
        const delta = currentScroll - this.#lastScroll;

        this.#hiddenOffset = currentScroll <= this.#threshold ? 0 : Math.min(this.#threshold, Math.max(0, this.#hiddenOffset + delta));
        if (this.#prefersReducedMotion) {
            this.style.transform = this.#hiddenOffset > this.#threshold ? "translateY(-100%)" : "translateY(0)";
        } else {
            this.style.transform = `translateY(-${this.#hiddenOffset}px)`
        }

        this.updateAccessibility();
        this.#lastScroll = currentScroll;
        this.#ticking = false;
    }

    updateAccessibility() {
        const isFullyHidden = this.#hiddenOffset >= this.#threshold;

        this.toggleAttribute("inert", isFullyHidden);
        if (isFullyHidden) {
            this.setAttribute("aria-hidden", "true");
        } else {
            this.removeAttribute("aria-hidden");
        }
    }

    toggleLinks() {
        this.#backdrop.classList.toggle("show");
        this.#navigation.classList.toggle("show");
    }
}

class BrandBlock extends HTMLElement {
    #copy;

    constructor() {
        super();

        const container = document.createElement("footer");
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.flexWrap = "wrap";
        container.style.justifyContent = "center";
        container.style.alignItems = "center";
        container.style.gap = "20px";
        container.style.marginTop = "50px";
        container.style.padding = "40px 0 28px";
        container.style.borderTop = "1px solid oklch(24 0.01 73 / 50%)";

        const socialLinks = document.createElement("div");
        socialLinks.style.display = "flex";
        socialLinks.style.gap = "24px";

        const socialSlot = document.createElement("slot");
        socialSlot.name = "social";

        socialLinks.appendChild(socialSlot);

        this.#copy = document.createElement("div");
        this.#copy.style.fontSize = "14px";
        this.#copy.style.color = "oklch(0.55 0.02 72)";

        container.appendChild(socialLinks);
        container.appendChild(this.#copy);

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.adoptedStyleSheets = [footerSheet];
        shadowRoot.appendChild(container);
    }

    static get observedAttributes() {
        return ["copyright"];
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if (newValue === oldValue) return;

        switch (attr) {
            case "copyright":
                this.#copy.textContent = newValue;
                break;
        }
    }
}

customElements.define("navigation-bar", NavigationBar);
customElements.define("brand-block", BrandBlock);