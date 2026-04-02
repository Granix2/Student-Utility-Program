// Global variables
let cgpaSubjects = [];
let physicsFormulas = {}; // Store formulas with preserved function references

// Menu functions
function showCalculator(type) {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById(type).classList.remove('hidden');
    // Hide any previous results
    hideAllResults();
}

function backToMenu() {
    document.querySelectorAll('.calculator').forEach(calc => calc.classList.add('hidden'));
    document.getElementById('menu').classList.remove('hidden');
    // Clear results and hide result displays
    hideAllResults();
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
    // Clear CGPA inputs
    document.getElementById('cgpaInputs').innerHTML = '';
    // Clear physics formulas
    document.getElementById('physicsFormulas').innerHTML = '';
    // Reset unit converter
    showUnitInputs();
}

function hideAllResults() {
    document.querySelectorAll('.result-display').forEach(result => {
        result.classList.add('hidden');
        result.classList.remove('error-message');
    });
}

function showResult(elementId, message, isError = false) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.classList.remove('hidden');
    if (isError) {
        element.classList.add('error-message');
    } else {
        element.classList.remove('error-message');
    }
}

function exitProgram() {
    if (confirm('Are you sure you want to exit the Student Utility Program?')) {
        window.close();
    }
}

// Percentage Calculator
function calculatePercentage() {
    const obtained = parseFloat(document.getElementById('obtainedMarks').value);
    const total = parseFloat(document.getElementById('totalMarks').value);

    if (isNaN(obtained) || isNaN(total)) {
        showResult('percentageResult', 'Please enter valid numbers', true);
        return;
    }

    if (total === 0) {
        showResult('percentageResult', 'Error: Total marks cannot be zero', true);
    } else {
        const percentage = (obtained / total) * 100;
        showResult('percentageResult', `Percentage: ${percentage.toFixed(2)}%`);
    }
}

// CGPA Calculator
function setupCGPAInputs() {
    const numSubjects = parseInt(document.getElementById('numSubjects').value);
    const inputsDiv = document.getElementById('cgpaInputs');

    if (isNaN(numSubjects) || numSubjects <= 0 || numSubjects > 20) {
        showResult('cgpaResult', 'Please enter a valid number of subjects (1-20)', true);
        return;
    }

    inputsDiv.innerHTML = '';
    cgpaSubjects = [];

    for (let i = 0; i < numSubjects; i++) {
        const subjectDiv = document.createElement('div');
        subjectDiv.className = 'subject-input';
        subjectDiv.innerHTML = `
            <input type="number" placeholder="Grade Points (Subject ${i + 1})" step="0.01" min="0" max="10">
            <input type="number" placeholder="Credit Hours (Subject ${i + 1})" min="1" max="10">
        `;
        inputsDiv.appendChild(subjectDiv);
    }

    hideAllResults();
}

function calculateCGPA() {
    const inputs = document.querySelectorAll('#cgpaInputs input');
    let totalGradePoints = 0;
    let totalCreditHours = 0;
    let validInputs = true;

    for (let i = 0; i < inputs.length; i += 2) {
        const gradePoints = parseFloat(inputs[i].value);
        const creditHours = parseFloat(inputs[i + 1].value);

        if (isNaN(gradePoints) || isNaN(creditHours) || gradePoints < 0 || creditHours <= 0) {
            validInputs = false;
            break;
        }

        totalGradePoints += gradePoints * creditHours;
        totalCreditHours += creditHours;
    }

    if (!validInputs) {
        showResult('cgpaResult', 'Please enter valid grade points and credit hours for all subjects', true);
        return;
    }

    if (totalCreditHours === 0) {
        showResult('cgpaResult', 'Error: Total credit hours cannot be zero', true);
    } else {
        const cgpa = totalGradePoints / totalCreditHours;
        showResult('cgpaResult', `Your CGPA: ${cgpa.toFixed(2)}`);
    }
}

// Fibonacci Generator
function generateFibonacci() {
    const n = parseInt(document.getElementById('fibTerms').value);

    if (isNaN(n) || n <= 0 || n > 100) {
        showResult('fibResult', 'Please enter a positive number (1-100)', true);
        return;
    }

    let fib = [0, 1];
    for (let i = 2; i < n; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }

    if (n === 1) fib = [0];
    const sequence = fib.slice(0, n).join(', ');
    showResult('fibResult', `Fibonacci sequence (${n} terms): ${sequence}`);
}

