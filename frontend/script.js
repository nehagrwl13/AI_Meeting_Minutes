const fields = ["summary", "decisions", "actions", "responsibilities"];
const notesInput = document.getElementById("meetingNotes");
const charCount = document.getElementById("charCount");
const statusElement = document.getElementById("status");
const generateBtn = document.getElementById("generateBtn");
const resultSection = document.getElementById("resultSection");
const editBtn = document.getElementById("editBtn");
const editHint = document.getElementById("editHint");

let isEditing = false;
let previousValues = {};

notesInput.addEventListener("input", () => {
  charCount.textContent = `${notesInput.value.length.toLocaleString()} characters`;
});

async function generateMinutes() {
  const notes = notesInput.value.trim();
  if (!notes) {
    showStatus("Please enter your meeting notes first.", "error");
    notesInput.focus();
    return;
  }

  generateBtn.disabled = true;
  generateBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating Minutes...';
  showStatus("AI is analyzing your meeting notes...", "loading");
  resultSection.classList.add("hidden");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes })
    });

    let data;
    try {
      data = await response.json();
    } catch {
      throw new Error("The server returned an unexpected response. Check that Flask is running.");
    }
    if (!response.ok) throw new Error(data.error || "Generation failed. Please try again.");

    fields.forEach((field) => {
      document.getElementById(field).value = data[field] || "Not mentioned in the meeting notes.";
    });
    renderActionTracker(data.actions);
    setEditing(false);
    resultSection.classList.remove("hidden");
    showStatus("Meeting minutes generated successfully!", "success");
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    showStatus(`Error: ${error.message || "Could not connect to the server."}`, "error");
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Meeting Minutes <i class="fa-solid fa-arrow-right btn-arrow"></i>';
  }
}

function showStatus(message, type = "") {
  statusElement.textContent = message;
  const colors = { success: "#159568", error: "#dc2626", loading: "#7047eb" };
  statusElement.style.color = colors[type] || "#777b94";
}

function setEditing(enabled) {
  isEditing = enabled;
  document.querySelectorAll(".result-textarea").forEach((field) => {
    field.disabled = !enabled;
    field.classList.toggle("editing", enabled);
  });
  if (enabled) {
    editBtn.className = "btn btn-edit";
    editBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Changes';
    editHint.innerHTML = "Editing is on. Select <strong>Save Changes</strong> to keep your edits or <strong>Cancel</strong> to undo them.";
  } else {
    editBtn.className = "btn btn-edit";
    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit Minutes';
    editHint.innerHTML = "Want to make changes? Select <strong>Edit Minutes</strong> first.";
    removeCancelButton();
  }
}

function toggleEditing() {
  if (!isEditing) {
    previousValues = {};
    document.querySelectorAll(".result-textarea").forEach((field) => {
      previousValues[field.id] = field.value;
    });
    setEditing(true);
    addCancelButton();
    showStatus("Editing mode enabled. Update the minutes above.", "loading");
    document.getElementById("summary").focus();
    return;
  }

  // Save the current text in the fields; changes are already reflected in the export actions.
  previousValues = {};
  setEditing(false);
  showStatus("Your edited minutes have been saved and are ready to copy or download.", "success");
}

function addCancelButton() {
  if (document.getElementById("cancelEditBtn")) return;
  const cancelBtn = document.createElement("button");
  cancelBtn.id = "cancelEditBtn";
  cancelBtn.className = "btn btn-quiet";
  cancelBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Cancel';
  cancelBtn.addEventListener("click", cancelEditing);
  editBtn.insertAdjacentElement("afterend", cancelBtn);
}

function removeCancelButton() {
  document.getElementById("cancelEditBtn")?.remove();
}

function cancelEditing() {
  fields.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(previousValues, field)) {
      document.getElementById(field).value = previousValues[field];
    }
  });
  previousValues = {};
  setEditing(false);
  showStatus("Changes discarded. The previous minutes have been restored.", "loading");
}

