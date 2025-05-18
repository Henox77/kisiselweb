const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

document.addEventListener('mousedown', () => {
    cursor.style.transform = 'scale(0.5)';
    cursorFollower.style.transform = 'scale(0.8)';
});

document.addEventListener('mouseup', () => {
    cursor.style.transform = 'scale(1)';
    cursorFollower.style.transform = 'scale(1)';
});

const links = document.querySelectorAll('a, button, .project-card, .skill-item');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2)';
        cursorFollower.style.transform = 'scale(1.5)';
    });
    
    link.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const menuLines = document.querySelectorAll('.menu-line');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuLines.forEach(line => line.classList.toggle('active'));
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    });
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
        navbar.style.boxShadow = 'none';
    }
});

const revealElements = document.querySelectorAll('.section-header, .about-content, .projects-grid, .skills-container, .contact-container');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); 

const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inputs = contactForm.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        if (isValid) {
            alert('Mesajınız gönderildi!');
            contactForm.reset();
        }
    });
} else {
    console.error('Contact form element not found.');
}

async function fetchGitHubProjects() {
    const username = 'Henox77';
    const projectsGrid = document.querySelector('.projects-grid');
    
    try {
        console.log('GitHub projeleri yükleniyor...');
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const projects = await response.json();
        console.log('Projeler başarıyla yüklendi:', projects);
        
        if (!Array.isArray(projects) || projects.length === 0) {
            projectsGrid.innerHTML = '<p class="error-message">Henüz hiç proje bulunmuyor.</p>';
            return;
        }

        projectsGrid.innerHTML = '';

        projects.forEach(project => {
            const projectCard = `
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
            projectsGrid.innerHTML += projectCard;
        });

        AOS.refresh();
        
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
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillProgress = entry.target.querySelector('.skill-progress');
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
        observer.observe(item);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Sayfa yüklendi, projeler getiriliyor...');
    fetchGitHubProjects();
    animateSkillBars();
    
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if(cursor && cursorFollower) { 
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
            }, 100);
        });

        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'scale(0.5)';
            cursorFollower.style.transform = 'scale(0.8)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });

        const links = document.querySelectorAll('a, button, .project-card, .skill-item');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
                cursorFollower.style.transform = 'scale(1.5)';
            });
            
            link.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursorFollower.style.transform = 'scale(1)';
            });
        });
    }

    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const menuLines = document.querySelectorAll('.menu-line');

    if(menuBtn && navLinks && menuLines.length > 0) { 
         menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuLines.forEach(line => line.classList.toggle('active'));
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                 const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if(navbar) {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
                navbar.style.boxShadow = 'none';
            }
        }
    });

    const revealElements = document.querySelectorAll('.section-header, .about-content, .projects-grid, .skills-container, .contact-container');

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); 

    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });
}); 