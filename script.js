const mosquitoContainer = document.getElementById('mosquitoContainer');
const mosquito = document.getElementById('mosquito');
const swatsDisplay = document.getElementById('swats');
let swats = 0;
let x = Math.random() * (window.innerWidth - 25);
let y = Math.random() * (window.innerHeight - 25);
let vx = (Math.random() - 0.5) * 2.5;
let vy = (Math.random() - 0.5) * 2.5;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let mainOscillator = null;
let harmonicOsc1 = null;
let harmonicOsc2 = null;
let lfo = null;
let gainNode = null;
let isPlaying = false;

const mosquitoBuzzAudio = new Audio('sounds/mosquito.mp3');
mosquitoBuzzAudio.loop = true; 
mosquitoBuzzAudio.volume = 0.5; 

const slapAudio = new Audio('sounds/slap.wav');
slapAudio.volume = 0.8;

function startBuzzing() {
    if (isPlaying) return;
    mosquitoBuzzAudio.play();
    isPlaying = true;
}

function stopBuzzing() {
    if (!isPlaying) return;
    mosquitoBuzzAudio.pause();
    mosquitoBuzzAudio.currentTime = 0; // Reset to start
    isPlaying = false;
}

function playSlapSound() {
    slapAudio.currentTime = 0; // Reset to start
    slapAudio.play();
}

function createBloodSplatter(x, y) {
    // Create blood stain
    const stain = document.createElement('div');
    stain.className = 'blood-stain';
    stain.style.left = (x - 15) + 'px';
    stain.style.top = (y - 15) + 'px';
    document.body.appendChild(stain);
    
    setTimeout(() => stain.remove(), 3000);
    
    // Create blood droplets
    const splatter = document.createElement('div');
    splatter.className = 'blood-splatter';
    splatter.style.left = x + 'px';
    splatter.style.top = y + 'px';
    document.body.appendChild(splatter);
    
    for (let i = 0; i < 15; i++) {
        const drop = document.createElement('div');
        drop.className = 'blood-drop';
        
        const size = Math.random() * 6 + 2;
        drop.style.width = size + 'px';
        drop.style.height = size + 'px';
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 40 + 20;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        drop.style.setProperty('--tx', tx + 'px');
        drop.style.setProperty('--ty', ty + 'px');
        drop.style.animationDelay = Math.random() * 0.1 + 's';
        
        splatter.appendChild(drop);
    }
    
    setTimeout(() => splatter.remove(), 600);
}

function moveMosquito() {
    x += vx;
    y += vy;
    
    if (x <= 0 || x >= window.innerWidth - 25) {
        vx = -vx;
        x = Math.max(0, Math.min(x, window.innerWidth - 25));
    }
    if (y <= 0 || y >= window.innerHeight - 25) {
        vy = -vy;
        y = Math.max(0, Math.min(y, window.innerHeight - 25));
    }
    
    if (Math.random() < 0.03) {
        vx += (Math.random() - 0.5) * 1;
        vy += (Math.random() - 0.5) * 1;
        
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > 3.5) {
            vx = (vx / speed) * 3.5;
            vy = (vy / speed) * 3.5;
        }
    }
    
    const angle = Math.atan2(vy, vx) * (180 / Math.PI);
    
    mosquitoContainer.style.left = x + 'px';
    mosquitoContainer.style.top = y + 'px';
    mosquitoContainer.style.transform = `rotate(${angle + 90}deg)`;
    
    requestAnimationFrame(moveMosquito);
}

mosquitoContainer.addEventListener('click', function(e) {
    e.stopPropagation();
    swats++;
    swatsDisplay.textContent = 'Kills: ' + swats;
    
    stopBuzzing();
    playSlapSound();
    
    const rect = mosquitoContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    
    createBloodSplatter(centerX, centerY);
    
    mosquito.classList.add('dying');
    
    setTimeout(() => {
        spawnNewMosquito();
    }, 300);
});

moveMosquito();

function spawnNewMosquito() {
    x = Math.random() * (window.innerWidth - 25);
    y = Math.random() * (window.innerHeight - 25);
    vx = (Math.random() - 0.5) * 2.5;
    vy = (Math.random() - 0.5) * 2.5;
    
    mosquito.classList.remove('dying');
    mosquitoContainer.style.left = x + 'px';
    mosquitoContainer.style.top = y + 'px';
    
    setTimeout(() => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        startBuzzing();
    }, 100);
}

let audioInitialized = false;
document.addEventListener('click', function initSound() {
    if (!audioInitialized) {
        startBuzzing();
        audioInitialized = true;
    }
}, { once: true });