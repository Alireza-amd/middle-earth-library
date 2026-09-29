export function formatPlurals(
  length: number,
  {
    singular,
    plural,
  }: {
    singular: string;
    plural: string;
  }
) {
  return length > 1 ? plural : singular;
}

export function formatPrice(
  amount: number,
  { showZeroAsNumber = false } = {}
) {
  const formatter = new Intl.NumberFormat("fa-IR", {
    style: "currency",
    currency: "IRR",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  });

  if (amount === 0 && !showZeroAsNumber) return "رایگان";
  return formatter.format(amount);
}
