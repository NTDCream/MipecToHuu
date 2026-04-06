document.addEventListener("DOMContentLoaded", () => {
    // 1. Navbar Scroll Effect
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. Mobile Menu Toggle (Basic implementation)
    const mobileMenuBtn = document.getElementById("mobile-menu");
    const navLinks = document.querySelector(".nav-links");

    // As we hid .nav-links on mobile via CSS, let's just make it a simple toggler if needed
    // For a real production site, we would build a full mobile slide-in menu.
    // Here we'll just toggle display for rapid prototype.
    mobileMenuBtn.addEventListener("click", () => {
        if (navLinks.style.display === "flex") {
            navLinks.style.display = "none";
        } else {
            navLinks.style.display = "flex";
            navLinks.style.flexDirection = "column";
            navLinks.style.position = "absolute";
            navLinks.style.top = "calc(100% + 15px)";
            navLinks.style.left = "0";
            navLinks.style.width = "100%";
            navLinks.style.backgroundColor = "rgba(255, 255, 255, 0.98)";
            navLinks.style.backdropFilter = "blur(10px)";
            navLinks.style.padding = "25px 30px";
            navLinks.style.borderRadius = "24px";
            navLinks.style.boxShadow = "0 15px 40px rgba(0,0,0,0.15)";
        }
    });

    // 3. Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Optional: only animate once
            }
        });
    }, observerOptions);

    // Select all elements to animate
    const elementsToAnimate = document.querySelectorAll('.animate-fade-up, .animate-fade-right, .animate-fade-left, .animate-scale');
    elementsToAnimate.forEach(el => observer.observe(el));

    // 4. Layout Infinity Slider
    const layoutSlider = document.querySelector('.layout-slider');
    if (layoutSlider) {
        const slides = Array.from(layoutSlider.children);
        // Clone slides for infinity effect (original + 2 sets = 3 sets)
        slides.forEach(slide => layoutSlider.appendChild(slide.cloneNode(true)));
        slides.forEach(slide => layoutSlider.appendChild(slide.cloneNode(true)));
        const dots = document.querySelectorAll('.slider-dots .dot');

        // Add Active Class for Center Mode styling and Update Dots
        const sliderObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Update dot
                    const index = entry.target.getAttribute('data-index');
                    if (index !== null && dots.length > 0) {
                        dots.forEach(d => d.classList.remove('active'));
                        const dot = document.querySelector(`.slider-dots .dot[data-index="${index}"]`);
                        if (dot) dot.classList.add('active');
                    }
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, {
            root: layoutSlider,
            threshold: 0.6
        });

        Array.from(layoutSlider.children).forEach(slide => sliderObserver.observe(slide));

        // Start in the middle set
        setTimeout(() => {
            const itemWidth = layoutSlider.children[0].offsetWidth + 20; // 20 = gap
            const centerOffset = (layoutSlider.clientWidth - itemWidth) / 2;
            layoutSlider.scrollLeft = itemWidth * 3 - centerOffset;
        }, 150);

        // Infinity Loop
        layoutSlider.addEventListener('scroll', () => {
             const maxScrollLeft = layoutSlider.scrollWidth - layoutSlider.clientWidth;
             const third = layoutSlider.scrollWidth / 3;
             if (layoutSlider.scrollLeft <= 0) {
                 layoutSlider.scrollLeft = third;
             } else if (Math.ceil(layoutSlider.scrollLeft) >= maxScrollLeft) {
                 layoutSlider.scrollLeft = third;
             }
        });

        // Arrow Buttons Logic
        const prevBtn = document.getElementById('slide-prev');
        const nextBtn = document.getElementById('slide-next');

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                const itemWidth = layoutSlider.children[0].offsetWidth + 20;
                layoutSlider.scrollBy({ left: -itemWidth, behavior: 'smooth' });
            });
            nextBtn.addEventListener('click', () => {
                const itemWidth = layoutSlider.children[0].offsetWidth + 20;
                layoutSlider.scrollBy({ left: itemWidth, behavior: 'smooth' });
            });
        }

        // Dot Navigation Logic
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.getAttribute('data-index'));
                const itemWidth = layoutSlider.children[0].offsetWidth + 20;
                const centerOffset = (layoutSlider.clientWidth - itemWidth) / 2;
                layoutSlider.scrollTo({ left: itemWidth * (index + 3) - centerOffset, behavior: 'smooth' });
            });
        });
    }

    // 5. Form Logic (2-steps and AppScript submission)
    const form = document.getElementById("register-form");
    const step1 = document.getElementById("step-1");
    const step2 = document.getElementById("step-2");
    const btnNext = document.getElementById("btn-next-step");
    const btnPrev = document.getElementById("btn-prev-step");
    const productRadios = document.querySelectorAll(".product-radio");
    const radioInputs = document.querySelectorAll("input[name='product']");
    const btnSubmit = document.getElementById("btn-submit-form");

    // Handle styling for radio selection
    productRadios.forEach((label, index) => {
        label.addEventListener("click", () => {
            productRadios.forEach(l => l.classList.remove("active"));
            label.classList.add("active");
            radioInputs[index].checked = true;
        });
    });

    btnNext.addEventListener("click", () => {
        const isSelected = Array.from(radioInputs).some(radio => radio.checked);
        if (!isSelected) {
            alert("Vui lòng chọn dòng sản phẩm anh/chị quan tâm!");
            return;
        }
        step1.style.display = "none";
        step2.style.display = "block";
    });

    btnPrev.addEventListener("click", () => {
        step2.style.display = "none";
        step1.style.display = "block";
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        btnSubmit.innerText = "ĐANG XỬ LÝ...";
        btnSubmit.disabled = true;

        const product = document.querySelector("input[name='product']:checked").value;
        const name = document.getElementById("entry-name").value;
        const phone = document.getElementById("entry-phone").value;
        const email = document.getElementById("entry-email").value;

        // IMPORTANT: Replace this URL with your published Web App URL
        const APPSCRIPT_URL = "https://script.google.com/macros/s/AKfycbz726a44FASEMsAFOV_WbPJWNchoQomfBCyxhzgmlygodD8SwKH6Wr6ZUqCVCZTu8_g7A/exec";

        // Create the form data payload
        let formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("product", product);

        // Fetch to Google Apps Script. 
        // We use text/plain and no-cors to avoid CORS issues for a simple one-way submit.
        fetch(APPSCRIPT_URL, {
            method: "POST",
            body: formData,
            mode: "no-cors"
        })
            .then(() => {
                alert("Cảm ơn anh/chị đã đăng ký! Chuyên viên Mipec sẽ liên hệ hỗ trợ trong ít phút nữa.");
                form.reset();
                productRadios.forEach(l => l.classList.remove("active"));
                step2.style.display = "none";
                step1.style.display = "block";
                btnSubmit.innerText = "HOÀN TẤT ĐĂNG KÝ";
                btnSubmit.disabled = false;
            })
            .catch((error) => {
                console.error("Lỗi:", error);
                alert("Đã có lỗi xảy ra, vui lòng thử lại sau.");
                btnSubmit.innerText = "HOÀN TẤT ĐĂNG KÝ";
                btnSubmit.disabled = false;
            });
    });

    // 5. Lightbox functionality for images
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".lightbox-close");

    // Select all standard images to enlarge
    const images = document.querySelectorAll("img:not(.zalo-btn img)");

    images.forEach(img => {
        img.addEventListener("click", function () {
            lightbox.style.display = "flex";
            lightboxImg.src = this.src;
        });
    });

    // Close when clicking the close button
    closeBtn.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    // Close when clicking outside the image
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === "Escape" && lightbox.style.display === "flex") {
            lightbox.style.display = "none";
        }
    });
});
