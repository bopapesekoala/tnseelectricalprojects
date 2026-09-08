document.addEventListener('DOMContentLoaded', () => {
    // Select Core Elements
    const hamburger = document.getElementById('hamburger');
    const mainMenu = document.getElementById('nav-menu');
    const header = document.querySelector('.header');
    const htmlRoot = document.documentElement;
    
    // Find the icon inside the hamburger div
    const hamIcon = hamburger ? hamburger.querySelector('i') : null;

    /**
     * 1. THEME TOGGLE LOGIC
     * Persists user preference and updates UI icons
     */
    const savedTheme = localStorage.getItem('tnse-theme') || 'light';
    htmlRoot.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    window.toggleTheme = () => {
        const currentTheme = htmlRoot.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlRoot.setAttribute('data-theme', newTheme);
        localStorage.setItem('tnse-theme', newTheme);
        updateThemeIcon(newTheme);
    };

    function updateThemeIcon(theme) {
        const icon = document.querySelector('.btn-theme i');
        if (icon) {
            if (theme === 'dark') {
                icon.classList.replace('fa-sun', 'fa-moon');
            } else {
                icon.classList.replace('fa-moon', 'fa-sun');
            }
        }
    }

    /**
     * 2. MOBILE NAVIGATION (Main Menu)
     * Handles the opening/closing of the main mobile menu
     */
    if (hamburger && mainMenu) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            mainMenu.classList.toggle('active');
            
            if (mainMenu.classList.contains('active')) {
                if (hamIcon) hamIcon.classList.replace('fa-bars-staggered', 'fa-xmark');
                mainMenu.style.display = 'flex';
            } else {
                if (hamIcon) hamIcon.classList.replace('fa-xmark', 'fa-bars-staggered');
                mainMenu.style.display = '';
            }
        });
    }

    /**
     * 3. MEGA MENU HOVER (DESKTOP) & CLICK (MOBILE/TABLET) TOGGLE
     * Handles responsive text transitions (+ to -) cross-platform
     */
    const megaMenuItems = document.querySelectorAll('.mega-menu');
    
    megaMenuItems.forEach(item => {
        const triggerLink = item.querySelector('.mega-menu-trigger');
        const indicator = triggerLink ? triggerLink.querySelector('.arrow-indicator') : null;

        // A. DESKTOP HOVER MANAGEMENT (> 1120px)
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth > 1120 && indicator) {
                indicator.textContent = '−'; // Changes to minus on hover
            }
        });

        item.addEventListener('mouseleave', () => {
            if (window.innerWidth > 1120 && indicator) {
                indicator.textContent = '+'; // Restores to plus on mouse leave
            }
        });

        // B. MOBILE & TABLET CLICK ACCORDION MANAGEMENT (<= 1120px)
        if (triggerLink) {
            triggerLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 1120) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle current menu state
                    const isOpen = item.classList.toggle('open');
                    
                    // Update current text indicator
                    if (indicator) {
                        indicator.textContent = isOpen ? '−' : '+';
                    }
                    
                    // Close other open mega menus and reset indicators
                    megaMenuItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('open');
                            const otherIndicator = otherItem.querySelector('.arrow-indicator');
                            if (otherIndicator) otherIndicator.textContent = '+';
                        }
                    });
                }
            });
        }
    });

    /**
     * 4. STICKY HEADER SCROLL EFFECT
     */
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        }
    });

    /**
     * 5. ACTIVE LINK MANAGEMENT
     * Highlights the current page in the navigation
     */
    const currentUrl = window.location.href;
    const menuLinks = document.querySelectorAll('.menu-item > a');

    menuLinks.forEach(link => {
        link.classList.remove('active');
        if (link.href === currentUrl) {
            link.classList.add('active');
        }
    });

    /**
     * 6. CLICK OUTSIDE TO CLOSE
     * Closes menus if the user clicks away from the navigation area
     */
    document.addEventListener('click', (e) => {
        if (mainMenu && mainMenu.classList.contains('active')) {
            if (header && !header.contains(e.target)) {
                mainMenu.classList.remove('active');
                if (hamIcon) hamIcon.classList.replace('fa-xmark', 'fa-bars-staggered');
                mainMenu.style.display = '';
                
                // Also close any open mega menus and restore plus icons
                megaMenuItems.forEach(item => {
                    item.classList.remove('open');
                    const indicator = item.querySelector('.arrow-indicator');
                    if (indicator) indicator.textContent = '+';
                });
            }
        }
    });
});

