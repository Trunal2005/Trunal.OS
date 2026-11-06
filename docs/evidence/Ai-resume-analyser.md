<div align="center">

# 🤖 AI Resume Analyser

### Powered by Google Gemini AI

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.x-black?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**An intelligent resume analysis tool that evaluates your resume against job descriptions, provides compatibility scores, and delivers actionable improvement suggestions — all powered by Google's Gemini Generative AI.**

[🚀 Getting Started](#️-installation) • [📖 Usage](#️-usage) • [✨ Features](#-features) • [🛠 Tech Stack](#️-tech-stack)

---

</div>

## ✨ Features

| Feature                         | Description                                                       |
| ------------------------------- | ----------------------------------------------------------------- |
| 🧠 **AI-Powered Analysis**      | Uses Google Gemini Pro to intelligently evaluate resume content   |
| 📄 **PDF Parsing**              | Robustly extracts and processes text from uploaded PDF resumes    |
| 🎯 **Job Description Matching** | Tailored analysis based on a specific job description you provide |
| 📊 **Compatibility Score**      | Estimates how well your resume aligns with the target role        |
| 🌐 **Clean Web Interface**      | Intuitive, responsive UI built with Flask and HTML/CSS            |
| 🔑 **Dynamic API Key Input**    | Securely enter your API key via the UI or environment variables   |
| 🎭 **Demo Mode**                | Try the full UI experience with mock data — no API key required   |

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td><strong>Backend</strong></td>
    <td>Python 3.8+, Flask, Werkzeug</td>
  </tr>
  <tr>
    <td><strong>AI / ML</strong></td>
    <td>Google Gemini Pro (<code>google-generativeai</code>)</td>
  </tr>
  <tr>
    <td><strong>PDF Processing</strong></td>
    <td><code>pypdf</code></td>
  </tr>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>HTML5, CSS3</td>
  </tr>
  <tr>
    <td><strong>Config</strong></td>
    <td><code>python-dotenv</code></td>
  </tr>
</table>

---

## 📋 Prerequisites

Before getting started, make sure you have:

- **Python 3.8+** installed on your machine
- A **Google Cloud Project** with the [Gemini API](https://ai.google.dev/) enabled _(needed for real analysis; Demo Mode works without it)_

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Trunal2005/ai-resume-analyser.git
cd ai-resume-analyser
```

### 2. Create a Virtual Environment _(Recommended)_

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Your API Key _(Optional)_

Create a `.env` file in the root directory:

```env
GOOGLE_API_KEY=your_actual_api_key_here
```

> 💡 **Tip:** If you don't have an API key yet, you can still explore the full UI using **Demo Mode** (just leave the API key field blank).

---

## ▶️ Usage

### Start the Application

```bash
python main.py
```

The app will automatically open in your browser at `http://127.0.0.1:5000`.

### Analyze Your Resume

1. **Upload** your resume as a PDF file.
2. _(Optional)_ **Paste** the target Job Description for tailored analysis.
3. **Enter** your Google API Key (skip this to use Demo Mode).
4. Click **Analyze Resume** and get instant AI-powered feedback!

> **Note:** Leaving the API key field blank activates **Mock Analysis (Demo Mode)** — perfect for testing the UI without a key.

---

## 📁 Project Structure

```
ai-resume-analyser/
│
├── main.py              # Flask app entry point & route handling
├── Analyse_pdf.py       # PDF text extraction & AI analysis logic
├── requirements.txt     # Python dependencies
├── .env                 # API key configuration (not committed)
├── .gitignore
│
├── templates/
│   └── index.html       # Frontend UI template
│
├── uploads/             # Temporary storage for uploaded PDFs
├── verify_mock.py       # Mock data for Demo Mode testing
└── verify_pdf.py        # PDF verification utilities
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add some amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [Trunal Patil](https://github.com/Trunal2005)

⭐ **Star this repo** if you found it helpful!

</div>
