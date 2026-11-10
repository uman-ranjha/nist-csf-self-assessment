var FUNCTIONS = [
  { id: "GV", name: "Govern", desc: "How cybersecurity is led, planned, and overseen.",
    next: ["Write down who owns cybersecurity decisions, and review that ownership every year.", "Set two or three clear cybersecurity goals for the next year, and check progress every quarter.", "Add a cybersecurity risk check to major business decisions, including new vendors."],
    questions: [
      "Does leadership set clear cybersecurity goals and assign someone responsible for them?",
      "Are cybersecurity policies written down and shared with staff?",
      "Do you review cybersecurity risks when making business decisions?",
      "Do you check that suppliers and vendors meet your security expectations?"
    ] },
  { id: "ID", name: "Identify", desc: "What you have, what matters most, and what risks you face.",
    next: ["Make a list of devices, software, and data, and keep it up to date.", "Mark your most important systems and data, and note who can access them.", "List your top five cybersecurity risks, and review that list every quarter."],
    questions: [
      "Do you keep an up to date list of devices, software, and data?",
      "Do you know what your most important data and systems are?",
      "Do you identify and rank your cybersecurity risks?",
      "Do you know who is allowed to access what?"
    ] },
  { id: "PR", name: "Protect", desc: "The safeguards that stop incidents before they happen.",
    next: ["Turn on multi-factor authentication for email, remote access, and admin accounts.", "Set a regular patching schedule, and check that updates are actually installed.", "Test restoring a backup, so you know it works before you need it."],
    questions: [
      "Do people use strong passwords and multi-factor authentication?",
      "Do you keep software updated and patched?",
      "Do you limit access to only what people need for their job?",
      "Do you back up important data and test restoring it?"
    ] },
  { id: "DE", name: "Detect", desc: "How you spot unusual activity and possible attacks.",
    next: ["Pick the logs that matter most, and review them on a set schedule.", "Give staff one clear way to report suspicious emails and activity.", "Write down what normal activity looks like, so unusual activity stands out."],
    questions: [
      "Do you monitor systems and logs for unusual activity?",
      "Do you have a clear way for people to report suspicious emails or activity?",
      "Do you review alerts promptly?",
      "Do you know what normal activity looks like, so you can spot problems?"
    ] },
  { id: "RS", name: "Respond", desc: "What you do when an incident happens.",
    next: ["Write a one-page incident response plan with names, phone numbers, and first steps.", "Practice the plan with a short tabletop exercise, even if it is only 30 minutes.", "After an incident, write down what happened, what you fixed, and what you will change."],
    questions: [
      "Do you have a written plan for responding to a cybersecurity incident?",
      "Do you know who to call and what to do first when something happens?",
      "Do you practice your incident response plan?",
      "Do you record what happened and what you fixed after an incident?"
    ] },
  { id: "RC", name: "Recover", desc: "How you get back to normal after an incident.",
    next: ["Write a recovery plan that lists which systems come back first.", "Test the recovery plan at least once a year.", "After recovery, update the plan based on what you learned."],
    questions: [
      "Do you have a plan to restore systems and data after an incident?",
      "Do you test your recovery plan?",
      "Do you update your plans after an incident based on what you learned?",
      "Do you communicate with staff and customers during and after recovery?"
    ] }
];

var SCALE = [
  { value: 0, label: "0 - Not implemented" },
  { value: 1, label: "1 - Partially implemented" },
  { value: 2, label: "2 - Largely implemented" },
  { value: 3, label: "3 - Fully implemented" },
  { value: 4, label: "4 - Fully implemented and reviewed" },
  { value: "na", label: "N/A" }
];

function levelFor(pct) {
  if (pct === null) return "Not scored";
  if (pct < 25) return "Needs work";
  if (pct < 50) return "Developing";
  if (pct < 75) return "Largely in place";
  return "Strong";
}

function scoreFunction(answers) {
  var answered = answers.filter(function (a) { return a !== null && a !== undefined && a !== "na"; });
  if (answered.length === 0) return null;
  var sum = answered.reduce(function (t, v) { return t + Number(v); }, 0);
  var avg = sum / answered.length;
  return Math.round((avg / 4) * 100);
}

function scoreAll(allAnswers) {
  var perFunction = FUNCTIONS.map(function (fn, i) {
    return { id: fn.id, name: fn.name, pct: scoreFunction(allAnswers[i]) };
  });
  var scored = perFunction.filter(function (f) { return f.pct !== null; });
  var overall = null;
  if (scored.length > 0) {
    var sum = scored.reduce(function (t, f) { return t + f.pct; }, 0);
    overall = Math.round(sum / scored.length);
  }
  return { perFunction: perFunction, overall: overall };
}

