import '../css/styles.css';
import Chart from 'chart.js/auto';

// --- MOCK PATIENT DATA ---
const patientData = {
  normal: {
    info: { id: 'P001', age: 55, gender: 'Male' },
    vitals: { hr: 75, rr: 16, sbp: 120, temp: 37.0, ams: false },
    labs: { wbc: 8.5, lactate: 1.1, crp: 5 },
    hrHistory: [78, 76, 75, 77, 75]
  },
  atRisk: {
    info: { id: 'P002', age: 68, gender: 'Female' },
    vitals: { hr: 95, rr: 21, sbp: 105, temp: 37.9, ams: false },
    labs: { wbc: 12.5, lactate: 1.8, crp: 45 },
    hrHistory: [90, 92, 95, 93, 95]
  },
  sepsisAlert: {
    info: { id: 'P003', age: 76, gender: 'Male' },
    vitals: { hr: 110, rr: 25, sbp: 90, temp: 38.5, ams: true },
    labs: { wbc: 18.2, lactate: 4.2, crp: 150 },
    hrHistory: [100, 105, 108, 112, 110]
  }
};

// --- DOM ELEMENT SELECTORS ---
const elements = {
  statusCard: document.getElementById('status-card'),
  statusText: document.getElementById('status-text'),
  statusAdvice: document.getElementById('status-advice'),
  patientId: document.getElementById('patient-id'),
  patientAge: document.getElementById('patient-age'),
  patientGender: document.getElementById('patient-gender'),
  hr: document.getElementById('hr'),
  rr: document.getElementById('rr'),
  sbp: document.getElementById('sbp'),
  temp: document.getElementById('temp'),
  wbc: document.getElementById('wbc'),
  lactate: document.getElementById('lactate'),
  crp: document.getElementById('crp'),
  qsofaScore: document.getElementById('qsofa-score'),
  qsofaRr: document.getElementById('qsofa-rr').querySelector('.indicator'),
  qsofaSbp: document.getElementById('qsofa-sbp').querySelector('.indicator'),
  qsofaAms: document.getElementById('qsofa-ams').querySelector('.indicator')
};

let hrChart; // To hold the chart instance

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

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
  // Load the normal patient by default
  updateDashboard(patientData.normal);

  // Set up buttons to load different scenarios
  document.getElementById('btn-normal').addEventListener('click', () => updateDashboard(patientData.normal));
  document.getElementById('btn-at-risk').addEventListener('click', () => updateDashboard(patientData.atRisk));
  document.getElementById('btn-sepsis').addEventListener('click', () => updateDashboard(patientData.sepsisAlert));
});
