document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTS ---
    const mainContent = document.getElementById('main-content');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const navLinks = document.querySelectorAll('.nav-link');

    // --- NAVIGATION ---

    /**
     * Main navigation function.
     * Injects page content from <template> tags into <main>.
     * @param {string} page - The ID of the page template (e.g., 'home')
     */
    function navigate(page) {
        const template = document.getElementById(`page-${page}`);
        if (template) {
            // Replace content
            mainContent.innerHTML = template.innerHTML;
            
            // Scroll to the top of the page
            window.scrollTo(0, 0);

            // Update the active state of navigation links
            updateActiveLink(page);

            // After content is loaded, initialize JS for that page
            initializePageJS(page);

        } else {
            console.error(`Page template "page-${page}" not found.`);
        }
    }

    /**
     * Updates the 'active' class on navigation links.
     * @param {string} page - The currently active page.
     */
    function updateActiveLink(page) {
        navLinks.forEach(link => {
            if (link.dataset.page === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Use event delegation for navigation links
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.nav-link');
        if (target) {
            e.preventDefault();
            const page = target.dataset.page;
            if (page) {
                navigate(page);
                // If mobile menu is open, close it
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                }
            }
        }
    });

    // --- MOBILE MENU ---

    /**
     * Toggles the mobile menu visibility.
     */
    function toggleMobileMenu() {
        mobileMenu.classList.toggle('active');
    }

    // Add click listener to the hamburger menu button
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }

    // --- PAGE-SPECIFIC INITIALIZATION ---

    /**
     * Initializes JavaScript specific to the loaded page.
     * @param {string} page - The ID of the page that was just loaded.
     */
    function initializePageJS(page) {
        // 1. Set up scroll animations for new content
        setupIntersectionObserver();

        // 2. If it's the contact page, attach the form listener
        if (page === 'contact') {
            attachFormListener();
        }
    }

    // --- SCROLL ANIMATIONS ---

    /**
     * Sets up the Intersection Observer to add a 'visible' class 
     * to elements with the 'reveal' class when they scroll into view.
     */
    function setupIntersectionObserver() {
        const revealElements = document.querySelectorAll('.reveal');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: stop observing once it's visible to save resources
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        revealElements.forEach(el => {
            observer.observe(el);
        });
    }

    // --- WHATSAPP CONTACT FORM ---

    /**
     * Attaches the submit event listener to the WhatsApp form.
     */
    function attachFormListener() {
        const form = document.getElementById('whatsapp-form');
        const messageBox = document.getElementById('form-message');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault(); // Stop the form from submitting normally

                try {
                    // --- IMPORTANT: Set your WhatsApp number here ---
                    const hospitalWhatsAppNumber = '911234567890'; // Use country code, no '+' or spaces.

                    const nameInput = document.getElementById('name');
                    const messageInput = document.getElementById('message');

                    const name = nameInput.value.trim();
                    const message = messageInput.value.trim();

                    if (!name || !message) {
                        messageBox.textContent = 'Please fill out both fields.';
                        messageBox.className = 'form-message error';
                        return;
                    }

                    // Format the message for WhatsApp
                    const formattedMessage = `Hello, my name is ${name}.\n\nMy inquiry is:\n${message}`;

                    // URL-encode the message
                    const encodedMessage = encodeURIComponent(formattedMessage);

                    // Create the wa.me link
                    const whatsappURL = `https://wa.me/${hospitalWhatsAppNumber}?text=${encodedMessage}`;

                    // Open the URL in a new tab
                    window.open(whatsappURL, '_blank');

                    // Show success message and clear the form
                    messageBox.textContent = 'Opening WhatsApp...';
                    messageBox.className = 'form-message success';
                    form.reset();

                } catch (error) {
                    console.error('Error handling form:', error);
                    messageBox.textContent = 'An error occurred. Please try again.';
                    messageBox.className = 'form-message error';
                }
            });
        }
    }

    // --- INITIAL PAGE LOAD ---
    // Load the home page by default when the site is first visited.
    navigate('home');

});
