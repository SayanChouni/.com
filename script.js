document.addEventListener('DOMContentLoaded', function() {

    // Vanta.js Animated Background Initialization
    VANTA.GLOBE({
        el: "#hero",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x00bfff,      // --accent-color
        backgroundColor: 0xa192f // --bg-color
    });

    // UPDATED Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Move cursor logic
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" }); // Creates a trailing effect
    });

    // Cursor pointing effect logic
    const interactiveElements = document.querySelectorAll('a, button, .tab-btn, .project-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hover');
            cursorOutline.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hover');
            cursorOutline.classList.remove('hover');
        });
    });


    // Typing Effect Logic
    const typingElement = document.getElementById('typing-effect');
    const words = ["Web Apps", "Telegram Bots", "Automation", "Secure Systems"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentWord = words[wordIndex];
        const currentChars = currentWord.substring(0, charIndex);
        typingElement.textContent = currentChars;
        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(type, 150);
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(type, 100);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) { wordIndex = (wordIndex + 1) % words.length; }
            setTimeout(type, 1200);
        }
    }
    type();

    // Skills Tab Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const skillContents = document.querySelectorAll('.skill-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            skillContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const targetContent = document.getElementById(btn.dataset.tab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // 3D Tilt Effect Initialization
    VanillaTilt.init(document.querySelectorAll(".skill-card"), {
        max: 25,
        speed: 400,
        glare: true,
        "max-glare": 0.5
    });

    // Scroll Reveal Logic (remains the same)
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(element => {
        observer.observe(element);
    });

});

// Contact Form Submission to Telegram Logic (Corrected)
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = contactForm.querySelector('.submit-btn');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Stop default form submission

    // --- এই দুটি লাইন সম্ভবত আপনার কোডে মিসিং ছিল ---
    // ১. ফর্মের সব ইনপুট থেকে ডেটা সংগ্রহ করা
    const formData = new FormData(contactForm);
    // ২. সেই ডেটাগুলোকে একটি অবজেক্টে পরিণত করা
    const data = Object.fromEntries(formData.entries());
    // --------------------------------------------------

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';
    formStatus.innerHTML = ''; // Clear previous status

    fetch('/api/send-telegram', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // এখন 'data' ভ্যারিয়েবলটি এখানে সঠিকভাবে কাজ করবে
    })
    .then(response => response.json())
    .then(result => {
        if (result.status === 'success') {
            formStatus.textContent = result.message;
            formStatus.className = 'form-status success';
            contactForm.reset(); // Clear the form
        } else {
            formStatus.textContent = result.message;
            formStatus.className = 'form-status error';
        }
    })
    .catch(error => {
        formStatus.textContent = 'An error occurred. Please try again later.';
        formStatus.className = 'form-status error';
        console.error('Error:', error);
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Signal <i class="fas fa-paper-plane"></i>';
    });
});