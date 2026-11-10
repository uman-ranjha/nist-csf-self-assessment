# NIST CSF 2.0 Self-Assessment

I built this as a single web page you can open and use right away. It asks 24 plain-language questions, four for each of the six NIST Cybersecurity Framework 2.0 functions, then scores each function, points at your weakest areas, and lets you download a plain-language report.

## Try it

Open `index.html` in a browser. Or try it live: https://uman-ranjha.github.io/nist-csf-self-assessment/

## How it works

Six functions: Govern, Identify, Protect, Detect, Respond, Recover. Four questions each, 24 in total.

You score each question 0 to 4. Or N/A, if it does not apply. N/A answers do not count toward the score at all.

- 0: Not implemented
- 1: Partially implemented
- 2: Largely implemented
- 3: Fully implemented
- 4: Fully implemented and reviewed

A function score is the average of its answered questions, shown as a percentage out of 4. The overall score is the average of the six.

Then the levels. Under 25% is Needs work. 25 to 49% is Developing. 50 to 74% is Largely in place. 75 to 100% is Strong.

You get a bar chart of the six scores, weak areas in red, and your weakest areas listed first with a next step for each. Download the report as text, or print it.

## Files

- `index.html`: the page.
- `style.css`: styling.
- `app.js`: questions, scoring, chart, and report.

That is all of it. No build step, no backend, no external libraries, and your answers never leave your browser.

## A limit worth saying plainly

This is a self-assessment tool only. It does not prove compliance, and it does not replace a formal audit.

Built by Uman Ranjha. Based on the NIST Cybersecurity Framework 2.0.