function buildReport(org, dateStr, result) {
  var lines = [];
  lines.push("NIST CSF 2.0 Self-Assessment Report");
  lines.push("Organization: " + org);
  lines.push("Date: " + dateStr);
  lines.push("");
  if (result.overall === null) {
    lines.push("No questions were answered. Answer at least one question to get a score.");
    return lines.join("\n");
  }
  lines.push("Overall score: " + result.overall + "% (" + levelFor(result.overall) + ")");
  lines.push("");
  lines.push("Scores by function:");
  result.perFunction.forEach(function (f) {
    lines.push("- " + f.name + ": " + (f.pct === null ? "Not scored" : f.pct + "% (" + levelFor(f.pct) + ")"));
  });
  lines.push("");
  var weak = result.perFunction.filter(function (f) { return f.pct !== null && f.pct < 50; })
    .sort(function (a, b) { return a.pct - b.pct; });
  if (weak.length === 0) {
    lines.push("Weakest areas: none below 50%. Your lowest score is a good place to start improving.");
  } else {
    lines.push("Weakest areas (below 50%): " + weak.map(function (f) { return f.name + " (" + f.pct + "%)"; }).join(", "));
  }
  lines.push("");
  lines.push("Recommended next steps:");
  var targets = weak.length > 0 ? weak : result.perFunction.filter(function (f) { return f.pct !== null; }).sort(function (a, b) { return a.pct - b.pct; }).slice(0, 2);
  targets.forEach(function (f) {
    var fn = FUNCTIONS.filter(function (x) { return x.id === f.id; })[0];
    lines.push("");
    lines.push(f.name + " (" + f.pct + "%):");
    fn.next.forEach(function (step) { lines.push("- " + step); });
  });
  lines.push("");
  lines.push("Note: This is a self-assessment based on self-reported answers. It does not prove compliance, and it does not replace a formal audit.");
  return lines.join("\n");
}

function renderQuestions() {
  var container = document.getElementById("questions");
  FUNCTIONS.forEach(function (fn, fi) {
    var section = document.createElement("section");
    var h = document.createElement("h2");
    h.textContent = fn.id + " - " + fn.name;
    section.appendChild(h);
    var d = document.createElement("p");
    d.textContent = fn.desc;
    section.appendChild(d);
    fn.questions.forEach(function (q, qi) {
      var div = document.createElement("div");
      div.className = "question";
      var p = document.createElement("p");
      p.textContent = (qi + 1) + ". " + q;
      div.appendChild(p);
      var opts = document.createElement("div");
      opts.className = "options";
      SCALE.forEach(function (s) {
        var label = document.createElement("label");
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "q-" + fi + "-" + qi;
        input.value = String(s.value);
        label.appendChild(input);
        label.appendChild(document.createTextNode(" " + s.label));
        opts.appendChild(label);
      });
      div.appendChild(opts);
      section.appendChild(div);
    });
    container.appendChild(section);
  });
}

function readAnswers() {
  return FUNCTIONS.map(function (fn, fi) {
    return fn.questions.map(function (q, qi) {
      var checked = document.querySelector('input[name="q-' + fi + '-' + qi + '"]:checked');
      if (!checked) return null;
      return checked.value === "na" ? "na" : Number(checked.value);
    });
  });
}

function calculate() {
  var org = document.getElementById("orgName").value.trim() || "Example Organization";
  var answers = readAnswers();
  var answeredCount = 0;
  answers.forEach(function (row) { row.forEach(function (a) { if (a !== null) answeredCount++; }); });
  if (answeredCount === 0) {
    alert("Please answer at least one question before calculating your results.");
    return;
  }
  var result = scoreAll(answers);
  var dateStr = new Date().toLocaleDateString();
  document.getElementById("results").hidden = false;
  document.getElementById("overallLine").textContent =
    "Overall score: " + result.overall + "% (" + levelFor(result.overall) + ") based on " + answeredCount + " answered questions.";
  var chart = document.getElementById("chart");
  chart.innerHTML = "";
  result.perFunction.forEach(function (f) {
    var row = document.createElement("div");
    row.className = "bar-row";
    var label = document.createElement("div");
    label.className = "bar-label";
    label.textContent = f.name + ": " + (f.pct === null ? "Not scored" : f.pct + "% (" + levelFor(f.pct) + ")");
    row.appendChild(label);
    var track = document.createElement("div");
    track.className = "bar-track";
    var fill = document.createElement("div");
    fill.className = "bar-fill" + (f.pct !== null && f.pct < 50 ? " weak" : f.pct !== null && f.pct < 75 ? " mid" : "");
    fill.style.width = (f.pct === null ? 0 : f.pct) + "%";
    fill.textContent = f.pct === null ? "" : f.pct + "%";
    track.appendChild(fill);
    row.appendChild(track);
    chart.appendChild(row);
  });
  var weak = result.perFunction.filter(function (f) { return f.pct !== null && f.pct < 50; })
    .sort(function (a, b) { return a.pct - b.pct; });
  document.getElementById("weakLine").textContent = weak.length === 0
    ? "No function scored below 50%. Start with your lowest score."
    : "Focus first on: " + weak.map(function (f) { return f.name + " (" + f.pct + "%)"; }).join(", ") + ".";
  var reportText = buildReport(org, dateStr, result);
  document.getElementById("report").textContent = reportText;
  window.__lastReport = reportText;
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

function downloadReport() {
  var text = window.__lastReport || "Calculate your results first.";
  var blob = new Blob([text], { type: "text/plain" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "nist-csf-self-assessment-report.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

document.addEventListener("DOMContentLoaded", function () {
  renderQuestions();
  document.getElementById("calcBtn").addEventListener("click", calculate);
  document.getElementById("downloadBtn").addEventListener("click", downloadReport);
  document.getElementById("printBtn").addEventListener("click", function () { window.print(); });
  document.getElementById("resetBtn").addEventListener("click", function () {
    document.querySelectorAll('input[type="radio"]').forEach(function (r) { r.checked = false; });
    document.getElementById("results").hidden = true;
  });
});

// Exposed for local testing in Node, no effect in the browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { scoreFunction: scoreFunction, scoreAll: scoreAll, levelFor: levelFor, buildReport: buildReport };
}
