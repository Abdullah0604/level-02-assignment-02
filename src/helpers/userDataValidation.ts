export const userDataValidation = (userData: Record<string, unknown>) => {
  let message = "";
  const { name, email, password, phone } = userData;

  if (!name) {
    message = "Name is required. Please Give your name";
  }

  if (!email) {
    message = "Email is required. Please Give your email";
  } else {
    if (email !== (email as string).toLowerCase()) {
      message = "All character of Email must be in lowercase.";
    }
  }

  if (!password) {
    message = "Password is required. Please Give your password";
  } else {
    if ((password as string).length < 6) {
      message = "Password must be at least 6 character";
    }
  }

  if (!phone) {
    message = "Phone Number is required. Please Give your phone number";
  }

  return message;
};
