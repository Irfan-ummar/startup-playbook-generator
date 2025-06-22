# 🚀 Startup Playbook Generator

A Next.js application that generates comprehensive startup playbooks using AI. Simply input your business details and get a tailored playbook with market analysis, business strategy, financial planning, and more.

## ✨ Features

- **AI-Powered Playbooks**: Generate detailed startup strategies using Lyzr AI
- **Beautiful UI**: Dark-themed, responsive interface
- **Markdown Support**: Professional formatting with headings, lists, and emphasis  
- **Multiple Export Options**: Download as PDF, text, or copy to clipboard
- **Real-time Generation**: Fresh prompts generated from current form data
- **Comprehensive Sections**: Executive summary, market analysis, financial planning, risk assessment, and more

## 📋 Prerequisites

Before running this project, you need to have Node.js installed on your system.

### Installing Node.js

#### Option 1: Download from Official Website (Recommended)
1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version for your operating system
3. Run the installer and follow the setup wizard
4. Verify installation by opening terminal/command prompt and running:
   ```bash
   node --version
   npm --version
   ```

#### Option 2: Using Node Version Manager (NVM)
**For macOS/Linux:**
```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.bashrc

# Install latest LTS Node.js
nvm install --lts
nvm use --lts
```

**For Windows:**
1. Download NVM for Windows from [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)
2. Install and restart command prompt
3. Run:
   ```bash
   nvm install lts
   nvm use lts
   ```

## 🚀 Installation & Setup

1. **Clone or Download the Project**
   ```bash
   git clone <repository-url>
   cd startup-playbook-generator
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   This will install all required packages including:
   - Next.js
   - React
   - Tailwind CSS
   - TypeScript
   - react-markdown
   - jsPDF

3. **Verify Installation**
   Make sure all dependencies are installed correctly:
   ```bash
   npm list
   ```

## 🎯 Running the Application

### Development Mode
Start the development server with hot reloading:
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build
To create an optimized production build:
```bash
npm run build
npm start
```

### Other Available Commands
```bash
# Check for linting errors
npm run lint

# Run type checking
npx tsc --noEmit
```

## 🖥️ Using the Application

1. **Fill in Business Details**:
   - Business Name
   - Industry (select from dropdown)
   - Location (select from dropdown)
   - Team Size (select from dropdown)
   - Stage of Startup (select from dropdown)

2. **Provide Business Overview**:
   - Brief description of your business model and goals

3. **Describe Playbook Requirements**:
   - Specify what you want to achieve with the playbook

4. **Generate Playbook**:
   - Click "Generate Playbook" button
   - Wait for AI processing (usually 30-60 seconds)
   - View results in a beautiful markdown-formatted modal

5. **Export Options**:
   - **📄 Download as PDF**: Professional PDF document
   - **📝 Download as Text**: Plain text format
   - **📋 Copy to Clipboard**: Quick copying for other tools

## 🔧 Configuration

The application uses the Lyzr AI API for generating playbooks. The API configuration is already set up in the code, but you can modify the endpoint or parameters in `src/app/page.tsx` if needed.

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🛠️ Technology Stack

- **Framework**: Next.js 15.3.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **Markdown Rendering**: react-markdown
- **PDF Generation**: jsPDF
- **AI Integration**: Lyzr API

## 🚨 Troubleshooting

### Common Issues

**"npm: command not found"**
- Node.js is not installed or not in PATH
- Reinstall Node.js or restart terminal

**"Module not found" errors**
- Run `npm install` to install dependencies
- Delete `node_modules` and `package-lock.json`, then run `npm install`

**Port 3000 already in use**
- Kill the process using port 3000: `lsof -ti:3000 | xargs kill -9` (macOS/Linux)
- Or use a different port: `npm run dev -- -p 3001`

**TypeScript errors**
- Run `npm run build` to check for type errors
- Ensure all dependencies are properly installed

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify all form fields are filled correctly
3. Ensure stable internet connection for API calls
4. Check Node.js version compatibility (use LTS version)

## 📄 License

This project is for educational and development purposes.

---

**Made with ❤️ using Next.js and Lyzr AI**
