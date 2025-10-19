# Sepsis Early Warning Dashboard (Educational v1)

This project is an educational web-based dashboard designed to teach healthcare students and professionals about the early warning signs of sepsis using the qSOFA (Quick Sequential Organ Failure Assessment) score.

The dashboard simulates different patient scenarios to demonstrate how changes in vital signs and lab results can indicate a rising risk of sepsis.

## ✨ Features

- **Dynamic Status Updates:** The main status card changes color and text based on the calculated risk.
- **qSOFA Score Calculation:** Automatically calculates and displays the qSOFA score based on patient vitals.
- **Clear Data Visualization:** Presents patient information, vitals, and lab results in easy-to-read cards.
- **Interactive Scenarios:** Buttons allow users to load different patient profiles (Normal, At-Risk, Sepsis Alert) to see the dashboard in action.
- **Heart Rate Trend:** Includes a simple chart to visualize the patient's heart rate over the last few hours.
- **Modern Tech Stack:** Built with HTML, CSS, and JavaScript, and bundled with Webpack.

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

### Running the Application

- **For Development:**
  This command starts a live development server. It will automatically open the dashboard in your browser and reload the page whenever you make changes to the source files.

  ```bash
  npm run start
  ```

- **For Production:**
  This command builds an optimized version of the application, ready for deployment. The optimized files will be placed in the `/dist` directory.
  ```bash
  npm run build
  ```
