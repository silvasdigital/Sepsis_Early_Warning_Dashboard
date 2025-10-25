# Sepsis Early Warning Dashboard (Educational v1)

This project is an educational web-based dashboard designed to teach healthcare students and professionals about the early warning signs of sepsis using the qSOFA (Quick Sequential Organ Failure Assessment) score.

The dashboard simulates different patient scenarios to demonstrate how changes in vital signs and lab results can indicate a rising risk of sepsis.

## ✨ Features (v1.1)

- **Dynamic Status Updates:** The main status card changes color and text based on the calculated risk (Normal, At-Risk, Sepsis Alert).
- **qSOFA Score Calculation:** Automatically calculates and displays the qSOFA score based on patient vitals.
- **JSON Patient Import:** Load an entire list of patient scenarios from a single `.json` file.
- **Patient Selector:** Once a file is imported, a dropdown menu appears, allowing you to easily switch between patient cases.
- **Data Visualization:** Includes a line chart to visualize the patient's heart rate trend over time.
- **Responsive Design:** The layout is fully responsive and works cleanly on both mobile and desktop screens.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) and npm (which comes with Node.js) installed on your system.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd sepsis-dashboard
    ```

2.  **Install dependencies:**
    This command will install all the necessary packages defined in `package.json`.
    ```bash
    npm install
    ```

## 🏃‍♂️ Running the Application

- **For Development:**
  This command starts a live development server. It will automatically open the dashboard in your browser.

  ```bash
  npm run start
  ```

- **For Production:**
  This command builds an optimized version of the application, ready for deployment. The optimized files will be placed in the `/dist` directory.
  ```bash
  npm run build
  ```

## 📋 How to Use the Dashboard

1.  **Create your `patients.json` file:**
    Create a file named `patients.json` (or any name you like) on your computer. You can save it to your Desktop, Downloads, or anywhere you can easily find it. It must follow this format:

    ```json
    {
      "patients": [
        {
          "info": { "id": "P001", "name": "Patient Name", ... },
          "vitals": { "hr": 75, "rr": 16, ... },
          "labs": { "wbc": 8.5, ... },
          "hrHistory": [78, 76, 75, 77, 75]
        },
        {
          "info": { "id": "P002", "name": "Another Patient", ... },
          "vitals": { ... },
          "labs": { ... },
          "hrHistory": [ ... ]
        }
      ]
    }
    ```

2.  **Load the Patient File:**
    - In the "Simulation Controls" card at the bottom of the dashboard, click the **"Choose File"** button.
    - Select the `patients.json` file you just created.
    - Click the **"Load Patients"** button.

3.  **Select a Patient:**
    A new "Select Patient" card will appear at the top of the dashboard. Use the dropdown menu to switch between the different patient scenarios you loaded. The dashboard will update instantly.
