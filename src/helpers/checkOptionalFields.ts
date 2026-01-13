export const checkVehicleFields = (
  payload: Record<string, unknown>,
  vehicle: Record<string, unknown>
) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const updatedVehicleName = vehicle_name ?? vehicle.vehicle_name;
  const updatedVehicleType = type ?? vehicle.type;
  const updatedVehicleRegistration =
    registration_number ?? vehicle.registration_number;
  const updatedVehiclePrice = daily_rent_price ?? vehicle.daily_rent_price;
  const updatedVehicleStatus =
    availability_status ?? vehicle.availability_status;

  return [
    updatedVehicleName,
    updatedVehicleType,
    updatedVehicleRegistration,
    updatedVehiclePrice,
    updatedVehicleStatus,
  ];
};
