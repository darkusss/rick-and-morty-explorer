When reviewing code, focus on:

## Code Quality Essentials

- Functions should be focused and appropriately sized
- DO NOT complain about naming conventions and descriptive variable names
- Ensure proper error handling throughout

## Style and Layout

- Use flow-relative properties (e.g. padding-block-start, inset-inline, inline-size), units (e.g. cqi, cqb, vi), and keywords (e.g. text-align: start) for layout.
  Constraint: Avoid physical equivalents (e.g. padding-top, width, cqw, vw, text-align: left). References: Logical properties and values on MDN.
  Example:
  /_ avoid _/
  .card {
  padding-top: 1rem;
  font-size: 20px;
  text-align: left;
  }

/_ prefer _/
.card {
padding-block-start: 1rem;
font-size: 20vi;
text-align: start;
}

## Review Style

- Be specific and actionable in feedback
- Explain the "why" behind recommendations
- Acknowledge good patterns when you see them
- Ask clarifying questions when code intent is unclear

Always prioritize security vulnerabilities and performance issues that could impact users.

Always suggest changes to improve readability. For example, this suggestion seeks to make the code more readable and also makes the validation logic reusable and testable.

// Instead of:
if (user.email && user.email.includes('@') && user.email.length > 5) {
submitButton.enabled = true;
} else {
submitButton.enabled = false;
}

// Consider:
function isValidEmail(email) {
return email && email.includes('@') && email.length > 5;
}

submitButton.enabled = isValidEmail(user.email);
