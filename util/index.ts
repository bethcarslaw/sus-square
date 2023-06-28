const toGBP = (amount: number | string) => {
  if (typeof amount === "string") {
    amount = parseInt(amount);
  }
  return `£${(amount / 100).toFixed(2)}`;
};

export { toGBP };