/**
 * 7. BOTTOM DRAWERS & TRANSITIONAL REDIRECTS
 */
function toggleDrawer(id) {
    closeAllDrawers(); // Close any others first
    const drawer = document.getElementById(id);
    const overlay = document.getElementById('drawer-overlay');
    
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.style.display = 'block';
}

function closeAllDrawers() {
    document.querySelectorAll('.bottom-drawer').forEach(d => d.classList.remove('open'));
    const overlay = document.getElementById('drawer-overlay');
    if (overlay) overlay.style.display = 'none';
}

function handleRedirect(button, url) {
    // Find the elements within the specific drawer that was clicked
    const drawerContent = button.closest('.drawer-content');
    if (!drawerContent) return;

    const img = drawerContent.querySelector('.drawer-illus');
    const textBox = drawerContent.querySelector('.drawer-text-box');
    
    // 1. Start the Goodbye transition
    if (img) img.style.opacity = '0';
    if (textBox) textBox.style.opacity = '0';
    
    setTimeout(() => {
        // 2. Switch to Goodbye Illustration
        if (img) {
            img.src = 'https://res.cloudinary.com/dulmfdigk/image/upload/v1776334030/undraw_goodbye_mkv7_ewwgxr.png';
            img.style.opacity = '1';
        }
        
        // 3. Update the text
        if (textBox) {
            textBox.innerHTML = `
                <h3>See You Soon!</h3>
                <p>We are preparing your departure. Redirecting shortly...</p>
            `;
            textBox.style.opacity = '1';
        }
        
        // 4. Final redirect after the user sees the goodbye
        setTimeout(() => {
            window.location.href = url;
        }, 1800);
        
    }, 400);
}










/**
 * TNSE Electrical Projects - Cookie Consent Engine
 * Handles user privacy preference validation and persistent state tracking.
 */

document.addEventListener("DOMContentLoaded", function () {
    // Initialization: Check if user has already interacted with the consent form
    initCookieConsent();
});

/**
 * Validates storage states and displays the banner if consent is missing.
 */
function initCookieConsent() {
    const banner = document.getElementById("cookieConsentBanner");
    
    // Safety check if the element exists on the current page context
    if (!banner) return;

    // Check if consent tracking key exists in secure local storage
    const hasConsented = localStorage.getItem("tnse_cookie_consent");

    if (!hasConsented) {
        // Subtle 1.5-second timeout delay before displaying for better UX presentation
        setTimeout(() => {
            banner.classList.add("show");
        }, 1500);
    }
}

/**
 * Extracts checked parameters, maps user selections, and commits preferences to storage.
 * Triggered inline via the onclick attribute inside the HTML button layout node.
 */
function acceptCookieConsent() {
    const banner = document.getElementById("cookieConsentBanner");
    if (!banner) return;

    // Read states of customizable analytical data matrix preferences
    const analyticsApproved = document.getElementById("cookie-analytics") ? document.getElementById("cookie-analytics").checked : false;
    
    // System tools and interface choices are implicitly true as they are required core parameters
    const userPreferences = {
        consentGranted: true,
        timestamp: new Date().toISOString(),
        preferences: {
            systemTools: true, // Crucial for calculators
            interfaceSettings: true, // Crucial for Dark/Light theme preservation
            performanceAnalytics: analyticsApproved
        }
    };

    // Commit preferences object string to persistent client browser storage
    localStorage.setItem("tnse_cookie_consent", JSON.stringify(userPreferences));

    // Instantly hide the component canvas viewport wrapper
    banner.classList.remove("show");
}












/**
 * TNSE Electrical Projects - Combined Logic Master Homepage
 */
