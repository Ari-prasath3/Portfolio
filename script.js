// script.js - Premium Awwwards-Style Portfolio Interactive Logic

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // -------------------------------------------------------------
    // 1. Smooth Easing Mouse-Follow Glow Follower
    // -------------------------------------------------------------
    const cursorGlow = document.getElementById('cursor-glow');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        // Easing interpolation (lerp) for liquid glide feel
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;

        if (cursorGlow) {
            // Translate centered on the 400px width/height glow orb
            cursorGlow.style.transform = `translate3d(${glowX - 200}px, ${glowY - 200}px, 0)`;
        }
        requestAnimationFrame(animateGlow);
    }
    
    // Start tracking loop
    animateGlow();

    // -------------------------------------------------------------
    // 2. Sticky Floating Navbar Scroll Effect
    // -------------------------------------------------------------
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
    });

    // -------------------------------------------------------------
    // 3. Typing Effect for Subtitle Header
    // -------------------------------------------------------------
    const typingSpan = document.getElementById('job-title-typing');
    const titles = [
        "Software Engineer",
        "Java & Spring Boot Specialist",
        "Cloud-Native Microservices Architect",
        "Full-Stack & AI Systems Engineer"
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentTitle = titles[titleIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingSpan.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentTitle.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of text
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 500;
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    if (typingSpan) {
        setTimeout(typeEffect, 800);
    }

    // -------------------------------------------------------------
    // 4. Zero-Gravity Matter.js Skills Sandbox
    // -------------------------------------------------------------
    const container = document.getElementById('arena-canvas-container');
    const arena = document.getElementById('skills-arena');
    const hint = document.getElementById('arena-hint');
    
    if (container && arena) {
        const { Engine, World, Bodies, Body, Runner, Mouse, MouseConstraint, Events } = Matter;

        let width = container.clientWidth;
        let height = container.clientHeight;

        const engine = Engine.create();
        const world = engine.world;

        // Set zero gravity
        world.gravity.x = 0;
        world.gravity.y = 0;

        const wallThickness = 100;

        // Create Boundaries
        const topWall = Bodies.rectangle(width / 2, -wallThickness / 2, width + 200, wallThickness, { isStatic: true, label: 'wall' });
        const bottomWall = Bodies.rectangle(width / 2, height + wallThickness / 2, width + 200, wallThickness, { isStatic: true, label: 'wall' });
        const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height + 200, { isStatic: true, label: 'wall' });
        const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height + 200, { isStatic: true, label: 'wall' });

        World.add(world, [topWall, bottomWall, leftWall, rightWall]);

        const pillElements = document.querySelectorAll('.skill-pill');
        const physicsPills = [];

        // Prepare measurements
        arena.style.opacity = '1';
        arena.style.display = 'block';

        pillElements.forEach((pill, idx) => {
            const pillWidth = pill.offsetWidth;
            const pillHeight = pill.offsetHeight;

            // Scattered centers
            const margin = 50;
            const spawnX = margin + Math.random() * (width - 2 * margin);
            const spawnY = margin + Math.random() * (height - 2 * margin);

            const body = Bodies.rectangle(spawnX, spawnY, pillWidth, pillHeight, {
                restitution: 0.88,
                friction: 0.0,
                frictionAir: 0.012,
                density: 0.002,
                chamfer: { radius: 12 },
                label: 'skill'
            });

            body.element = pill;

            // Random initial push
            const angle = Math.random() * Math.PI * 2;
            const force = 1.2 + Math.random() * 2.0;
            Body.setVelocity(body, {
                x: Math.cos(angle) * force,
                y: Math.sin(angle) * force
            });

            Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.02);

            World.add(world, body);

            physicsPills.push({
                body: body,
                element: pill,
                width: pillWidth,
                height: pillHeight
            });
        });

        // Toggle visibility
        arena.style.opacity = '1';
        arena.style.pointerEvents = 'auto';

        const mouse = Mouse.create(container);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });

        World.add(world, mouseConstraint);

        // Prevent wheel event hijacking (scroll block)
        mouseConstraint.mouse.element.removeEventListener("mousewheel", mouseConstraint.mouse.mousewheel);
        mouseConstraint.mouse.element.removeEventListener("DOMMouseScroll", mouseConstraint.mouse.mousewheel);

        // Apply drag visual states
        Events.on(mouseConstraint, 'startdrag', (event) => {
            if (event.body && event.body.element) {
                event.body.element.classList.add('dragging');
                if (hint) {
                    hint.style.opacity = '0';
                    setTimeout(() => hint.remove(), 1000);
                }
            }
        });

        Events.on(mouseConstraint, 'enddrag', (event) => {
            if (event.body && event.body.element) {
                event.body.element.classList.remove('dragging');
            }
        });

        const runner = Runner.create();
        Runner.run(runner, engine);

        // Sync Updates Loop
        Events.on(engine, 'afterUpdate', () => {
            const mousePos = mouse.position;
            const isMouseIn = mousePos.x >= 0 && mousePos.x <= width && mousePos.y >= 0 && mousePos.y <= height;

            physicsPills.forEach(item => {
                const { body, element, width: w, height: h } = item;

                // Repulsion from Mouse
                if (isMouseIn && body !== mouseConstraint.body) {
                    const dx = body.position.x - mousePos.x;
                    const dy = body.position.y - mousePos.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        const forceMag = (130 - dist) * 0.000009; // Push force
                        Body.applyForce(body, body.position, {
                            x: (dx / dist) * forceMag,
                            y: (dy / dist) * forceMag
                        });
                    }
                }

                // Slow Drift Control
                const speed = Math.sqrt(body.velocity.x * body.velocity.x + body.velocity.y * body.velocity.y);
                if (speed < 0.22 && body !== mouseConstraint.body) {
                    const randomAngle = Math.random() * Math.PI * 2;
                    Body.applyForce(body, body.position, {
                        x: Math.cos(randomAngle) * 0.00008,
                        y: Math.sin(randomAngle) * 0.00008
                    });
                }

                // Max Speed Cap
                const maxSpeed = 10;
                if (speed > maxSpeed) {
                    Body.setVelocity(body, {
                        x: (body.velocity.x / speed) * maxSpeed,
                        y: (body.velocity.y / speed) * maxSpeed
                    });
                }

                // Map Coordinates (center translation)
                const x = body.position.x - w / 2;
                const y = body.position.y - h / 2;

                element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${body.angle}rad)`;
            });
        });

        // Handle Resizes
        window.addEventListener('resize', () => {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;

            const oldWidth = width;
            const oldHeight = height;

            width = newWidth;
            height = newHeight;

            Body.setPosition(topWall, { x: width / 2, y: -wallThickness / 2 });
            Body.setPosition(bottomWall, { x: width / 2, y: height + wallThickness / 2 });
            Body.setPosition(leftWall, { x: -wallThickness / 2, y: height / 2 });
            Body.setPosition(rightWall, { x: width + wallThickness / 2, y: height / 2 });

            Body.setVertices(topWall, Bodies.rectangle(width / 2, -wallThickness / 2, width + 200, wallThickness).vertices);
            Body.setVertices(bottomWall, Bodies.rectangle(width / 2, height + wallThickness / 2, width + 200, wallThickness).vertices);
            Body.setVertices(leftWall, Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height + 200).vertices);
            Body.setVertices(rightWall, Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height + 200).vertices);

            physicsPills.forEach(item => {
                const body = item.body;
                let rx = body.position.x;
                let ry = body.position.y;

                rx = (rx / oldWidth) * width;
                ry = (ry / oldHeight) * height;

                const margin = 40;
                if (rx < margin) rx = margin + Math.random() * 20;
                if (rx > width - margin) rx = width - margin - Math.random() * 20;
                if (ry < margin) ry = margin + Math.random() * 20;
                if (ry > height - margin) ry = height - margin - Math.random() * 20;

                Body.setPosition(body, { x: rx, y: ry });
            });
        });
    }

    // -------------------------------------------------------------
    // 5. Contact Form Submission Modals
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !subject || !message) {
                return;
            }

            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="relative w-full px-6 py-4 bg-[#030712] rounded-xl flex items-center justify-center gap-2">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-accentCyan" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Transmitting message...
                </span>
            `;

            setTimeout(() => {
                const modal = document.createElement('div');
                modal.className = 'fixed inset-0 z-50 flex items-center justify-center px-4 bg-bgPrimary/80 backdrop-blur-sm transition-opacity duration-300';
                modal.innerHTML = `
                    <div class="glass-card p-8 rounded-3xl border border-accentPurple/30 bg-[#090514] max-w-md w-full text-center shadow-neon-purple">
                        <div class="w-12 h-12 rounded-full bg-accentPurple/10 border border-accentPurple flex items-center justify-center mx-auto mb-4 text-accentPurple shadow-neon-purple">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                        </div>
                        <h3 class="text-xl font-bold font-display text-textPrimary mb-2">Message Sent</h3>
                        <p class="text-sm text-textMuted mb-6">Thanks, ${name}! Your transmission was successful. I'll get back to you soon.</p>
                        <button id="close-modal-btn" class="w-full bg-gradient-to-r from-accentPurple to-accentCyan text-white py-3 rounded-xl font-bold hover:shadow-neon-purple transition-all duration-200">
                            Acknowledge
                        </button>
                    </div>
                `;

                document.body.appendChild(modal);

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;
                contactForm.reset();

                document.getElementById('close-modal-btn').addEventListener('click', () => {
                    modal.classList.add('opacity-0');
                    setTimeout(() => modal.remove(), 300);
                });
            }, 1200);
        });
    }

    // -------------------------------------------------------------
    // 6. Magnetic Hover Effects
    // -------------------------------------------------------------
    const magneticElements = document.querySelectorAll('.magnetic-hover');
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            elem.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });
        elem.style.transition = 'transform 0.1s ease-out';
        elem.addEventListener('mouseleave', () => {
            elem.style.transform = 'translate(0px, 0px)';
            elem.style.transition = 'transform 0.4s ease-out';
        });
    });
});