function getMinutesText() {
  const sections = [
    ["MEETING SUMMARY", "summary"],
    ["KEY DECISIONS", "decisions"],
    ["ACTION ITEMS", "actions"],
    ["RESPONSIBLE PERSONS & DEADLINES", "responsibilities"]
  ];
  let text = "MEETMIND AI — MEETING MINUTES\n" + "=".repeat(38) + "\n\n";
  sections.forEach(([heading, id]) => {
    text += `${heading}\n${"-".repeat(heading.length)}\n${document.getElementById(id).value.trim() || "Not mentioned."}\n\n`;
  });
  return text;
}

async function copyMinutes() {
  if (isEditing) {
    showStatus("Please save or cancel your edits before copying.", "error");
    return;
  }
  const text = getMinutesText();
  try {
    await navigator.clipboard.writeText(text);
    showStatus("Meeting minutes copied to clipboard.", "success");
  } catch {
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.select();
    const copied = document.execCommand("copy");
    temp.remove();
    showStatus(copied ? "Meeting minutes copied to clipboard." : "Copy failed. Please select and copy the text manually.", copied ? "success" : "error");
  }
}

function downloadTXT() {
  if (isEditing) {
    showStatus("Please save or cancel your edits before downloading.", "error");
    return;
  }
  downloadBlob(getMinutesText(), "MeetMind_Meeting_Minutes.txt", "text/plain;charset=utf-8");
  showStatus("TXT file download started.", "success");
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadPDF() {
  if (isEditing) {
    showStatus("Please save or cancel your edits before saving the PDF.", "error");
    return;
  }
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    showStatus("Please allow pop-ups for this page to save as PDF.", "error");
    return;
  }

  const doc = printWindow.document;
  doc.title = "MeetMind AI — Meeting Minutes";
  const style = doc.createElement("style");
  style.textContent = `
    body{font-family:Arial,sans-serif;padding:34px;color:#24243d;max-width:900px;margin:auto}
    h1{color:#5430d4;border-bottom:2px solid #7047eb;padding-bottom:14px;font-size:25px}
    h2{color:#4e3ba3;margin:27px 0 9px;font-size:15px}
    pre{white-space:pre-wrap;overflow-wrap:anywhere;font-family:Arial,sans-serif;font-size:12px;line-height:1.7;margin:0}
    .note{color:#777;font-size:10px;margin-top:25px;border-top:1px solid #ddd;padding-top:12px}
    @media print{body{padding:8px}h2{break-after:avoid}pre{orphans:3;widows:3}}
  `;
  doc.head.appendChild(style);
  const title = doc.createElement("h1");
  title.textContent = "MeetMind AI — Meeting Minutes";
  doc.body.appendChild(title);
  const sections = [
    ["Meeting Summary", "summary"],
    ["Key Decisions", "decisions"],
    ["Action Items", "actions"],
    ["Responsible Persons & Deadlines", "responsibilities"]
  ];
  sections.forEach(([heading, id]) => {
    const h2 = doc.createElement("h2");
    h2.textContent = heading;
    const content = doc.createElement("pre");
    content.textContent = document.getElementById(id).value.trim() || "Not mentioned.";
    doc.body.appendChild(h2);
    doc.body.appendChild(content);
  });
  const note = doc.createElement("p");
  note.className = "note";
  note.textContent = "Generated with MeetMind AI. In the print dialog, choose ‘Save as PDF’ as the destination.";
  doc.body.appendChild(note);
  printWindow.focus();
  setTimeout(() => printWindow.print(), 250);
}

function clearAll() {
  notesInput.value = "";
  charCount.textContent = "0 characters";
  fields.forEach((field) => { document.getElementById(field).value = ""; });
  previousValues = {};
  setEditing(false);
  resultSection.classList.add("hidden");
  statusElement.textContent = "";
  notesInput.focus();
}