document.addEventListener("DOMContentLoaded", () => {

    // --- 1. MOBILE NAVIGATION ---
    const mobileBtn = document.getElementById("hamburger-icon");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuIcon = document.querySelector("#hamburger-icon i");

    if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener("click", (e) => {
            e.preventDefault();
            mobileMenu.classList.toggle("hidden");
            if (!mobileMenu.classList.contains("hidden")) {
                if (mobileMenuIcon) mobileMenuIcon.classList.replace("fa-bars", "fa-xmark");
                document.body.style.overflow = "hidden";
            } else {
                if (mobileMenuIcon) mobileMenuIcon.classList.replace("fa-xmark", "fa-bars");
                document.body.style.overflow = "auto";
            }
        });
    }

    // --- 2. HERO CAROUSEL ---
    const heroImages = [
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746687435/IMG-20250320-WA0014_trwryj.jpg',
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746687436/IMG-20250320-WA0016_zgeled.jpg',
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746687315/IMG-20250320-WA0002_uftswb.jpg',
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746687316/IMG-20250320-WA0004_iquig1.jpg',
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746687316/IMG-20250320-WA0005_sbi8sd.jpg',
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746687316/IMG-20250320-WA0006_wmylvs.jpg',
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746687317/IMG-20250320-WA0007_exoqbm.jpg',
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746687391/IMG-20250320-WA0008_tqcgec.jpg',
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746687393/IMG-20250320-WA0010_d0mnng.jpg',
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746687393/IMG-20250320-WA0009_oza3j3.jpg',
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746687432/IMG-20250320-WA0012_ambrj5.jpg',
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746696756/IMG-20250320-WA0003_sccxdh.jpg',
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746696756/IMG-20250320-WA0011_eorjao.jpg',
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746696756/IMG-20250320-WA0013_slt8gx.jpg',
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746687503/IMG-20250320-WA0020_q2ebb4.jpg',
        'https://res.cloudinary.com/dulmfdigk/image/upload/v1746696780/IMG-20250320-WA0021_rqvdcj.jpg'
    ];

    function createHeroCarousel() {
        const carouselContainer = document.querySelector('.hero-carousel-container');
        if (!carouselContainer) return;

        const shuffledImages = [...heroImages].sort(() => 0.5 - Math.random());
        
        shuffledImages.slice(0, 5).forEach((url, index) => {
            const item = document.createElement('img');
            item.src = url.replace('/upload/', '/upload/w_1600,h_900,c_fill,q_auto:good,f_auto/');
            item.className = `carousel-image ${index === 0 ? 'active' : ''}`;
            item.alt = `TNSE Background ${index + 1}`;
            carouselContainer.appendChild(item);
        });

        const images = carouselContainer.querySelectorAll('.carousel-image');
        let currentImageIndex = 0;
        
        if (images.length > 0) {
            setInterval(() => {
                images[currentImageIndex].classList.remove('active');
                currentImageIndex = (currentImageIndex + 1) % images.length;
                images[currentImageIndex].classList.add('active');
            }, 7000); 
        }
    }
    createHeroCarousel();

    // --- 3. TYPED.JS ---
    if (document.querySelector('#typed') && typeof Typed !== 'undefined') {
        new Typed('#typed', {
            strings: [
                "Specializing in high-efficiency electrical installations.",
                "Your partner for sustainable solar power solutions.",
                "Safety-focused residential wiring and repairs.",
                "Expert fault finding and electrical maintenance.",
                "Powering South African homes and businesses."
            ],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true
        });
    }

    // --- 4. ACCORDION (FIXED SELECTORS) ---
    document.querySelectorAll('.accordion-header').forEach(button => {
        button.addEventListener('click', () => {
            const accordionItem = button.parentElement;
            
            document.querySelectorAll('.accordion-item').forEach(item => {
                if (item !== accordionItem) {
                    item.classList.remove('active');
                }
            });
            if (accordionItem) accordionItem.classList.toggle('active');
        });
    });

    // --- 5. SCROLL TO TOP ---
    const scrollBtn = document.getElementById("scrollTopBtn");
    window.addEventListener('scroll', () => {
        if (scrollBtn) {
            if (window.scrollY > 100) {
                scrollBtn.style.display = "block";
            } else {
                scrollBtn.style.display = "none";
            }
        }
    });

    if (scrollBtn) {
        scrollBtn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
    }

    // --- 6. VALUES ACCORDION ---
document.addEventListener('DOMContentLoaded', () => {
  const valuesData = [
    { title: "Integrity", description: "Operates with honesty and transparency in every project phase." },
    { title: "Quality & Precision", description: "Delivers superior solutions through meticulous detail and high standards." },
    { title: "Safety First", description: "Prioritizes the well-being of the team, clients, and community." },
    { title: "Customer Empowerment", description: "Dedicated to fulfilling client needs for lasting peace of mind." },
    { title: "Teamwork & Dedication", description: "Fosters a collaborative environment inspired by the founders' vision." },
    { title: "Community Investment", description: "Committed to community well-being through responsible services." }
  ];

  const container = document.getElementById('acc-container');
  if (!container) return;

  // Render items with accessibility attributes and dynamic height transition styling
  container.innerHTML = valuesData.map((item, index) => `
    <div class="acc-item py-3">
      <button 
        type="button" 
        class="acc-header w-full flex justify-between items-center cursor-pointer font-semibold text-slate-800 hover:text-amber-600 transition-colors text-left focus:outline-none" 
        aria-expanded="false" 
        aria-controls="acc-content-${index}" 
        id="acc-header-${index}"
      >
        <h3 class="text-base pointer-events-none">${item.title}</h3>
        <span class="icon text-lg font-bold text-slate-400 pointer-events-none transition-transform duration-200">+</span>
      </button>
      <div 
        id="acc-content-${index}" 
        role="region" 
        aria-labelledby="acc-header-${index}" 
        class="acc-content overflow-hidden max-h-0 transition-[max-height] duration-300 ease-in-out text-sm text-slate-600"
      >
        <p class="pt-2">${item.description}</p>
      </div>
    </div>
  `).join('');

  // Attach click listener for toggling items smoothly
  const headers = container.querySelectorAll('.acc-header');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.icon');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Close all accordion items
      headers.forEach(otherHeader => {
        const otherContent = otherHeader.nextElementSibling;
        const otherIcon = otherHeader.querySelector('.icon');

        otherHeader.setAttribute('aria-expanded', 'false');
        if (otherIcon) otherIcon.textContent = '+';
        if (otherContent) otherContent.style.maxHeight = null;
      });

      // Open selected item if it was previously closed
      if (!isExpanded) {
        header.setAttribute('aria-expanded', 'true');
        if (icon) icon.textContent = '−';
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
});
    // --- 7. BRAND SLIDER ---
    const initBrandSlider = () => {
        const logoTrack = document.querySelector('.logo-track');
        if (!logoTrack) return;

        const logos = logoTrack.innerHTML;
        logoTrack.innerHTML += logos; 

        logoTrack.addEventListener('mouseenter', () => {
            logoTrack.style.animationPlayState = 'paused';
        });
        logoTrack.addEventListener('mouseleave', () => {
            logoTrack.style.animationPlayState = 'running';
        });
        logoTrack.addEventListener('touchstart', () => {
            logoTrack.style.animationPlayState = 'paused';
        }, { passive: true });
        logoTrack.addEventListener('touchend', () => {
            setTimeout(() => {
                logoTrack.style.animationPlayState = 'running';
            }, 1000);
        }, { passive: true });
    };
    initBrandSlider();

    // --- 8. FAQ DATA & ENGINE ---
const faqData = [
  { question: "What’s the difference between a three-pronged plug and a two-pronged plug?", answer: "The third prong is a grounding prong. It provides additional protection for the electrical system and prevents electrical shock." },
  { question: "Why do my circuit breakers keep tripping?", answer: "A breaker trips when too much power is being used on the circuit (overload), or if there’s a wiring problem (short circuit) or faulty appliance." },
  { question: "What is a GFCI and what does it do?", answer: "GFCI (Ground Fault Circuit Interrupter) is an outlet with “test” and “reset” buttons. It shuts off the circuit if it detects current imbalance, preventing shocks." },
  { question: "Should I do my own electrical wiring?", answer: "No. In South Africa it’s illegal for unqualified persons to do domestic wiring. It’s a safety risk and violates building codes and insurance." },
  { question: "How often should I have my electrical system inspected?", answer: "A full inspection is recommended every 10 years, or every 5 years for rental properties." },
  { question: "What should I do if an appliance keeps blowing a fuse?", answer: "Unplug it. If it’s the only device, the appliance may be faulty. If others also trip the fuse, the circuit is likely overloaded." },
  { question: "Why won’t my circuit breaker reset?", answer: "It could signal a wiring fault or short circuit. Call a qualified electrician immediately." },
  { question: "What is the benefit of whole-house surge protection?", answer: "It protects all appliances and electronics from surges caused by lightning or grid overloads." },
  { question: "What’s the difference between a blown fuse and a tripped breaker?", answer: "A blown fuse must be replaced. A breaker can simply be reset once the problem is fixed." },
  { question: "Is it safe to use an extension cord in the rain?", answer: "No. Moisture makes outdoor cords unsafe, raising risks of fire and electric shock." }
];

const initFaqAccordion = () => {
  const faqContainer = document.getElementById('faqAccordion');
  if (!faqContainer) return;

  faqContainer.innerHTML = ''; 

  // Render Dark Card-style Accordion Items
  faqData.forEach((item, index) => {
    const faqItem = document.createElement('div');
    faqItem.className = 'faq-item bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-slate-700 shadow-sm';
    faqItem.style.transitionDelay = `${index * 0.05}s`;

    faqItem.innerHTML = `
      <button 
        type="button" 
        class="faq-question w-full flex justify-between items-center text-left text-slate-100 hover:text-amber-400 font-semibold p-5 focus:outline-none transition-colors duration-200" 
        aria-expanded="false" 
        aria-controls="faq-ans-${index}" 
        id="faq-btn-${index}"
      >
        <span class="flex items-center gap-3 pointer-events-none text-base sm:text-lg">
          <i class="fas fa-question-circle text-amber-400 text-lg shrink-0"></i>
          <span>${item.question}</span>
        </span>
        <i class="fas fa-chevron-down text-slate-400 transform transition-transform duration-300 pointer-events-none text-sm shrink-0 ml-4"></i>
      </button>
      <div 
        id="faq-ans-${index}" 
        role="region" 
        aria-labelledby="faq-btn-${index}" 
        class="faq-answer overflow-hidden max-h-0 transition-[max-height] duration-300 ease-in-out text-slate-300"
      >
        <p class="px-5 pb-5 pt-0 leading-relaxed text-sm sm:text-base text-slate-400 border-t border-slate-800/50 mt-1 pt-4">
          ${item.answer}
        </p>
      </div>
    `;
    faqContainer.appendChild(faqItem);
  });

  // Toggle logic with smooth max-height dynamic calculation
  const questions = faqContainer.querySelectorAll('.faq-question');

  questions.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.fa-chevron-down');
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Close all active accordions
      questions.forEach(otherHeader => {
        const otherContent = otherHeader.nextElementSibling;
        const otherIcon = otherHeader.querySelector('.fa-chevron-down');

        otherHeader.setAttribute('aria-expanded', 'false');
        if (otherIcon) otherIcon.classList.remove('rotate-180', 'text-amber-400');
        if (otherContent) otherContent.style.maxHeight = null;
      });

      // Expand clicked accordion item if previously closed
      if (!isExpanded) {
        header.setAttribute('aria-expanded', 'true');
        if (icon) icon.classList.add('rotate-180', 'text-amber-400');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', initFaqAccordion);

    // --- 9. PARALLAX MAPS ---
    const initParallax = () => {
        const parallaxMap = {
            'bg2': 'https://res.cloudinary.com/dulmfdigk/image/upload/v1746687435/IMG-20250320-WA0014_trwryj.jpg',
            'bg7': 'https://res.cloudinary.com/dulmfdigk/image/upload/v1746687316/IMG-20250320-WA0006_wmylvs.jpg'
        };

        const parallaxSections = document.querySelectorAll('[data-parallax-img]');
        parallaxSections.forEach(section => {
            const imgKey = section.getAttribute('data-parallax-img');
            if (parallaxMap[imgKey]) section.style.backgroundImage = `url('${parallaxMap[imgKey]}')`;
        });

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxSections.forEach(section => {
                const limit = section.offsetTop + section.offsetHeight;
                if (scrolled > section.offsetTop - window.innerHeight && scrolled <= limit) {
                    const yPos = (scrolled - section.offsetTop) * 0.3;
                    section.style.backgroundPositionY = `${yPos}px`;
                }
            });
        }, { passive: true });
    };
    initParallax();

    // --- 10. TESTIMONIALS CAROUSEL ---
    const testimonials = [
        { quote: "TNSE installed our complete solar system. The process was seamless, the team was professional, and the after-sales support has been excellent. Highly recommend!", author: "Michael D." },
        { quote: "The best electricians in Polokwane. They quickly solved a complex industrial fault that other companies couldn't fix. Fast, reliable, and certified.", author: "Palesa M." },
        { quote: "Reliable service and quality work. Our residential rewiring was done efficiently, and they left the site spotless. True professionals!", author: "Themba N." },
        { quote: "Absolutely perfect Gentlemen, as well as trusted Experts. They left us feeling safer in our own home, and completely satisfied!!!", author: "Satisfied Client" },
        { quote: "Great experience from start to finish... The guys were very professional, friendly and knowledgeable. They had me up and running again.", author: "Satisfied Client" },
        { quote: "They go above and beyond the call of duty, never leaving until everything is done. They take extra time to make sure everything is completed properly.", author: "Satisfied Client" }
    ];

    const carouselTrack = document.getElementById('testimonialCarousel');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    
    let testimonialIndex = 0;
    let autoSlideInterval;
    const slideDuration = 8000;

    if (carouselTrack) {
        function initTestimonials() {
            carouselTrack.innerHTML = '';
            testimonials.forEach(t => {
                const slide = document.createElement('div');
                slide.className = 'testimonial-item';
                slide.innerHTML = `
                    <blockquote>"${t.quote}"</blockquote>
                    <p><strong>— ${t.author}</strong></p>
                `;
                carouselTrack.appendChild(slide);
            });
        }

        function updateSlide() {
            const offset = -testimonialIndex * 100;
            carouselTrack.style.transform = `translateX(${offset}%)`;
        }

        function moveToNext() {
            testimonialIndex = (testimonialIndex + 1) % testimonials.length;
            updateSlide();
        }

        function moveToPrev() {
            testimonialIndex = (testimonialIndex - 1 + testimonials.length) % testimonials.length;
            updateSlide();
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(moveToNext, slideDuration);
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoSlide();
                moveToNext();
                startAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoSlide();
                moveToPrev();
                startAutoSlide();
            });
        }

        carouselTrack.addEventListener('mouseenter', stopAutoSlide);
        carouselTrack.addEventListener('mouseleave', startAutoSlide);

        initTestimonials();
        startAutoSlide();
    }

    // --- 11. UNIFIED INTAKE & CONSULTATION FORM ENGINE ---
    if (typeof emailjs !== 'undefined') {
        emailjs.init("HI-2z2lZwVsmFNM8Q");
    }

    const consultationForm = document.getElementById("consultationForm");
    const consultSuccessMsgDiv = document.getElementById("successMsg") || (consultationForm ? consultationForm.querySelector('.success') : null);

    if (consultationForm) {
        const submitBtn = consultationForm.querySelector('button[type="submit"]');
        const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';

        consultationForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> E sa romela (Sending...)';
            }
            
            if (consultSuccessMsgDiv) {
                consultSuccessMsgDiv.style.display = "none";
                consultSuccessMsgDiv.className = "success"; 
                consultSuccessMsgDiv.innerHTML = "";
            }

            // Maps cleanly to your updated form architecture parameters
            const templateParams = {
                name: consultationForm.name.value,
                surname: consultationForm.surname.value,
                cellphone: consultationForm.cellphone.value,
                email: consultationForm.email.value,
                service_required: consultationForm.service_required.options[consultationForm.service_required.selectedIndex].text,
                message: consultationForm.message.value
            };

            if (typeof emailjs !== 'undefined') {
                emailjs.send("service_enjuc37", "template_4feisy6", templateParams)
                    .then(function () {
                        if (consultSuccessMsgDiv) {
                            consultSuccessMsgDiv.className = "success alert-message-style";
                            consultSuccessMsgDiv.style.color = "#2ecc71"; 
                            consultSuccessMsgDiv.innerHTML = '<i class="fas fa-check-circle"></i> Molaetša o rometšwe ka katlego! Thank you, your consultation request has been sent successfully.';
                            consultSuccessMsgDiv.style.display = "block";
                        }
                        consultationForm.reset();
                    }, function (error) {
                        console.error("EmailJS Execution Error Details:", error);
                        if (consultSuccessMsgDiv) {
                            consultSuccessMsgDiv.className = "error alert-message-style";
                            consultSuccessMsgDiv.style.color = "#e74c3c"; 
                            consultSuccessMsgDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Go na le phoso. Failed to send message. Please try again or contact us directly.';
                            consultSuccessMsgDiv.style.display = "block";
                        }
                    })
                    .finally(function () {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = originalBtnContent;
                        }
                    });
            }
        });
    }
});

