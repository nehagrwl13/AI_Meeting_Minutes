**# 🧠 MeetMind AI — Smart Meeting Minutes Generator**

**✨ **Turn Meeting Conversations into Clear, Actionable Minutes!****

MeetMind AI is an AI-powered meeting assistant that transforms meeting notes into structured, easy-to-understand minutes. It helps teams organize important discussions, capture decisions, track responsibilities, and manage action items efficiently.

With its **Action Item Tracker** and **Task Reminder System**, MeetMind AI makes it easier to follow up on tasks and stay organized after every meeting. 🚀

---

**## 🌟 Key Features**

**### 📝 1. AI-Powered Meeting Minutes**
- Generate structured meeting minutes from meeting notes.
- Create concise meeting summaries.
- Identify important decisions.
- Extract action items and responsibilities.
- Organize meeting information into readable sections.

**### 📌 2. Action Item Tracker**
- Convert extracted action items into trackable tasks.
- Assign task statuses:
  - 🟡 Pending
  - 🔵 In Progress
  - 🟢 Completed
- Update task status directly through the tracker.
- Keep action items organized and easy to review.

**### ⏰ 3. Smart Task Reminders**
- Identify overdue tasks using available deadline information.
- Highlight tasks that are due soon.
- Display reminder popups for overdue tasks.
- Close reminders using the **Got it** button or the **×** button.

**### 🛡️ 4. Responsible Information Handling**
- Display **Unspecified** when an action item's owner or deadline is missing.
- Avoid inventing names or deadlines that are not provided.
- Process exact date formats for automated deadline reminders.

**### ✏️ 5. Editable Meeting Minutes**
- Review and edit generated meeting minutes.
- Save your edits within the current application session.
- Copy meeting minutes for quick sharing.
- Download meeting minutes as a text file.
- Print or save minutes as PDF through the browser's print functionality.

**### 🎨 6. User-Friendly Interface**
- Clean and organized dashboard.
- Separate sections for summaries, decisions, and action items.
- Easy-to-use task status controls.
- Dedicated reminder panel and popup interface.

---

**## 🛠️ Technology Stack**

**| Technology | Purpose |**
|---|---|
| 🐍 Python | Backend application logic |
| 🌶️ Flask | Web server and API endpoints |
| 🌐 HTML5 | Frontend structure |
| 🎨 CSS3 | Styling and responsive interface |
| ⚡ JavaScript | Frontend interactions and task tracking |
| 🤖 Google Gemini API | AI-powered meeting minutes generation |
| 🚀 Render | Web application deployment |
| 📦 Git & GitHub | Version control and source code hosting |

---

**## ⚙️ How It Works**

1. 📝 Enter your meeting notes.
2. 🤖 Generate meeting minutes using AI.
3. 📄 Review the summary and important decisions.
4. 📌 View the extracted action items in the tracker.
5. 🔄 Update task statuses as work progresses.
6. ⏰ Check reminders for upcoming or overdue tasks.
7. 📥 Copy, download, or print your meeting minutes.

---

**## 📂 Project Structure**

```text
AI_Meeting_Minutes/
│
├── backend/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── .gitignore
└── README.md
```

---

**## 💻 Getting Started

### ✅ Prerequisites**

Make sure you have the following installed:

- Python 3
- pip
- Git
- A Google Gemini API key

**### 📥 1. Clone the Repository
**
```bash
git clone https://github.com/nehagrwl13/AI_Meeting_Minutes.git
```

**### 📁 2. Navigate to the Project**

```bash
cd AI_Meeting_Minutes
```

**### 🐍 3. Install Dependencies**

```bash
cd backend
pip install -r requirements.txt
```

**### 🔐 4. Configure Environment Variables**

Create a `.env` file inside the `backend` directory and configure your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=your_supported_gemini_model
```

Replace the placeholder values with your own valid credentials and supported model name.

⚠️ **Security Tip:** Never upload your `.env` file or expose your API key publicly on GitHub.

**### ▶️ 5. Run the Application**

From the `backend` directory, run:

```bash
python app.py
```

Open the local URL shown in your terminal, typically:

```text
http://127.0.0.1:5000
```

---

**## 🧪 Example Meeting Notes**

```text
Rahul will finish the website design by 2026-10-10.
Priya will test the login page by 2026-10-30.
The team decided to launch the website next week.
```

**### 📊 Expected Capabilities**

- Extract the website design and login testing action items.
- Identify task owners and explicit deadlines.
- Display task statuses in the Action Item Tracker.
- Flag an overdue task when its deadline has passed.
- Show reminders for tasks due soon.
- Preserve missing information as **Unspecified** rather than fabricating details.

*Actual AI output depends on the supplied notes and the model response.*

---

**## 🎯 Project Objectives**

- 🤖 Simplify meeting documentation using AI.
- ⏳ Reduce time spent preparing meeting minutes.
- 📌 Improve task visibility and accountability.
- 🔔 Make deadline follow-ups easier.
- 🛡️ Encourage accurate handling of missing task information.
- 💼 Support more organized and productive teamwork.

---

**## 🚀 Live Demo**

🌐 **Deployed Application:** [MeetMind AI on Render](https://ai-meeting-minutes.onrender.com)

📂 **GitHub Repository:** [AI_Meeting_Minutes](https://github.com/nehagrwl13/AI_Meeting_Minutes)

> Note: If the live demo URL differs from the one above, replace it with the exact URL shown in your Render dashboard.

---

**## 🔮 Future Enhancements**

- 👥 User authentication and personalized workspaces.
- 📅 Calendar integration for task deadlines.
- 📧 Email reminders and notifications.
- 📊 Task progress analytics and reporting.
- 💾 Persistent database storage for meetings and tasks.
- 📤 Additional export formats and sharing options.
- 🧠 Enhanced extraction and validation of action items.

---

**## 👩‍💻 Author

**Neha Agrawal****

🎓 AI-powered productivity project

🔗 GitHub: [@nehagrwl13](https://github.com/nehagrwl13)

---

**## ❤️ Acknowledgements**

- 🤖 Google Gemini for AI capabilities.
- 🐍 Flask for backend development.
- 🌐 Open-source tools and technologies.
- 🚀 Render for application hosting.

---

**⭐ **If you find this project interesting, consider giving the repository a star!****

💡 *MeetMind AI — Clear Meetings. Better Outcomes.*
