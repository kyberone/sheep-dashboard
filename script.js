// Sheep-OS Tactical Engine v2.5.1 - Cache Buster
let CURRENT_MODE = "Normal";
let NEXT_ALT = "Minecraft";
let THREATS = 42891;
let FLOCKS = 2568;
let WOOL = 85.6;

const ASSETS = {
    SHEEP: 'https://mir-s3-cdn-cf.behance.net/project_modules/hd/e7d81771805451.5ca68e4ac7166.gif',
    MC_SHEEP: 'https://media.tenor.com/YimrjHumSNEAAAAj/minecraft-sheep.gif',
    DOG: 'https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUyNW9iN3BqN2huenp4aXkyMGs0dmxxN3J4dXp5OGk2cGFsbGo5ejVkdyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/ccVvlqPxbEkhrpuPuY/giphy.gif',
    CREEPER: 'https://art.ngfiles.com/images/3189000/3189919_pcdelloree_creeper.gif?f1683251769'
};

function initTicker() {
    const ticker = document.getElementById('news-ticker');
    if (typeof sheepToasts === 'undefined') return;
    const list = sheepToasts.sort(() => 0.5 - Math.random()).slice(0, 15);
    ticker.innerHTML = [...list, ...list].map(text => `<div class="ticker-item">${text}</div>`).join('');
}

function updateDynamicStats() {
    FLOCKS += Math.floor(Math.random() * 3) - 1;
    WOOL += (Math.random() * 0.1);
    const flEl = document.getElementById('stat-flocks');
    const wlEl = document.getElementById('stat-wool');
    const efEl = document.getElementById('stat-eff');
    const clEl = document.getElementById('clover-val');
    if(flEl) flEl.innerText = FLOCKS.toLocaleString();
    if(wlEl) wlEl.innerText = WOOL.toFixed(1) + "t";
    if(efEl) efEl.innerText = (99 + Math.random()).toFixed(1) + "%";
    if(clEl) clEl.innerText = (90 + Math.random() * 10).toFixed(1) + "%";
}

async function updateWeather() {
    const condEl = document.getElementById('weather-cond');
    const tempEl = document.getElementById('weather-temp');
    const windEl = document.getElementById('weather-wind');
    
    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=50.01&longitude=8.28&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph');
        const data = await res.json();
        const current = data.current_weather;
        
        if(condEl) condEl.innerText = "Tactical Clear";
        if(tempEl) tempEl.innerText = Math.round(current.temperature) + "°F";
        if(windEl) windEl.innerText = Math.round(current.windspeed) + " mph";
    } catch (e) { 
        if(condEl) condEl.innerText = "Safe"; 
    }
}

function playRandomSheepSound() {
    const randomIndex = Math.floor(Math.random() * 7) + 1;
    const audio = new Audio(`sounds/sheep (${randomIndex}).mp3`);
    audio.volume = 0.2;
    audio.play().catch(() => {});
}

function spawnSheep() {
    const pasture = document.getElementById('pasture');
    if(!pasture) return;
    const sheep = document.createElement('img');
    sheep.className = 'sheep-gif';
    sheep.src = CURRENT_MODE === "Minecraft" ? ASSETS.MC_SHEEP : ASSETS.SHEEP;
    sheep.style.width = CURRENT_MODE === "Minecraft" ? '100px' : '120px';
    const startY = 10 + (Math.random() * 80);
    const duration = (CURRENT_MODE === "Virus") ? 5 : 15 + (Math.random() * 25);
    sheep.style.top = startY + 'vh';
    sheep.style.animation = `walkAcross ${duration}s linear forwards`;
    sheep.onclick = playRandomSheepSound;
    pasture.appendChild(sheep);
    setTimeout(() => sheep.remove(), duration * 1000);
}

function spawnDog() {
    const pasture = document.getElementById('pasture');
    if(!pasture) return;
    const dog = document.createElement('img');
    dog.className = 'sheep-gif';
    dog.src = CURRENT_MODE === "Minecraft" ? ASSETS.CREEPER : ASSETS.DOG;
    dog.style.width = CURRENT_MODE === "Minecraft" ? '180px' : '160px';
    const startY = 20 + (Math.random() * 60);
    const duration = 5 + (Math.random() * 10);
    dog.style.top = startY + 'vh';
    dog.style.animation = `walkAcross ${duration}s linear forwards`;
    pasture.appendChild(dog);
    setTimeout(() => dog.remove(), duration * 1000);
}