/* ============================================================
   TNSE THEME TOGGLE ENGINE (Globally Accessible)
   ============================================================ */
const toggleTheme = () => {
    const body = document.body;
    const themeBtn = document.querySelector('.btn-theme i');
    const isDark = body.classList.contains('dark-theme');

    if (isDark) {
        body.classList.remove('dark-theme');
        if (themeBtn) themeBtn.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('tnse-theme', 'light');
    } else {
        body.classList.add('dark-theme');
        if (themeBtn) themeBtn.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('tnse-theme', 'dark');
    }
    
    const btnContainer = document.querySelector('.btn-theme');
    if (btnContainer) {
        btnContainer.style.transform = 'scale(0.9)';
        setTimeout(() => { btnContainer.style.transform = 'scale(1)'; }, 100);
    }
};

// Initial Theme Status Verification
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('tnse-theme');
    const themeBtn = document.querySelector('.btn-theme i');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeBtn) themeBtn.classList.replace('fa-sun', 'fa-moon');
    }
});

/* ============================================================
   TNSE STATS COUNTER ENGINE
   ============================================================ */
(() => {
    let isCurrentlyAnimating = false;

    function runCounterEngine(forceReset = false) {
        const targets = document.querySelectorAll('[data-target]');
        if (targets.length === 0 || isCurrentlyAnimating) return;

        let alreadyCompleted = true;
        targets.forEach(counter => {
            const currentVal = parseInt(counter.innerText, 10) || 0;
            const targetVal = parseInt(counter.getAttribute('data-target'), 10) || 0;
            if (currentVal !== targetVal) {
                alreadyCompleted = false;
            }
        });

        if (alreadyCompleted && !forceReset) return;

        isCurrentlyAnimating = true;

        targets.forEach(counter => {
            counter.innerText = '0';
            
            const finalValue = parseInt(counter.getAttribute('data-target'), 10);
            if (isNaN(finalValue)) return;

            const duration = 1200;
            const startTime = performance.now();
            
            function animateStep(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const ease = progress * (2 - progress);
                const currentCount = Math.floor(ease * finalValue);
                
                counter.innerText = currentCount;
                
                if (progress < 1) {
                    requestAnimationFrame(animateStep);
                } else {
                    counter.innerText = finalValue;
                    isCurrentlyAnimating = false;
                }
            }
            requestAnimationFrame(animateStep);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => runCounterEngine(false));
    } else {
        setTimeout(() => runCounterEngine(false), 100); 
    }
    window.addEventListener('load', () => runCounterEngine(false));

    const triggerTriggers = ['mouseover', 'click'];
    triggerTriggers.forEach(eventType => {
        document.addEventListener(eventType, function(e) {
            if (e.target && e.target.closest && (e.target.closest('[data-target]') || e.target.closest('.stat-item') || e.target.closest('.mega-menu-wrapper'))) {
                runCounterEngine(true);
            }
        });
    });

    if (typeof MutationObserver !== 'undefined') {
        const engineObserver = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
                    runCounterEngine(true);
                    break;
                }
            }
        });
        
        const megaWrapper = document.querySelector('.mega-menu-wrapper');
        if (megaWrapper) {
            engineObserver.observe(megaWrapper, { attributes: true, attributeFilter: ['class', 'style'] });
        }
        engineObserver.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
    }
})();

