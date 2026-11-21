(() => {
    const existing = document.getElementById('color-bot-overlay');
    if (existing) existing.remove();

    let isRunning = false;
    let botTimer = null;
    let delay = 50; // Délai par défaut en ms

    // --- 1. Création de l'interface (Overlay) ---
    const overlay = document.createElement('div');
    overlay.id = 'color-bot-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: '999999',
        backgroundColor: '#1e1e2e',
        color: '#cdd6f4',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        width: '215px',
        border: '1px solid #313244',
        userSelect: 'none'
    });

    overlay.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span>🎨 Color Bot</span>
            <span id="bot-status-dot" style="height: 10px; width: 10px; background-color: #f38ba8; border-radius: 50%; display: inline-block;"></span>
        </div>
        <button id="bot-toggle-btn" style="
            width: 100%; padding: 8px; border: none; border-radius: 6px; 
            background-color: #a6e3a1; color: #11111b; font-weight: bold; 
            cursor: pointer; transition: 0.15s; margin-bottom: 12px;">
            Activer le Bot
        </button>
        <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px;">
            <label for="bot-speed">Délai : <span id="bot-speed-val">${delay}</span> ms</label>
            <input type="range" id="bot-speed" min="1" max="500" step="1" value="${delay}" style="cursor: pointer;">
        </div>
    `;
    document.body.appendChild(overlay);

    // --- 2. Logique de détection et de clic ---
    function findAndClickOddCell() {
        const cells = Array.from(document.querySelectorAll('#game .square'));
        if (cells.length < 3) return;

        const colorCounts = {};
        cells.forEach(cell => {
            const color = cell.style.backgroundColor;
            colorCounts[color] = (colorCounts[color] || 0) + 1;
        });

        const oddCell = cells.find(cell => colorCounts[cell.style.backgroundColor] === 1);

        if (oddCell) {
            ['pointerdown', 'mousedown', 'mouseup', 'pointerup', 'click'].forEach(eventType => {
                oddCell.dispatchEvent(new MouseEvent(eventType, {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }));
            });
        }
    }

    function loop() {
        if (!isRunning) return;
        findAndClickOddCell();
        botTimer = setTimeout(loop, delay);
    }

    // --- 3. Gestion des événements de l'interface ---
    const toggleBtn = document.getElementById('bot-toggle-btn');
    const statusDot = document.getElementById('bot-status-dot');
    const speedSlider = document.getElementById('bot-speed');
    const speedVal = document.getElementById('bot-speed-val');

    toggleBtn.addEventListener('click', () => {
        isRunning = !isRunning;
        if (isRunning) {
            toggleBtn.textContent = 'Désactiver le Bot';
            toggleBtn.style.backgroundColor = '#f38ba8';
            statusDot.style.backgroundColor = '#a6e3a1';
            loop();
        } else {
            toggleBtn.textContent = 'Activer le Bot';
            toggleBtn.style.backgroundColor = '#a6e3a1';
            statusDot.style.backgroundColor = '#f38ba8';
            clearTimeout(botTimer);
        }
    });

    speedSlider.addEventListener('input', (e) => {
        delay = parseInt(e.target.value, 10);
        speedVal.textContent = delay;
    });
})();