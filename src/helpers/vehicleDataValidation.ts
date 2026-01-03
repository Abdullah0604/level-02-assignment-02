export const vehicleDataValidation = (vehicleData: Record<string, unknown>) => {
  let message = "";
  const carTypes = ["car", "bike", "van", "SUV"];
  const status = ["available", "booked"];
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = vehicleData;

  if (!vehicle_name) {
    return (message =
      "Vehicle's Name is required. Please Provide the vehicle's name");
  }

  if (!type) {
    return (message =
      "Vehicle's type is required. Please Provide the vehicle's type");
  } else {
    if (!carTypes.includes(type as string)) {
      return (message = "Vehicle's type must be car or bike or van or SUV");
    }
  }

  if (!registration_number) {
    return (message =
      "vehicle's registration number is required. Please provide the registration number");
  }

  if (!daily_rent_price) {
    return (message =
      "Daily rent price is required. Please Provide the daily rent price and the price must be greater than 0");
  }

  if (!availability_status) {
    return (message =
      "Availability status is required. Please Provide the status either available or booked");
  } else {
    if (!status.includes(availability_status as string))
      return (message =
        "availability status must be either available or booked");
  }
};
