import { renderTemplate } from "./utils.js";

renderTemplate({
    containerSelector: ".barbers-grid",
    templateId: "barber-card-template",
    items: [
        { avatar: ["src", "images/barber_1.webp"], name: "Andre", role: "Head Barber", rating: "★★★★★", },
        { avatar: ["src", "images/barber_2.webp"], name: "Bima", role: "Spesialis Beard", rating: "★★★★★", },
        { avatar: ["src", "images/barber_3.webp"], name: "Candra", role: "Hair Care", rating: "★★★★☆", },
        { avatar: ["src", "images/barber_4.webp"], name: "Dimas", role: "Hair Coloring", rating: "★★★★★", },
    ],
});

renderTemplate({
    containerSelector: ".styles-grid",
    templateId: "style-card-template",
    items: [
        { photo: ["src", "images/two_block_cut.webp"], name: "Two Block Cut", },
        { photo: ["src", "images/buzz_cut.webp"], name: "Buzz Cut", },
        { photo: ["src", "images/undercut.webp"], name: "Undercut", },
        { photo: ["src", "images/textured_crop.webp"], name: "Textured Crop", },
        { photo: ["src", "images/french_crop.webp"], name: "French Crop", },
        { photo: ["src", "images/comma_hair.webp"], name: "Comma Hair", },
        { photo: ["src", "images/slick_back.webp"], name: "Slick Back", },
        { photo: ["src", "images/mullet.webp"], name: "Mullet", },
    ],
});

renderTemplate({
    containerSelector: ".services-grid",
    templateId: "service-card-template",
    items: [
        { card: [["style", "backgroundImage"], "url(images/haircut.webp)"], name: "Haircut", price: "Rp120K", unit: "potong", },
        { card: [["style", "backgroundImage"], "url(images/creambath.webp)"], name: "Creambath", price: "Rp150K", unit: "sesi", },
        { card: [["style", "backgroundImage"], "url(images/coloring.webp)"], name: "Coloring", price: "Rp250K", unit: "warna", },
    ],
});