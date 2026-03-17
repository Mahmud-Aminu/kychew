// Helper functions for ID card generation
export function getIssueAndExpiryDate() {
  const issueDate = new Date();

  const expiryDate = new Date(issueDate);
  expiryDate.setFullYear(issueDate.getFullYear() + 2);

  const format = (date: Date) =>
    date.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

  return {
    issueDate: format(issueDate),
    expiryDate: format(expiryDate),
  };
}