/* ============================================================
   TNSE BI-DIRECTIONAL SCROLL ENGINE (CONSOLIDATED OVERSEER)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    if (typeof IntersectionObserver === 'undefined') return;

    const scrollOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    };

    const bidirectionalEngine = new IntersectionObserver((entries) => {
        const itemsEntering = entries.filter(entry => entry.isIntersecting);

        itemsEntering.forEach((entry, index) => {
            const target = entry.target;

            if (target.classList.contains('service-card')) {
                target.style.transitionDelay = `${index * 0.12}s`;
                target.classList.add('reveal-active');
            } 
            else if (target.classList.contains('faq-item')) {
                target.classList.add('fade-in-bottom');
            } 
            else {
                target.classList.add('reveal-active', 'fade-visible');
            }
        });

        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                const target = entry.target;
                target.style.transitionDelay = '0s';
                target.classList.remove('reveal-active', 'fade-visible', 'fade-in-bottom');
            }
        });
    }, scrollOptions);

    const elementsToWatch = document.querySelectorAll(`
        .services-grid .service-card, 
        .fade-init, 
        .faq-item, 
        .about-image-side, 
        .about-text-side, 
        .extra-box
    `);

    elementsToWatch.forEach(el => {
        el.classList.remove('delay-1', 'delay-2', 'delay-3', 'delay-4');
        bidirectionalEngine.observe(el);
    });
});