function renderActionTracker(actions) {
  const tracker = document.getElementById("actionTracker");
  tracker.innerHTML = "";

  
if (!Array.isArray(actions) || actions.length === 0) {
  tracker.textContent = "No action items found.";
  renderTaskReminders([]);
  return;
}

renderTaskReminders(actions);


  actions.forEach((action, index) => {
    const card = document.createElement("div");
    card.className = "tracker-card";

    const task = document.createElement("p");
    task.textContent = action.task || "Unspecified task";

    const owner = document.createElement("p");
    owner.textContent = `Owner: ${action.owner || "Unspecified"}`;

    
    const deadline = document.createElement("p");
    const deadlineText = action.deadline || "Unspecified";
    deadline.textContent = `Deadline: ${deadlineText}`;

    const parsedDeadline = Date.parse(deadlineText);
    const hasExactDate = /^\d{4}-\d{2}-\d{2}$/.test(deadlineText);
    const isOverdue =
      hasExactDate &&
      !Number.isNaN(parsedDeadline) &&
      parsedDeadline < new Date().setHours(0, 0, 0, 0) &&
      action.status !== "Completed";

    if (isOverdue) {
      const overdueLabel = document.createElement("strong");
      overdueLabel.textContent = "OVERDUE";
      overdueLabel.style.color = "#dc2626";
      card.appendChild(overdueLabel);
    }


    const status = document.createElement("select");
    ["Pending", "In Progress", "Completed"].forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      status.appendChild(option);
    });

    status.value = ["Pending", "In Progress", "Completed"].includes(action.status)
      ? action.status
      : "Pending";

    
status.addEventListener("change", () => {
  action.status = status.value;
  renderTaskReminders(actions);
});


    const statusLabel = document.createElement("label");
    statusLabel.textContent = "Status: ";
    statusLabel.appendChild(status);

    card.append(task, owner, deadline, statusLabel);
    tracker.appendChild(card);
  });
}


function renderTaskReminders(actions) {
  const reminderList = document.getElementById("reminderList");
  reminderList.innerHTML = "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminders = [];

  actions.forEach((action) => {
    if (action.status === "Completed") return;

    const deadline = action.deadline || "Unspecified";

    // Only process exact dates; don't guess dates from words like Friday.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(deadline)) return;

    const dueDate = new Date(`${deadline}T00:00:00`);
    if (Number.isNaN(dueDate.getTime())) return;

    const daysLeft = Math.round(
      (dueDate.getTime() - today.getTime()) / 86400000
    );

    if (daysLeft < 0) {
      reminders.push({
        type: "overdue",
        message: `Overdue: ${action.task || "Unspecified task"} — deadline ${deadline}`
      });
    } else if (daysLeft <= 1) {
      reminders.push({
        type: "upcoming",
        message: `Due soon: ${action.task || "Unspecified task"} — deadline ${deadline}`
      });
    }
  });

  if (reminders.length === 0) {
    reminderList.textContent =
      "No upcoming or overdue reminders for tasks with exact dates.";
    return;
  }

const overdueReminder = reminders.find(
  (reminder) => reminder.type === "overdue"
);

if (overdueReminder) {
  showReminderPopup(overdueReminder.message);
}

  reminders.forEach((reminder) => {
    const item = document.createElement("div");
    item.className = `reminder-item ${reminder.type}`;
    item.textContent = reminder.message;
    reminderList.appendChild(item);
  });
}


function showReminderPopup(message) {
  const modal = document.getElementById("reminderModal");
  const messageElement = document.getElementById("reminderModalMessage");

  if (!modal || !messageElement) return;

  messageElement.textContent = message;
  modal.style.display = "";
  modal.classList.remove("hidden");
}



function closeReminderPopup() {
  const modal = document.getElementById("reminderModal");

  if (modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
  }
}


document.getElementById("closeReminderModal")?.addEventListener(
  "click",
  closeReminderPopup
);



document.getElementById("dismissReminderModal")?.addEventListener(
  "click",
  closeReminderPopup
);

