document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const net = document.getElementById('net');
    let netX = gameArea.offsetWidth / 2, netY = gameArea.offsetHeight / 2; // Start net in the center
    const speed = 10; // Speed of the net movement
    let capturedShrimpCount = 0;

    // Display the counter
    const counterDisplay = document.createElement('div');
    counterDisplay.style.position = 'absolute';
    counterDisplay.style.top = '10px';
    counterDisplay.style.left = '10px';
    counterDisplay.style.color = 'white';
    counterDisplay.style.fontSize = '20px';
    counterDisplay.textContent = `Captured Shrimp: ${capturedShrimpCount}`;
    gameArea.appendChild(counterDisplay);

    net.style.left = `${netX}px`;
    net.style.top = `${netY}px`;

    const moveNet = (dx, dy) => {
        netX += dx;
        netY += dy;
        net.style.left = `${netX}px`;
        net.style.top = `${netY}px`;
        checkCollisions();
        checkWinCondition();
    };

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowUp': moveNet(0, -speed); break;
            case 'ArrowDown': moveNet(0, speed); break;
            case 'ArrowLeft': moveNet(-speed, 0); break;
            case 'ArrowRight': moveNet(speed, 0); break;
        }
    });

    gameArea.addEventListener('click', (e) => {
        const rect = gameArea.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        if (Math.abs(clickX - centerX) > Math.abs(clickY - centerY)) {
            if (clickX > centerX) moveNet(speed, 0); // Right
            else moveNet(-speed, 0); // Left
        } else {
            if (clickY > centerY) moveNet(0, speed); // Down
            else moveNet(0, -speed); // Up
        }
    });

    function positionShrimp(shrimp) {
        // Randomly position a new shrimp within the bounds of the game area
        shrimp.style.left = `${Math.random() * (gameArea.offsetWidth - shrimp.offsetWidth)}px`;
        shrimp.style.top = `${Math.random() * (gameArea.offsetHeight - shrimp.offsetHeight)}px`;
    }

    const spawnShrimp = () => {
        const shrimp = document.createElement('div');
        shrimp.classList.add('shrimp');
        gameArea.appendChild(shrimp);
        positionShrimp(shrimp); // Initial positioning

        // Move this shrimp
        const moveShrimp = () => {
            if (!shrimp.parentNode) return; // Stop moving if shrimp is removed
            let dx = Math.random() * 20 - 10;
            let dy = Math.random() * 20 - 10;
            
            let newX = Math.max(Math.min(shrimp.offsetLeft + dx, gameArea.offsetWidth - shrimp.offsetWidth), 0);
            let newY = Math.max(Math.min(shrimp.offsetTop + dy, gameArea.offsetHeight - shrimp.offsetHeight), 0);

            shrimp.style.left = `${newX}px`;
            shrimp.style.top = `${newY}px`;
            checkCollisions();
        };

        setInterval(moveShrimp, 1000);
    };

    // Generate initial shrimps and periodically add new ones...
    for (let i = 0; i < 5; i++) {
        spawnShrimp();
    }
    setInterval(spawnShrimp, 5000);

    const checkWinCondition = () => {
        if (document.querySelectorAll('.shrimp').length === 0) {
            alert('Congratulations! You have captured all the shrimps!');
            setTimeout(() => {
                window.location.href = 'https://www.tbergkvist.github.io';
            }, 100);
        }
    };

    const checkCollisions = () => {
        const netRect = net.getBoundingClientRect();
        const centerX = netRect.left + netRect.width / 2;
        const centerY = netRect.top + netRect.height / 2;

        document.querySelectorAll('.shrimp').forEach(shrimp => {
            const shrimpRect = shrimp.getBoundingClientRect();
            const shrimpCenterX = shrimpRect.left + shrimpRect.width / 2;
            const shrimpCenterY = shrimpRect.top + shrimpRect.height / 2;
            
            // Check if the shrimp's center is within the net's bounds
            if (Math.abs(shrimpCenterX - centerX) < netRect.width / 4 && Math.abs(shrimpCenterY - centerY) < netRect.height / 4) {
                shrimp.remove(); // Remove the shrimp on collision
                capturedShrimpCount++;
                counterDisplay.textContent = `Captured Shrimp: ${capturedShrimpCount}`; // Update counter
                checkWinCondition();
            }
        });
    };
});
