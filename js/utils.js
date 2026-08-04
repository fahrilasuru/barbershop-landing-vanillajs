function setValue(obj, data) {
    if (!Array.isArray(data)) {
        obj.innerHTML = data;
        return;
    }

    const [keyPath, value] = data;

    if (!Array.isArray(keyPath)) {
        obj[keyPath] = value;
        return;
    }

    const target = keyPath.slice(0, -1).reduce((currentTarget, currentKey) => currentTarget?.[currentKey], obj);
    if (!target) return;

    target[keyPath.at(-1)] = value;
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

export function renderTemplate({ containerSelector, templateId, items }) {
    const container = document.querySelector(containerSelector);
    const template = document.getElementById(templateId);

    if (!container | !template) return;

    const fragment = document.createDocumentFragment();
    items.forEach(item => {
        fragment.appendChild(createClone(template, item));
    });

    container.appendChild(fragment);
}