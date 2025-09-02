/**
 * Checks if a sale is currently active given optional start and end datetimes.
 * Datetime format expected from API: "YYYY-MM-DD HH:mm:ss".
 */
export function isSaleActive(
  dateFrom?: string | null,
  dateTo?: string | null,
): boolean {
  // If no dates provided, consider sale inactive
  if (!dateFrom && !dateTo) return false;

  const now = new Date();

  const parseApiDate = (value?: string | null): Date | null => {
    if (!value) return null;
    // Ensure reliable parsing by converting space to 'T'
    const normalized = value.replace(" ", "T");
    const parsed = new Date(normalized);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const from = parseApiDate(dateFrom);
  const to = parseApiDate(dateTo);

  // If a provided date is invalid, treat sale as inactive
  if (dateFrom && !from) return false;
  if (dateTo && !to) return false;

  if (from && now < from) return false; // Not started yet
  if (to && now > to) return false; // Already ended

  return true;
}

export default isSaleActive;
