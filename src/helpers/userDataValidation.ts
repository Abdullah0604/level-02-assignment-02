export const userDataValidation = (userData: Record<string, unknown>) => {
  let message = "";
  const { name, email, password, phone, role } = userData;
  const roles = ["admin", "customer"];

  if (!name) {
    return (message = "Name is required. Please provide your name");
  }

  if (!email) {
    return (message = "Email is required. Please provide your email");
  } else {
    if (email !== (email as string).toLowerCase()) {
      return (message = "All character of Email must be in lowercase.");
    }
  }

  if (!password) {
    return (message = "Password is required. Please provide your password.");
  } else {
    if (!(password.toString().length >= 6)) {
      return (message = "Password must be at least 6 character");
    }
  }

  if (!phone) {
    return (message =
      "Phone Number is required. Please provide your phone number");
  }

  if (!role) {
    return (message =
      "Role is required. Please provide your role and remember role can be either admin or customer.");
  } else {
    if (!roles.includes(role as string)) {
      return (message = "role must be either admin or customer.");
    }
  }

  return message;
};