// Factorial Calculator
function calculateFactorial() {
    const n = parseInt(document.getElementById('factNum').value);

    if (isNaN(n) || n < 0) {
        showResult('factResult', 'Please enter a non-negative integer', true);
        return;
    }

    if (n === 0 || n === 1) {
        showResult('factResult', `Factorial of ${n} is 1`);
    } else {
        let fact = 1;
        for (let i = 2; i <= n; i++) {
            fact *= i;
        }
        showResult('factResult', `Factorial of ${n} is ${fact}`);
    }
}

// Unit Converter
function showUnitInputs() {
    const unitType = document.getElementById('unitType').value;
    const inputsDiv = document.getElementById('unitInputs');

    switch (unitType) {
        case 'temp':
            inputsDiv.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <label for="tempFrom">From</label>
                        <select id="tempFrom">
                            <option value="celsius">Celsius (°C)</option>
                            <option value="fahrenheit">Fahrenheit (°F)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="tempValue">Value</label>
                        <input type="number" id="tempValue" placeholder="Enter temperature">
                    </div>
                </div>
            `;
            break;
        case 'length':
            inputsDiv.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <label for="lengthFrom">From</label>
                        <select id="lengthFrom">
                            <option value="meters">Meters (m)</option>
                            <option value="feet">Feet (ft)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="lengthValue">Value</label>
                        <input type="number" id="lengthValue" placeholder="Enter length">
                    </div>
                </div>
            `;
            break;
        case 'weight':
            inputsDiv.innerHTML = `
                <div class="form-row">
                    <div class="form-group">
                        <label for="weightFrom">From</label>
                        <select id="weightFrom">
                            <option value="kg">Kilograms (kg)</option>
                            <option value="lbs">Pounds (lbs)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="weightValue">Value</label>
                        <input type="number" id="weightValue" placeholder="Enter weight">
                    </div>
                </div>
            `;
            break;
    }
}

function convertUnit() {
    const unitType = document.getElementById('unitType').value;
    let result = '';

    switch (unitType) {
        case 'temp':
            const tempValue = parseFloat(document.getElementById('tempValue').value);
            const tempFrom = document.getElementById('tempFrom').value;

            if (isNaN(tempValue)) {
                showResult('unitResult', 'Please enter a valid temperature value', true);
                return;
            }

            if (tempFrom === 'celsius') {
                result = `${tempValue}°C = ${(tempValue * 9/5 + 32).toFixed(2)}°F`;
            } else {
                result = `${tempValue}°F = ${((tempValue - 32) * 5/9).toFixed(2)}°C`;
            }
            break;
        case 'length':
            const lengthValue = parseFloat(document.getElementById('lengthValue').value);
            const lengthFrom = document.getElementById('lengthFrom').value;

            if (isNaN(lengthValue)) {
                showResult('unitResult', 'Please enter a valid length value', true);
                return;
            }

            if (lengthFrom === 'meters') {
                result = `${lengthValue} meters = ${(lengthValue * 3.28084).toFixed(2)} feet`;
            } else {
                result = `${lengthValue} feet = ${(lengthValue / 3.28084).toFixed(2)} meters`;
            }
            break;
        case 'weight':
            const weightValue = parseFloat(document.getElementById('weightValue').value);
            const weightFrom = document.getElementById('weightFrom').value;

            if (isNaN(weightValue)) {
                showResult('unitResult', 'Please enter a valid weight value', true);
                return;
            }

            if (weightFrom === 'kg') {
                result = `${weightValue} kg = ${(weightValue * 2.20462).toFixed(2)} lbs`;
            } else {
                result = `${weightValue} lbs = ${(weightValue / 2.20462).toFixed(2)} kg`;
            }
            break;
    }

    showResult('unitResult', result);
}

// Initialize unit converter
document.addEventListener('DOMContentLoaded', function() {
    const unitTypeSelect = document.getElementById('unitType');
    if (unitTypeSelect) {
        unitTypeSelect.addEventListener('change', showUnitInputs);
        showUnitInputs();
    }
});

// Also try immediate initialization for compatibility
if (document.readyState === 'loading') {
    // DOM is still loading, wait for it
    document.addEventListener('DOMContentLoaded', showUnitInputs);
} else {
    // DOM is already loaded
    const unitTypeSelect = document.getElementById('unitType');
    if (unitTypeSelect) {
        showUnitInputs();
    }
}

