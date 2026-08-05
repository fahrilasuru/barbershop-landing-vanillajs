import { createIcon } from "./utils.js";

let container = null;
let toastIcon = null;
let toastTitle = null;
let toastMessage = null;
let timer = null;

export function success(title, message) {
    show("green", "/images/success.svg", title, message, 5000);
}

export function error(title, message) {
    show("red", "/images/error.svg", title, message, 5000);
}

export function warning(title, message) {
    show("orange", "/images/warning.svg", title, message, 3000);
}

function show(color, icon, title, message, duration) {
    reset();
    initDOM();

    toastIcon.color = color;
    toastIcon.src = icon;

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    container.classList.add("show");

    timer = setTimeout(() => {
        reset();
    }, duration);
}

function reset() {
    if (!container) return;
    container.classList.remove("show");

    clearTimeout(timer);
    timer = null;
}

function initDOM() {
    if (container) return;

    injectCSS();

    container = document.createElement("div");
    container.className = "toast";

    toastIcon = createIcon();
    toastIcon.className = "toast-icon";
    toastIcon.size = "36px";
    
    toastTitle = document.createElement("p");
    toastTitle.className = "toast-title";
    
    toastMessage = document.createElement("p");
    toastMessage.className = "toast-message";

    const toastBody = document.createElement("div");
    toastBody.className = "toast-body";
    toastBody.appendChild(toastTitle);
    toastBody.appendChild(toastMessage);
    
    const close = document.createElement("button");
    close.textContent = "×";
    close.className = "toast-close";
    close.addEventListener("click", reset);

    container.appendChild(toastIcon.element);
    container.appendChild(toastBody);
    container.appendChild(close);

    document.body.appendChild(container);
}

function injectCSS() {
    const cssId = "toast-css";
    if (document.getElementById(cssId)) return;

    const link = document.createElement("link");
    link.id = cssId;
    link.rel = "stylesheet";
    link.href = "/css/toast.css";

    document.head.appendChild(link);
}