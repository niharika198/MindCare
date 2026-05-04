# MindCare Project Setup Guide

Follow these steps to set up and run the MindCare project on a new laptop after cloning it from GitHub.

## 1. Prerequisites
Ensure you have the following installed on your machine:
*   **Node.js**: [Download here](https://nodejs.org/) (LTS version recommended).
*   **Python 3.x**: [Download here](https://www.python.org/downloads/). Ensure you check the box **"Add Python to PATH"** during installation.

---

## 2. Clone the Repository
Open your terminal (Command Prompt, PowerShell, or Bash) and run:
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd MindCare
```

---

## 3. Backend Setup
Navigate to the `backend` directory and install the necessary dependencies for both Node.js and Python.

1.  **Install Node.js dependencies**:
    ```bash
    cd backend
    npm install
    ```

2.  **Install Python dependencies**:
    The backend uses a Python script for AI predictions. You need `joblib` and `scikit-learn`.
    ```bash
    pip install -r requirements.txt
    ```
    *Note: If `pip` is not recognized, try `python -m pip install -r requirements.txt`.*

3.  **Start the Backend Server**:
    ```bash
    node server.js
    ```
    The server should now be running on `http://localhost:5001`.

---

## 4. Frontend Setup
Open a **new terminal window**, navigate to the `frontend` directory, and install the React dependencies.

1.  **Install Node.js dependencies**:
    ```bash
    cd frontend
    npm install
    ```

2.  **Start the Frontend Application**:
    ```bash
    npm start
    ```
    The application will automatically open in your browser at `http://localhost:3000`.

---

## 5. Troubleshooting
*   **Port Conflict**: If port 5001 or 3000 is already in use, you might see an error. Ensure no other instances of the app are running.
*   **Python Errors**: If the assessment fails to show a result, ensure Python is in your system environment variables and you can run `python --version` from any terminal.
*   **Anonymous Login**: Remember that this version uses **Username** and **Password** only. 

---
**Happy Coding! 🌿**