// Physics Calculator
function showPhysicsFormulas() {
    const category = document.getElementById('physicsCategory').value;
    const formulasDiv = document.getElementById('physicsFormulas');

    let formulas = [];

    switch (category) {
        case 'kinematics':
            formulas = [
                { name: 'Final Velocity: v = u + at', inputs: ['u (initial velocity)', 'a (acceleration)', 't (time)'], calc: (u, a, t) => u + a * t },
                { name: 'Displacement: s = ut + ½at²', inputs: ['u (initial velocity)', 'a (acceleration)', 't (time)'], calc: (u, a, t) => u * t + 0.5 * a * t * t },
                { name: 'Final Velocity: v = √(u² + 2as)', inputs: ['u (initial velocity)', 'a (acceleration)', 's (displacement)'], calc: (u, a, s) => Math.sqrt(u * u + 2 * a * s) }
            ];
            break;
        case 'dynamics':
            formulas = [
                { name: 'Force: F = ma', inputs: ['m (mass)', 'a (acceleration)'], calc: (m, a) => m * a },
                { name: 'Weight: W = mg', inputs: ['m (mass)', 'g (gravity)'], calc: (m, g) => m * g }
            ];
            break;
        case 'energy':
            formulas = [
                { name: 'Kinetic Energy: KE = ½mv²', inputs: ['m (mass)', 'v (velocity)'], calc: (m, v) => 0.5 * m * v * v },
                { name: 'Potential Energy: PE = mgh', inputs: ['m (mass)', 'g (gravity)', 'h (height)'], calc: (m, g, h) => m * g * h }
            ];
            break;
        case 'electricity':
            formulas = [
                { name: 'Voltage: V = IR', inputs: ['I (current)', 'R (resistance)'], calc: (I, R) => I * R },
                { name: 'Power: P = VI', inputs: ['V (voltage)', 'I (current)'], calc: (V, I) => V * I }
            ];
            break;
    }

    // Store formulas in global object with preserved function references
    physicsFormulas = {};
    formulas.forEach((formula, index) => {
        physicsFormulas[index] = formula;
    });

    formulasDiv.innerHTML = formulas.map((formula, index) => `
        <div class="formula-card">
            <div class="formula-title">${formula.name}</div>
            <div class="formula-inputs">
                ${formula.inputs.map(input => `<input type="number" placeholder="${input}" class="physics-input-${index}">`).join('')}
            </div>
            <button onclick="calculatePhysics(${index})" class="btn btn-primary">
                <i class="fas fa-calculator"></i> Calculate
            </button>
            <div id="physics-result-${index}" class="result-display hidden"></div>
        </div>
    `).join('');
}

function calculatePhysics(index) {
    const formula = physicsFormulas[index];
    if (!formula) {
        showResult(`physics-result-${index}`, 'Error: Formula not found', true);
        return;
    }

    const inputs = document.querySelectorAll(`.physics-input-${index}`);
    const values = Array.from(inputs).map(input => parseFloat(input.value));

    if (values.some(isNaN)) {
        showResult(`physics-result-${index}`, 'Please enter valid numbers for all inputs', true);
        return;
    }

    const result = formula.calc(...values);
    showResult(`physics-result-${index}`, `Result: ${result.toFixed(2)}`);
}

// Number Tools
function checkPrime() {
    const num = parseInt(document.getElementById('numToolInput').value);

    if (isNaN(num) || num < 0) {
        showResult('numToolResult', 'Please enter a valid non-negative integer', true);
        return;
    }

    if (num <= 1) {
        showResult('numToolResult', `${num} is not a prime number`);
        return;
    }

    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            showResult('numToolResult', `${num} is not a prime number`);
            return;
        }
    }
    showResult('numToolResult', `${num} is a prime number`);
}

function checkEvenOdd() {
    const num = parseInt(document.getElementById('numToolInput').value);

    if (isNaN(num)) {
        showResult('numToolResult', 'Please enter a valid integer', true);
        return;
    }

    if (num % 2 === 0) {
        showResult('numToolResult', `${num} is even`);
    } else {
        showResult('numToolResult', `${num} is odd`);
    }
}

function reverseNumber() {
    const num = document.getElementById('numToolInput').value;

    if (!num) {
        showResult('numToolResult', 'Please enter a number', true);
        return;
    }

    const reversed = num.split('').reverse().join('');
    showResult('numToolResult', `Reversed: ${reversed}`);
}