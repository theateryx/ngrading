document.addEventListener('DOMContentLoaded', () => {
    // --- Inputs for Nutri-Grade Calculation ---
    const sugarInput = document.getElementById('sugarInput');
    const satFatInput = document.getElementById('satFatInput');
    const volumeInput = document.getElementById('volumeInput');
    const hasSweetener = document.getElementById('hasSweetener');

    // --- New Inputs for Detailed NIP ---
    const energyInput = document.getElementById('energyInput');
    const proteinInput = document.getElementById('proteinInput');
    const totalFatInput = document.getElementById('totalFatInput');
    const transFatInput = document.getElementById('transFatInput');
    const carbInput = document.getElementById('carbInput');
    const fibreInput = document.getElementById('fibreInput');
    const sodiumInput = document.getElementById('sodiumInput');

    // --- Output Elements ---
    const calculateBtn = document.getElementById('calculateBtn');
    const nutriGradeOutput = document.getElementById('nutriGradeOutput');
    const gradeLetterDisplay = nutriGradeOutput.querySelector('.grade-letter');
    const sugarPercentageDisplay = nutriGradeOutput.querySelector('.sugar-percentage');
    const gradeExplanation = document.getElementById('gradeExplanation');

    // --- NIP Elements ---
    const nipSection = document.getElementById('nipSection');
    const nipPanel = document.getElementById('nipPanel');
    const nipEnergy = document.getElementById('nipEnergy');
    const nipProtein = document.getElementById('nipProtein');
    const nipTotalFat = document.getElementById('nipTotalFat');
    const nipSatFat = document.getElementById('nipSatFat');
    const nipTransFat = document.getElementById('nipTransFat');
    const nipCarbohydrate = document.getElementById('nipCarbohydrate');
    const nipTotalSugar = document.getElementById('nipTotalSugar'); // This is the total sugar from above
    const nipFibre = document.getElementById('nipFibre');
    const nipSodium = document.getElementById('nipSodium');
    const exportNIPImageBtn = document.getElementById('exportNIPImage');
    const printNIPBtn = document.getElementById('printNIP');


    calculateBtn.addEventListener('click', calculateNutriGrade);

    function calculateNutriGrade() {
        // Get values for Nutri-Grade calculation
        const totalSugar = parseFloat(sugarInput.value);
        const saturatedFat = parseFloat(satFatInput.value);
        const volume = parseFloat(volumeInput.value);
        const containsSweetener = hasSweetener.checked;

        // Get values for Detailed NIP
        const totalEnergy = parseFloat(energyInput.value);
        const totalProtein = parseFloat(proteinInput.value);
        const totalFat = parseFloat(totalFatInput.value);
        const transFat = parseFloat(transFatInput.value);
        const totalCarbohydrate = parseFloat(carbInput.value);
        const dietaryFibre = parseFloat(fibreInput.value);
        const totalSodium = parseFloat(sodiumInput.value);


        // Input validation for all fields
        if (isNaN(totalSugar) || isNaN(saturatedFat) || isNaN(volume) || totalSugar < 0 || saturatedFat < 0 || volume <= 0 ||
            isNaN(totalEnergy) || totalEnergy < 0 ||
            isNaN(totalProtein) || totalProtein < 0 ||
            isNaN(totalFat) || totalFat < 0 ||
            isNaN(transFat) || transFat < 0 ||
            isNaN(totalCarbohydrate) || totalCarbohydrate < 0 ||
            isNaN(dietaryFibre) || dietaryFibre < 0 ||
            isNaN(totalSodium) || totalSodium < 0
        ) {
            alert('Please enter valid positive numbers for all fields.');
            return;
        }

        // Calculate per 100ml values for Nutri-Grade (rounded to 2 decimal places for robustness)
        const sugarPer100ml = parseFloat(((totalSugar / volume) * 100).toFixed(2));
        const satFatPer100ml = parseFloat(((saturatedFat / volume) * 100).toFixed(2));

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

        // Sweetener rule: If beverage would be A, but contains sweetener, it becomes B.
        if (containsSweetener && sugarGrade === 'A' && satFatGrade === 'A') {
             nutriGrade = 'B';
             explanation = 'Grade is B due to presence of sweetener, as it would otherwise be Grade A.';
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
        // Round sugar percentage to nearest whole figure for display on grade box
        sugarPercentageDisplay.textContent = `${Math.round(sugarPer100ml)}% Sugar`;
        gradeExplanation.textContent = explanation;

        // Populate and show NIP with actual values
        populateNIP(totalSugar, saturatedFat, volume, totalEnergy, totalProtein, totalFat, transFat, totalCarbohydrate, dietaryFibre, totalSodium);
        nipSection.style.display = 'block'; // Show NIP section
    }

    // Function to populate the Nutritional Information Panel
    function populateNIP(totalSugar, saturatedFat, volume, totalEnergy, totalProtein, totalFat, transFat, totalCarbohydrate, dietaryFibre, totalSodium) {
        const per100mlFactor = 100 / volume;

        // Calculate and display per 100ml values for NIP
        // Energy typically rounded to whole kcal (0 decimal places)
        nipEnergy.textContent = `${(totalEnergy * per100mlFactor).toFixed(0)} kcal`;
        // Other nutrients typically rounded to one decimal place
        nipProtein.textContent = `${(totalProtein * per100mlFactor).toFixed(1)} g`;
        nipTotalFat.textContent = `${(totalFat * per100mlFactor).toFixed(1)} g`;
        nipSatFat.textContent = `${(saturatedFat * per100mlFactor).toFixed(1)} g`;
        nipTransFat.textContent = `${(transFat * per100mlFactor).toFixed(1)} g`;
        nipCarbohydrate.textContent = `${(totalCarbohydrate * per100mlFactor).toFixed(1)} g`;
        nipTotalSugar.textContent = `${(totalSugar * per100mlFactor).toFixed(1)} g`;
        nipFibre.textContent = `${(dietaryFibre * per100mlFactor).toFixed(1)} g`;
        // Sodium typically rounded to whole mg (0 decimal places)
        nipSodium.textContent = `${(totalSodium * per100mlFactor).toFixed(0)} mg`;
    }

    // Export NIP as Image functionality
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

    // Print NIP functionality
    printNIPBtn.addEventListener('click', () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Nutritional Information Panel</title>');
        printWindow.document.write('<link rel="stylesheet" href="style.css">'); // Link CSS for printing
        printWindow.document.write('<style>');
        printWindow.document.write(`
            body { font-family: 'Roboto', sans-serif; margin: 20px; color: #333; }
            .nip-panel { border: 2px solid #90caf9; padding: 20px; border-radius: 8px; background-color: #ffffff; box-shadow: none; margin: 0 auto; width: 100%; max-width: 500px; }
            .nip-title { font-weight: bold; font-size: 1.4em; text-align: center; margin-bottom: 5px; color: #1976d2; }
            .nip-serving { font-size: 0.9em; text-align: center; margin-bottom: 15px; color: #64b5f6; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
            th, td { border-bottom: 1px solid #e0e0e0; padding: 10px 0; text-align: left; }
            th { font-weight: bold; color: #3f51b5; }
            td { color: #555; }
            .nip-disclaimer { font-size: 0.8em; color: #777; text-align: center; margin-top: 15px; }
        `); // Corrected closing of the backtick string and style tag
        printWindow.document.write('</style></head><body>');
        printWindow.document.write('<div class="nip-panel">'); // Use the same class for styling
        printWindow.document.write(nipPanel.innerHTML); // Copy the content of the existing NIP
        printWindow.document.write('</div></body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    });

}); // Closing for DOMContentLoaded
