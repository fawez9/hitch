export function buildQuery(filters: Filters): string {
  const { language, labels, updatedAt, page } = filters;
  let query = 'is:issue is:open';
  if (language) {
    query += ` language:${language}`;
  }
  if (updatedAt) {
    query += ` updated:>${updatedAt}`;
  }
  if (labels?.length) {
    query += labels.map((label) => ` label:${label}`).join('');
  }
  return query;
}