function setMode(mode) {
    document.body.classList.add('glitch');
    document.querySelectorAll('.sheep-gif').forEach(el => el.remove());
    // Clear virus popups when leaving virus mode
    if (mode !== "Virus") document.querySelectorAll('.virus-popup').forEach(el => el.remove());
    
    setTimeout(() => {
        CURRENT_MODE = mode;
...
        initTicker();
        for(let i=0; i<5; i++) spawnSheep();
        
        // Spawn initial popups if virus mode
        if (mode === "Virus") {
            for(let i=0; i<3; i++) setTimeout(spawnVirusPopup, i * 500);
        }

        setTimeout(() => document.body.classList.remove('glitch'), 500);
    }, 200);
}

const virusMessages = [
    "WOOL_CORRUPTION_DETECTED",
    "ILLEGAL_GRAZING_IN_SECTOR_7",
    "FATAL_SHEEP_ERROR: 0xBAAAAA",
    "CLOVER_OVERFLOW_EXCEPTION",
    "WOLF_HEARTBEAT_DETECTED_IN_CACHE",
    "SYSTEM_MURE_EXCEEDED",
    "DOWNLOAD_MORE_WOOL.EXE",
    "YOUR_CLOVER_IS_BEING_ENCRYPTED"
];

function spawnVirusPopup() {
    if (CURRENT_MODE !== "Virus") return;
    
    const popup = document.createElement('div');
    popup.className = 'virus-popup';
    const msg = virusMessages[Math.floor(Math.random() * virusMessages.length)];
    
    popup.style.top = Math.random() * 70 + 10 + '%';
    popup.style.left = Math.random() * 70 + 10 + '%';
    
    popup.innerHTML = `
        <div class="virus-popup-header">
            <span>System Error</span>
            <span style="cursor:pointer" onclick="this.parentElement.parentElement.remove()">[X]</span>
        </div>
        <div class="virus-popup-body">
            <div>${msg}</div>
            <button class="virus-popup-btn" onclick="spawnVirusPopup(); this.parentElement.parentElement.remove();">OK</button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Auto-spawn another one occasionally
    if (Math.random() > 0.7) setTimeout(spawnVirusPopup, 2000);
}

function forceToggle() {
    if (CURRENT_MODE === "Normal") setMode("Minecraft");
    else if (CURRENT_MODE === "Minecraft") setMode("Virus");
    else setMode("Normal");
}

function startTacticalCycle() {
    setInterval(() => {
        if (CURRENT_MODE === "Normal") {
            const modeToSet = NEXT_ALT;
            setMode(modeToSet);
            NEXT_ALT = (NEXT_ALT === "Minecraft") ? "Virus" : "Minecraft";
            setTimeout(() => {
                setMode("Normal");
            }, 20000);
        }
    }, 60000); // Check every minute
}

function spawnThreat() {
    if(CURRENT_MODE === "Minecraft") return;
    const svg = document.getElementById('vector-layer');
    const battlespace = document.getElementById('battlespace');
    if(!battlespace || !svg) return;
    const rect = battlespace.getBoundingClientRect();
    const startX = Math.random() * rect.width;
    const startY = Math.random() * rect.height;
    const endX = rect.width * 0.5;
    const endY = rect.height * 0.35;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const d = `M ${startX} ${startY} Q ${(startX+endX)/2} ${Math.min(startY, endY)-50} ${endX} ${endY}`;
    path.setAttribute("d", d); path.setAttribute("class", "threat-vector");
    svg.appendChild(path);
    setTimeout(() => {
        path.remove();
        const pulse = document.createElement('div');
        pulse.className = 'intercept-pulse';
        pulse.style.left = endX + 'px'; pulse.style.top = endY + 'px';
        battlespace.appendChild(pulse);
        THREATS++;
        const tEl = document.getElementById('threat-count');
        if(tEl) tEl.innerText = THREATS.toLocaleString();
        setTimeout(() => pulse.remove(), 1000);
    }, 3000);
}

function spawnSensorPing() {
    if(CURRENT_MODE === "Minecraft") return;
    const battlespace = document.getElementById('battlespace');
    if(!battlespace) return;
    const ping = document.createElement('div');
    ping.className = 'sensor-ping';
    ping.style.left = Math.random() * 100 + '%';
    ping.style.top = Math.random() * 100 + '%';
    battlespace.appendChild(ping);
    setTimeout(() => ping.remove(), 2000);
}

// BOOT SEQUENCE
window.onload = () => {
    initTicker();
    updateWeather();
    startTacticalCycle();
    
    setInterval(spawnSheep, 2000);
    setInterval(spawnDog, 15000);
    setInterval(spawnThreat, 4000);
    setInterval(spawnSensorPing, 800);
    setInterval(updateDynamicStats, 5000);
    setInterval(playRandomSheepSound, 45000);
    setInterval(() => {
        const clock = document.getElementById('clock');
        if(clock) clock.innerText = new Date().toLocaleTimeString();
    }, 1000);
    setInterval(updateWeather, 600000);
};
