document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('newton-rings');
    const ctx = canvas.getContext('2d');
    const lensRadiusSlider = document.getElementById('radius');
    const lensRadiusValue = document.getElementById('radius-value');
    const lightWavelengthSlider = document.getElementById('wavelength');
    const lightWavelengthValue = document.getElementById('wavelength-value');
    const colorModeToggle = document.getElementById('color-mode');
    const resetButton = document.getElementById('reset-btn');
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    let lensCurvatureRadius = parseFloat(lensRadiusSlider.value);
    let lightWavelength = parseInt(lightWavelengthSlider.value);
    let useColorMode = colorModeToggle.checked;

    function updateDisplay() {
        lensRadiusValue.textContent = lensCurvatureRadius.toFixed(1);
        lightWavelengthValue.textContent = lightWavelength;
    }
    
    function getColorFromWavelength(wavelength) {
    let r, g, b;
    
    if (wavelength < 380) wavelength = 380;
    if (wavelength > 780) wavelength = 780;
    
    if (wavelength < 440) {
        r = -1.0 * (wavelength - 440) / 60;
        g = 0;
        b = 1.0;
    } 
    else if (wavelength < 490) {
        r = 0;
        g = (wavelength - 440) / 50;
        b = 1.0;
    } 
    else if (wavelength < 510) {
        r = 0;
        g = 1.0;
        b = -1.0 * (wavelength - 510) / 20;
    } 
    else if (wavelength < 580) {
        r = (wavelength - 510) / 70;
        g = 1.0;
        b = 0;
    } 
    else if (wavelength < 645) {
        r = 1.0;
        g = -1.0 * (wavelength - 645) / 65;
        b = 0;
    } 
    else {
        r = 1.0;
        g = 0;
        b = 0;
    }

    r = Math.min(1.0, Math.max(0, r));
    g = Math.min(1.0, Math.max(0, g));
    b = Math.min(1.0, Math.max(0, b));

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

    function drawRings() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const pixelsPerMeter = 50000;
        const maxVisibleRadius = 0.005;
        
        for (let x = 0; x < canvasWidth; x++) {
            for (let y = 0; y < canvasHeight; y++) {
                const dx = (x - centerX) / pixelsPerMeter;
                const dy = (y - centerY) / pixelsPerMeter;
                const distanceFromCenter = Math.sqrt(dx*dx + dy*dy);
                
                if (distanceFromCenter > maxVisibleRadius) continue;
                
                const airGapThickness = (distanceFromCenter * distanceFromCenter) / (2 * lensCurvatureRadius);
                
                const pathDifference = 2 * airGapThickness + (lightWavelength * 1e-9) / 2;
                
                const phaseDifference = (2 * Math.PI * pathDifference) / (lightWavelength * 1e-9);
                
                const brightness = Math.pow(Math.cos(phaseDifference / 2), 2);
                
                if (useColorMode) {
                    const color = getColorFromWavelength(lightWavelength);
                    ctx.fillStyle = `rgb(${Math.round(color.r * brightness)}, ${Math.round(color.g * brightness)}, ${Math.round(color.b * brightness)})`;
                } else {
                    const grayValue = Math.round(255 * brightness);
                    ctx.fillStyle = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
                }
                
                ctx.fillRect(x, y, 1, 1);
            }
        }
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX - 10, centerY);
        ctx.lineTo(centerX + 10, centerY);
        ctx.moveTo(centerX, centerY - 10);
        ctx.lineTo(centerX, centerY + 10);
        ctx.stroke();
    }
    
    lensRadiusSlider.addEventListener('input', function() {
        lensCurvatureRadius = parseFloat(this.value);
        updateDisplay();
        drawRings();
    });
    
    lightWavelengthSlider.addEventListener('input', function() {
        lightWavelength = parseInt(this.value);
        updateDisplay();
        drawRings();
    });
    
    colorModeToggle.addEventListener('change', function() {
        useColorMode = this.checked;
        drawRings();
    });
    
    resetButton.addEventListener('click', function() {
        lensRadiusSlider.value = 1;
        lightWavelengthSlider.value = 550;
        colorModeToggle.checked = true;
        
        lensCurvatureRadius = 1;
        lightWavelength = 550;
        useColorMode = true;
        
        updateDisplay();
        drawRings();
    });
    
    updateDisplay();
    drawRings();
});