import '../css/styles.css';
import Chart from 'chart.js/auto';

// --- STATE ---
let patientList = []; // Will hold patients from the imported file
let hrChart; // To hold the chart instance

// --- DOM ELEMENT SELECTORS ---
const elements = {
  // Status
  statusCard: document.getElementById('status-card'),
  statusText: document.getElementById('status-text'),
  statusAdvice: document.getElementById('status-advice'),
  // Patient Info
  patientId: document.getElementById('patient-id'),
  patientName: document.getElementById('patient-name'),
  patientAge: document.getElementById('patient-age'),
  patientGender: document.getElementById('patient-gender'),
  // Vitals
  hr: document.getElementById('hr'),
  rr: document.getElementById('rr'),
  sbp: document.getElementById('sbp'),
  temp: document.getElementById('temp'),
  // Labs
  wbc: document.getElementById('wbc'),
  lactate: document.getElementById('lactate'),
  crp: document.getElementById('crp'),
  // qSOFA
  qsofaScore: document.getElementById('qsofa-score'),
  qsofaRr: document.getElementById('qsofa-rr').querySelector('.indicator'),
  qsofaSbp: document.getElementById('qsofa-sbp').querySelector('.indicator'),
  qsofaAms: document.getElementById('qsofa-ams').querySelector('.indicator'),
  // Controls
  importFile: document.getElementById('import-file'),
  importBtn: document.getElementById('import-btn'),
  importStatus: document.getElementById('import-status'),
  // Patient List
  patientListCard: document.getElementById('patient-list-card'),
  patientSelectorContainer: document.getElementById('patient-selector-container')
};

// --- FUNCTIONS ---

/**
 * Calculates the qSOFA score based on vital signs.
 * @param {object} vitals - Patient's vital signs.
 * @returns {number} The calculated qSOFA score.
 */
function calculateQSOFA(vitals) {
  let score = 0;
  if (vitals.rr >= 22) score++;
  if (vitals.sbp <= 100) score++;
  if (vitals.ams) score++;
  return score;
}

/**
 * Updates the entire dashboard UI with data from a patient object.
 * @param {object} patient - The patient data object.
 */
function updateDashboard(patient) {
  // Update Patient Info
  elements.patientId.textContent = patient.info.id;
  elements.patientName.textContent = patient.info.name || '--'; // Add name
  elements.patientAge.textContent = patient.info.age;
  elements.patientGender.textContent = patient.info.gender;

  // Update Vitals
  elements.hr.textContent = patient.vitals.hr;
  elements.rr.textContent = patient.vitals.rr;
  elements.sbp.textContent = patient.vitals.sbp;
  elements.temp.textContent = patient.vitals.temp.toFixed(1);

  // Update Labs
  elements.wbc.textContent = patient.labs.wbc;
  elements.lactate.textContent = patient.labs.lactate;
  elements.crp.textContent = patient.labs.crp;

  // Calculate and display qSOFA score
  const score = calculateQSOFA(patient.vitals);
  elements.qsofaScore.textContent = score;

  // Update qSOFA criteria indicators
  elements.qsofaRr.classList.toggle('positive', patient.vitals.rr >= 22);
  elements.qsofaSbp.classList.toggle('positive', patient.vitals.sbp <= 100);
  elements.qsofaAms.classList.toggle('positive', patient.vitals.ams);

  // Update Overall Status
  elements.statusCard.className = 'card'; // Reset classes
  if (score >= 2) {
    elements.statusCard.classList.add('status-alert');
    elements.statusText.textContent = 'Sepsis Alert!';
    elements.statusAdvice.textContent = 'High risk of poor outcome. Immediate medical intervention required.';
  } else if (score === 1) {
    elements.statusCard.classList.add('status-watch');
    elements.statusText.textContent = 'At-Risk / Watch';
    elements.statusAdvice.textContent = 'Patient shows some warning signs. Monitor closely.';
  } else {
    elements.statusCard.classList.add('status-normal');
    elements.statusText.textContent = 'Normal';
    elements.statusAdvice.textContent = 'All vital signs and labs are within normal ranges.';
  }

  // Update Heart Rate Chart
  updateChart(patient.hrHistory);
}

/**
 * Creates or updates the heart rate chart.
 * @param {number[]} data - Array of historical heart rate data.
 */
function updateChart(data) {
  const ctx = document.getElementById('hrChart').getContext('2d');
  const labels = ['-4h', '-3h', '-2h', '-1h', 'Now'];

  if (hrChart) {
    hrChart.data.datasets[0].data = data;
    hrChart.update();
  } else {
    hrChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Heart Rate Trend (bpm)',
            data: data,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            suggestedMin: 50,
            suggestedMax: 140
          }
        }
      }
    });
  }
}

/**
 * Populates the patient selector dropdown when a file is loaded.
 */
function populatePatientSelector() {
  elements.patientListCard.style.display = 'block';
  elements.patientSelectorContainer.innerHTML = ''; // Clear existing

  const label = document.createElement('label');
  label.setAttribute('for', 'patient-select');
  label.textContent = 'Select a patient case to view:';

  const select = document.createElement('select');
  select.id = 'patient-select';

  patientList.forEach((patient, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${patient.info.id} - ${patient.info.name || 'Unnamed Patient'}`;
    select.appendChild(option);
  });

  // Add event listener to the new select dropdown
  select.addEventListener('change', (e) => {
    const selectedIndex = e.target.value;
    updateDashboard(patientList[selectedIndex]);
  });

  elements.patientSelectorContainer.appendChild(label);
  elements.patientSelectorContainer.appendChild(select);
}

/**
 * Handles the file import process.
 */
function handleFileImport() {
  const file = elements.importFile.files[0];
  if (!file) {
    setImportStatus('Please select a file first.', 'error');
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.patients || !Array.isArray(data.patients)) {
        throw new Error('Invalid JSON format. Expected a "patients" array.');
      }

      patientList = data.patients;
      setImportStatus(`Successfully imported ${patientList.length} patients.`, 'success');
      populatePatientSelector();

      // Load the first patient by default
      if (patientList.length > 0) {
        updateDashboard(patientList[0]);
      }
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      setImportStatus(`Error: ${error.message}`, 'error');
      patientList = [];
    }
  };

  reader.onerror = () => {
    setImportStatus('Failed to read the file.', 'error');
  };

  reader.readAsText(file);
}

/**
 * Sets the status message for the file import.
 * @param {string} message - The message to display.
 * @param {'success' | 'error'} type - The type of message.
 */
function setImportStatus(message, type) {
  elements.importStatus.textContent = message;
  elements.importStatus.className = `import-status ${type}`;
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
  // Set up the import button
  elements.importBtn.addEventListener('click', handleFileImport);

  // Initialize chart with empty data
  updateChart([0, 0, 0, 0, 0]);
});
