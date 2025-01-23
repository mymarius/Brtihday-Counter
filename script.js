function setTheme(theme) {
    document.body.className = `theme-${theme}`;
    const url = new URL(window.location.href);
    url.searchParams.set('theme', theme);
    window.history.replaceState({}, '', url);
    localStorage.setItem('selectedTheme', theme);
}

function generateLink() {
    const birthdayDate = document.getElementById('birthdayDate').value;
    const personName = document.getElementById('personName').value;
    
    if (!birthdayDate) {
        alert("Please choose a date!");
        return;
    }

    const baseUrl = window.location.origin + window.location.pathname;
    const theme = document.body.className.split('-')[1];
    const params = new URLSearchParams();
    
    params.set('birthday', birthdayDate);
    if (personName) params.set('name', personName);
    params.set('theme', theme);
    
    const link = `${baseUrl}?${params.toString()}`;
    
    document.getElementById('birthdayLink').value = link;
    document.getElementById('linkSection').classList.remove('hidden');
    document.getElementById('countdown').classList.remove('hidden');
    
    startCountdown(new Date(birthdayDate), personName);
}

function copyLink() {
    const linkInput = document.getElementById('birthdayLink');
    linkInput.select();
    document.execCommand('copy');
    
    const copyButton = document.querySelector('.copy-btn');
    copyButton.textContent = 'copied!';
    copyButton.style.background = 'linear-gradient(45deg, #00cc00, #009900)';
    
    setTimeout(() => {
        copyButton.textContent = 'Copy Link';
        copyButton.style.background = '';
    }, 2000);
}

function startCountdown(birthday, name) {
    const titleElement = document.getElementById('countdown-title');
    if (name) {
        titleElement.textContent = `Until ${name}'s Birthday`;
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const birthdayTime = birthday.getTime();
        
        // Calculate next birthday if the date has passed
        let targetDate = birthdayTime;
        if (birthdayTime < now) {
            const nextBirthday = new Date(birthday);
            nextBirthday.setFullYear(new Date().getFullYear());
            if (nextBirthday < now) {
                nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
            }
            targetDate = nextBirthday.getTime();
        }

        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        if (distance <= 0) {
            const message = name ? 
                `🎉 Happy Birthday to ${name}! 🎂` : 
                "🎉 Happy Birthday! 🎂";
            
            document.querySelector('.countdown').innerHTML = 
                `<div class="celebration animate__animated animate__bounce">${message}</div>`;
        }
    }

    updateCountdown();
    return setInterval(updateCountdown, 1000);
}

// Initialize page based on URL parameters
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const birthdayParam = params.get('birthday');
    const nameParam = params.get('name');
    const themeParam = params.get('theme') || localStorage.getItem('selectedTheme') || 'modern';

    setTheme(themeParam);

    if (birthdayParam) {
        document.getElementById('creator').style.display = 'none';
        document.getElementById('countdown').classList.remove('hidden');
        startCountdown(new Date(birthdayParam), nameParam);
    }

    // Set minimum date to today
    const dateInput = document.getElementById('birthdayDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
});