import { renderTemplate } from "./utils.js";

renderTemplate({
    containerSelector: ".barber-grid",
    templateId: "barber-card-template",
    items: [
        { avatar: ["src", "images/barber_1.webp"], name: "Andre", role: "Head Barber", rating: "★★★★★" },
        { avatar: ["src", "images/barber_2.webp"], name: "Bima", role: "Spesialis Beard", rating: "★★★★★" },
        { avatar: ["src", "images/barber_3.webp"], name: "Candra", role: "Hair Care", rating: "★★★★☆" },
        { avatar: ["src", "images/barber_4.webp"], name: "Dimas", role: "Hair Coloring", rating: "★★★★★" },
    ],
});