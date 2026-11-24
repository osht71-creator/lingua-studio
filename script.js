// رقم واتساب الاستوديو (بدون + أو أصفار في البداية)
const WHATSAPP = "966558064627";

document.getElementById("year").textContent = new Date().getFullYear();
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wa = (msg) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;

// قائمة الجوال
const menuBtn = document.querySelector(".menu-btn");
const nav = document.querySelector(".nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});

// الظهور التدريجي
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("shown"); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// إمالة ثلاثية الأبعاد تتبع المؤشر
document.querySelectorAll("[data-tilt]").forEach((el) => {
  el.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse" || reduceMotion) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-py * 8}deg) rotateY(${px * 8}deg)`;
  });
  el.addEventListener("pointerleave", () => { el.style.transform = ""; });
});

// مكعب الكلمات: يدور وحده، ويمكن سحبه
const cube = document.getElementById("cube");
if (cube) {
  const scene = cube.parentElement;
  let rx = -18, ry = 30, dragging = false, lastX = 0, lastY = 0, idle = true;
  const render = () => { cube.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`; };
  (function spin() {
    if (idle && !reduceMotion) { ry += 0.3; rx = -18 + Math.sin(ry / 40) * 12; render(); }
    requestAnimationFrame(spin);
  })();
  scene.addEventListener("pointerdown", (e) => { dragging = true; idle = false; lastX = e.clientX; lastY = e.clientY; scene.setPointerCapture(e.pointerId); });
  scene.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    ry += (e.clientX - lastX) * 0.5; rx -= (e.clientY - lastY) * 0.5;
    rx = Math.max(-80, Math.min(80, rx)); lastX = e.clientX; lastY = e.clientY; render();
  });
  const stop = () => { dragging = false; setTimeout(() => (idle = true), 1500); };
  scene.addEventListener("pointerup", stop);
  scene.addEventListener("pointercancel", stop);
}

// بطاقة الترجمة التي تنقلب
document.querySelectorAll(".flip").forEach((f) => f.addEventListener("click", () => f.classList.toggle("flipped")));

// أزرار طلب الخدمة: رسالة واتساب جاهزة
document.querySelectorAll(".order").forEach((btn) => {
  btn.href = wa(`السلام عليكم، أرغب في خدمة «${btn.dataset.service}» من Lingua Studio. هل يمكن إرسال عرض سعر؟`);
});

// نموذج الطلب السريع: يفتح واتساب برسالة فيها التفاصيل
const form = document.getElementById("order-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const lines = [
      "السلام عليكم، طلب جديد من موقع Lingua Studio:",
      `الاسم: ${d.get("name")}`,
      `الخدمة: ${d.get("service")}`,
      `الاتجاه: ${d.get("dir")}`,
      d.get("size") ? `الحجم: ${d.get("size")}` : "",
      d.get("when") ? `الموعد: ${d.get("when")}` : "",
    ].filter(Boolean);
    window.open(wa(lines.join("\n")), "_blank", "noopener");
  });
}
