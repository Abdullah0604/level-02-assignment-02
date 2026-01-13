export const bookingDataValidation = (bookingData: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
    bookingData;

  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);
  const today = new Date();

  if (!customer_id) {
    return "customer id is required. Please provide the customer id.";
  }

  if (!vehicle_id) {
    return "vehicle id is required. Please provide the vehicle id.";
  }

  if (!rent_start_date) {
    return "rent start date is required. Please provide rent start date.";
  }

  if (!rent_end_date) {
    return "rent end date is required. Please provide rent end date.";
  }

  if (startDate < new Date(today.toISOString().split("T")[0] as string)) {
    return "Rent start date cannot be in the past.";
  }
  if (startDate > endDate) {
    return "End date must be after start date";
  }
  return "";
};
