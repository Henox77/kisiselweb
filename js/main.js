const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

function initializeCursor() {
    if (!cursor || !cursorFollower) {
        console.warn('Cursor elements not found. Custom cursor disabled.');
        return;
    }

    document.addEventListener('mousemove', (e) => {
        try {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            
            setTimeout(() => {
                cursorFollower.style.left = `${e.clientX}px`;
                cursorFollower.style.top = `${e.clientY}px`;
            }, 100);
        } catch (error) {
            console.error('Error updating cursor position:', error);
        }
    });

    document.addEventListener('mousedown', () => {
        try {
            cursor.style.transform = 'scale(0.5)';
            cursorFollower.style.transform = 'scale(0.8)';
        } catch (error) {
            console.error('Error updating cursor scale on mousedown:', error);
        }
    });

    document.addEventListener('mouseup', () => {
        try {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        } catch (error) {
            console.error('Error updating cursor scale on mouseup:', error);
        }
    });

    const links = document.querySelectorAll('a, button, .project-card, .skill-item');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            try {
                cursor.style.transform = 'scale(2)';
                cursorFollower.style.transform = 'scale(1.5)';
            } catch (error) {
                console.error('Error updating cursor scale on link hover:', error);
            }
        });
        
        link.addEventListener('mouseleave', () => {
            try {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
            } catch (error) {
                console.error('Error updating cursor scale on link leave:', error);
            }
        });
    });
}

function initializePage() {
    console.log('Sayfa yüklendi, projeler getiriliyor...');
    
    fetchGitHubProjects();
    
    animateSkillBars();
    
    setupSmoothScroll();
    
    setupNavbarScroll();
    
    setupScrollReveal();
    
    initializeAOS();
}

function setupSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    if (!anchorLinks || anchorLinks.length === 0) return;

    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });
}

function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
            navbar.style.boxShadow = 'none';
        }
    });
}

function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.section-header, .about-content, .projects-grid, .skills-container, .contact-container');
    if (!revealElements || revealElements.length === 0) return;

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            if (!element) return;
            
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();
}

function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
}

async function fetchGitHubProjects() {
    const username = 'Henox77';
    const projectsGrid = document.querySelector('.projects-grid');
    
    if (!projectsGrid) {
        console.error('Projects grid element not found');
        return;
    }

    try {
        console.log('GitHub projeleri yükleniyor...');
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error(`GitHub API Hatası: ${response.status}`);
        }
        
        const projects = await response.json();
        console.log('Projeler başarıyla yüklendi:', projects);
        
        if (!Array.isArray(projects) || projects.length === 0) {
            projectsGrid.innerHTML = '<p class="error-message">Henüz hiç proje bulunmuyor.</p>';
            return;
        }

        let projectsHTML = '';
        projects.forEach(project => {
            projectsHTML += `
                <div class="project-card" data-aos="fade-up">
                    <div class="project-image">
                        <div class="project-overlay">
                            <div class="project-links">
                                <a href="${project.html_url}" class="project-link" target="_blank" title="GitHub">
                                    <i class="fab fa-github"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="project-info">
                        <h3>${project.name}</h3>
                        <p>${project.description || 'Açıklama bulunmuyor.'}</p>
                        <div class="project-tags">
                            ${project.language ? `<span><i class="fas fa-code"></i> ${project.language}</span>` : ''}
                            <span><i class="fas fa-star"></i> ${project.stargazers_count}</span>
                            <span><i class="fas fa-code-branch"></i> ${project.forks_count}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        projectsGrid.innerHTML = projectsHTML;
        console.log('Projeler HTML\'e eklendi');
        
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
            console.log('AOS yenilendi');
        }
        
    } catch (error) {
        console.error('GitHub projeleri yüklenirken hata oluştu:', error);
        projectsGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Projeler yüklenirken bir hata oluştu.</p>
                <p class="error-details">${error.message}</p>
            </div>
        `;
    }
}

function animateSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    if (!skillItems || skillItems.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillProgress = entry.target.querySelector('.skill-progress');
                if (!skillProgress) return;

                const width = skillProgress.style.width;
                skillProgress.style.width = '0';
                setTimeout(() => {
                    skillProgress.style.width = width;
                }, 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    skillItems.forEach(item => {
        if (item) observer.observe(item);
    });
}

document.addEventListener('DOMContentLoaded', initializePage); 
