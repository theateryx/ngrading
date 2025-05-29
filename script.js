document.addEventListener('DOMContentLoaded', () => {
    const sugarInput = document.getElementById('sugarInput');
    const satFatInput = document.getElementById('satFatInput');
    const volumeInput = document.getElementById('volumeInput');
    const hasSweetener = document.getElementById('hasSweetener');
    const calculateBtn = document.getElementById('calculateBtn');
    const nutriGradeOutput = document.getElementById('nutriGradeOutput');
    const gradeLetterDisplay = nutriGradeOutput.querySelector('.grade-letter');
    const sugarPercentageDisplay = nutriGradeOutput.querySelector('.sugar-percentage');
    const gradeExplanation = document.getElementById('gradeExplanation');

    // NIP elements
    const nipSection = document.getElementById('nipSection');
    const nipPanel = document.getElementById('nipPanel');
    const nipEnergy = document.getElementById('nipEnergy');
    const nipProtein = document.getElementById('nipProtein');
    const nipTotalFat = document.getElementById('nipTotalFat');
    const nipSatFat = document.getElementById('nipSatFat');
    const nipTransFat = document.getElementById('nipTransFat');
    const nipCarbohydrate = document.getElementById('nipCarbohydrate');
    const nipTotalSugar = document.getElementById('nipTotalSugar');
    const nipFibre = document.getElementById('nipFibre');
    const nipSodium = document.getElementById('nipSodium');
    const exportNIPImageBtn = document.getElementById('exportNIPImage');
    const printNIPBtn = document.getElementById('printNIP');


    calculateBtn.addEventListener('click', calculateNutriGrade);

    function calculateNutriGrade() {
        const totalSugar = parseFloat(sugarInput.value);
        const saturatedFat = parseFloat(satFatInput.value);
        const volume = parseFloat(volumeInput.value);
        const containsSweetener = hasSweetener.checked;

        // Input validation
        if (isNaN(totalSugar) || isNaN(saturatedFat) || isNaN(volume) || totalSugar < 0 || saturatedFat < 0 || volume <= 0) {
            alert('Please enter valid positive numbers for all fields.');
            return;
        }

        // Calculate per 100ml
        const sugarPer100ml = (totalSugar / volume) * 100;
        const satFatPer100ml = (saturatedFat / volume) * 100;

        let sugarGrade = '';
        let satFatGrade = '';
        let nutriGrade = '';
        let explanation = '';

        // Determine sugar grade
        if (sugarPer100ml <= 1) {
            sugarGrade = 'A';
        } else if (sugarPer100ml > 1 && sugarPer100ml <= 5) {
            sugarGrade = 'B';
        } else if (sugarPer100ml > 5 && sugarPer100ml <= 10) {
            sugarGrade = 'C';
        } else {
            sugarGrade = 'D';
        }

        // Determine saturated fat grade
        if (satFatPer100ml <= 0.7) {
            satFatGrade = 'A';
        } else if (satFatPer100ml > 0.7 && satFatPer100ml <= 1.2) {
            satFatGrade = 'B';
        } else if (satFatPer100ml > 1.2 && satFatPer100ml <= 2.8) {
            satFatGrade = 'C';
        } else {
            satFatGrade = 'D';
        }

        // Determine overall Nutri-Grade (lowest grade prevails)
        const grades = ['A', 'B', 'C', 'D'];
        const gradeIndexSugar = grades.indexOf(sugarGrade);
        const gradeIndexSatFat = grades.indexOf(satFatGrade);
        
        // If sweetener is present and sugar grade is A, it defaults to B
        if (containsSweetener && sugarGrade === 'A') {
             nutriGrade = 'B';
             explanation = 'Grade is B due to presence of sweetener, even with low sugar and saturated fat content.';
        } else {
            // The "worst" (highest index) grade determines the overall Nutri-Grade
            const finalGradeIndex = Math.max(gradeIndexSugar, gradeIndexSatFat);
            nutriGrade = grades[finalGradeIndex];
            
            // Explanation based on the determining factor
            if (gradeIndexSugar > gradeIndexSatFat) {
                explanation = `Grade is determined by sugar content (${sugarGrade}).`;
            } else if (gradeIndexSatFat > gradeIndexSugar) {
                explanation = `Grade is determined by saturated fat content (${satFatGrade}).`;
            } else {
                explanation = `Grade is determined by both sugar and saturated fat content (${nutriGrade}).`;
            }
        }


        // Update Nutri-Grade display
        nutriGradeOutput.className = 'nutri-grade-box grade-' + nutriGrade;
        gradeLetterDisplay.textContent = nutriGrade;
        // Round sugar percentage to nearest whole figure
        sugarPercentageDisplay.textContent = `${Math.round(sugarPer100ml * 100 / 100)}% Sugar`;
        gradeExplanation.textContent = explanation;

        // Populate and show NIP
        populateNIP(totalSugar, saturatedFat, volume);
        nipSection.style.display = 'block'; // Show NIP section
    }

    function populateNIP(totalSugar, saturatedFat, volume) {
        // These values are placeholders. In a real-world scenario, you'd calculate
        // these based on a detailed recipe or ingredient database.
        // For demonstration, we'll use some simple estimations or just display the inputs.

        const per100mlFactor = 100 / volume;

        // Display actual input values per serving (not per 100ml for the main display)
        // and per 100ml for NIP values
        nipEnergy.textContent = `${(Math.random() * 50 + 20).toFixed(0)} kcal`; // Placeholder
        nipProtein.textContent = `${(Math.random() * 5).toFixed(1)} g`; // Placeholder
        nipTotalFat.textContent = `${(saturatedFat + Math.random() * 0.5).toFixed(1)} g`; // Placeholder, total fat >= sat fat
        nipSatFat.textContent = `${saturatedFat.toFixed(1)} g`;
        nipTransFat.textContent = `${(Math.random() * 0.1).toFixed(1)} g`; // Placeholder, usually very low
        nipCarbohydrate.textContent = `${(totalSugar + Math.random() * 2).toFixed(1)} g`; // Placeholder, carb >= sugar
        nipTotalSugar.textContent = `${totalSugar.toFixed(1)} g`;
        nipFibre.textContent = `${(Math.random() * 2).toFixed(1)} g`; // Placeholder
        nipSodium.textContent = `${(Math.random() * 50 + 5).toFixed(0)} mg`; // Placeholder

        // Adjust NIP for 'Per 100ml Serving'
        nipEnergy.textContent = `${(parseFloat(nipEnergy.textContent) * per100mlFactor).toFixed(0)} kcal`;
        nipProtein.textContent = `${(parseFloat(nipProtein.textContent) * per100mlFactor).toFixed(1)} g`;
        nipTotalFat.textContent = `${(parseFloat(nipTotalFat.textContent) * per100mlFactor).toFixed(1)} g`;
        nipSatFat.textContent = `${(parseFloat(nipSatFat.textContent) * per100mlFactor).toFixed(1)} g`;
        nipTransFat.textContent = `${(parseFloat(nipTransFat.textContent) * per100mlFactor).toFixed(1)} g`;
        nipCarbohydrate.textContent = `${(parseFloat(nipCarbohydrate.textContent) * per100mlFactor).toFixed(1)} g`;
        nipTotalSugar.textContent = `${(parseFloat(nipTotalSugar.textContent) * per100mlFactor).toFixed(1)} g`;
        nipFibre.textContent = `${(parseFloat(nipFibre.textContent) * per100mlFactor).toFixed(1)} g`;
        nipSodium.textContent = `${(parseFloat(nipSodium.textContent) * per100mlFactor).toFixed(0)} mg`;

        // Round sugar and saturated fat percentages to the nearest whole figure for display
        const sugarPercentageForDisplay = Math.round((totalSugar / volume) * 100);
        const satFatPercentageForDisplay = Math.round((saturatedFat / volume) * 100);
        // You might want to display these somewhere more prominent in the NIP if required by specific guidelines
        // For now, they are part of the Nutri-Grade box.
    }

    exportNIPImageBtn.addEventListener('click', () => {
        html2canvas(nipPanel, {
            scale: 2, // Increase resolution for better quality
            useCORS: true // Important for handling images from other origins if any
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'Nutritional_Information_Panel.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

    printNIPBtn.addEventListener('click', () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Nutritional Information Panel</title>');
        printWindow.document.write('<link rel="stylesheet" href="style.css">'); // Link CSS for printing
        printWindow.document.write('<style>');
        printWindow.document.write(`
            body { font-family: 'Roboto', sans-serif; margin: 20px; color: #333; }
            .nip-panel { border: 2px solid #90caf9; padding: 20px; border-radius: 8px; background-color: #ffffff; box-shadow: none; margin: 0 auto; width: 100%; max-width: 500px; }
            .nip-title { font-weight: bold; font-size: 1.4em; text-align: center; margin-bottom: 5px; color: #1976d2; }
            .nip-serving { font-size:
