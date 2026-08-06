export function scrollInto(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth" });
}

export function renderTemplate({ containerSelector, templateId, items, index }) {
    const container = document.querySelector(containerSelector);
    const template = document.getElementById(templateId);

    if (!container || !template) return;

    const fragment = document.createDocumentFragment();
    items.forEach(item => {
        fragment.appendChild(createClone(template, item));
    });

    if (index == null) {
        container.appendChild(fragment);
        return;
    }

    container.insertBefore(fragment, container.children[index] ?? null);
}

function createClone(template, data) {
    const clone = template.content.cloneNode(true);

    Object.entries(data).forEach(([key, value]) => {
        const target = clone.querySelector(`[data-bind="${key}"]`);
        if (!target) return;

        setValue(target, value);
    });

    return clone;
}

function setValue(target, data) {
    if (!isObject(data)) {
        target.textContent = data;
        return;
    }

    assign(target, data);
}

function isObject(value) {
    return value !== null &&
        typeof value === "object" &&
        !Array.isArray(value);
}

function assign(target, data) {
    if (!target) return;
    
    Object.entries(data).forEach(([key, value]) => {
        if (isObject(value)) {
            assign(target[key], value);
            return;
        }

        target[key] = value;
    });
}

export function createIcon() {
    const icon = document.createElement("span");
    const css = icon.style;
    
    css.display = "inline-block";
    css.backgroundColor = "currentColor";
    css.maskPosition = "center";
    css.maskRepeat = "no-repeat";
    css.maskSize = "contain";

    return {
        element: icon,

        set className(value) {
            icon.className = value;
        },

        set src(value) {
            css.maskImage = `url(${value})`;
        },

        set color(value) {
            css.backgroundColor = value;
        },

        set size(value) {
            css.width = value;
            css.height = value;
        },
    };
}
