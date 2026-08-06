import { scrollInto, renderTemplate } from "./utils.js";
import * as toast from "./toast.js";

const heroCta = [
    [".cta-booking", "booking"],
    [".cta-styles", "styles"],
];

heroCta.forEach(cta => {
    const [selector, targetId] = cta;
    document.querySelector(selector).addEventListener("click", () => scrollInto(targetId));
});

renderTemplate({
    containerSelector: ".barbers-grid",
    templateId: "barber-card-template",
    items: [
        { avatar: { src: "images/barber_1.webp" }, name: "Andre", role: "Head Barber", rating: "★★★★★", },
        { avatar: { src: "images/barber_2.webp" }, name: "Bima", role: "Spesialis Beard", rating: "★★★★★", },
        { avatar: { src: "images/barber_3.webp" }, name: "Candra", role: "Hair Care", rating: "★★★★☆", },
        { avatar: { src: "images/barber_4.webp" }, name: "Dimas", role: "Hair Coloring", rating: "★★★★★", },
    ],
});

renderTemplate({
    containerSelector: ".styles-grid",
    templateId: "style-card-template",
    items: [
        { photo: { src: "images/two_block_cut.webp" }, name: "Two Block Cut", },
        { photo: { src: "images/buzz_cut.webp" }, name: "Buzz Cut", },
        { photo: { src: "images/undercut.webp" }, name: "Undercut", },
        { photo: { src: "images/textured_crop.webp" }, name: "Textured Crop", },
        { photo: { src: "images/french_crop.webp" }, name: "French Crop", },
        { photo: { src: "images/comma_hair.webp" }, name: "Comma Hair", },
        { photo: { src: "images/slick_back.webp" }, name: "Slick Back", },
        { photo: { src: "images/mullet.webp" }, name: "Mullet", },
    ],
});

renderTemplate({
    containerSelector: ".services-grid",
    templateId: "service-card-template",
    items: [
        { card: { style: { backgroundImage: "url(images/haircut.webp)" }, }, name: "Haircut", price: "Rp120K", unit: "potong", },
        { card: { style: { backgroundImage: "url(images/creambath.webp)" }}, name: "Creambath", price: "Rp150K", unit: "sesi", },
        { card: { style: { backgroundImage: "url(images/coloring.webp)" }}, name: "Coloring", price: "Rp250K", unit: "warna", },
    ],
});

renderTemplate({
    containerSelector: ".booking-form",
    templateId: "form-group-template",
    items: [
        generateFieldData("full-name", "Nama Lengkap:", "text", "Masukkan nama Anda."),
        generateFieldData("whatsapp-number", "Nomor WhatsApp:", "tel", "Masukkan nomor WhatsApp aktif Anda."),
        generateFieldData("services", "Layanan:", "text", "Sebutkan layanan yang Anda inginkan."),
    ],
    index: 0,
});

function generateFieldData(id, label, type, placeholder) {
    return {
        label: { htmlFor: id, textContent: label },
        field: { type: type, id: id, name: id, placeholder: placeholder },
    };
}

const bookingForm = document.querySelector(".booking-form");
bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(bookingForm);
    const data = {
        fullName: (formData.get("full-name") ?? "").trim(),
        whatsappNumber: (formData.get("whatsapp-number") ?? "").replace(/[\s-]/g, ""),
        services: (formData.get("services") ?? "").trim(),
    };

    const validation = [
        [!data.fullName, "Nama lengkap harus diisi."],
        [data.fullName.length < 3, "Nama minimal 3 karakter."],
        [!data.whatsappNumber, "Nomor WhatsApp harus diisi."],
        [!/^(\+628|628|08)\d{9,11}$/.test(data.whatsappNumber), "Masukkan nomor WhatsApp yang valid."],
        [!data.services, "Silakan isi layanan yang diinginkan."],
    ];

    for (const [condition, errorFeedback] of validation) {
        if (condition) return toast.warning("Oops!", errorFeedback);
    }

    try {
        const result = await fakeFetch("/api/booking", {
            method: "POST",
            body: data,
        });

        toast.success(result.title, result.message);
        bookingForm.reset();
    } catch (error) {
        toast.error("Gagal", error instanceof TypeError ?
            "Periksa kembali koneksi internet Anda." :
            `Terjadi kesalahan (${error.message}).`);
    }
});

async function fakeFetch() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
        title: "Terkirim",
        message: "Booking diproses, kami akan menghubungi Anda via WhatsApp."
    }
}

const servicesGrid = document.querySelector(".services-grid");
servicesGrid.addEventListener("click", (e) => {
    const card = e.target.closest(`[data-bind="card"`);
    if(!card) return;
    
    const selectedService = card.querySelector(`[data-bind="name"]`).textContent;
    const servicesField = document.getElementById("services");
    servicesField.value += (servicesField.value.length === 0 ? "" : ", ")+ selectedService;
    servicesField.focus();

    scrollInto("booking");
});