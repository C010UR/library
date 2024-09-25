export const authMessages = {
  error: 'Uh oh! Something went wrong.',
  loggedIn: 'Successfully logged in.',
  loggedOut: 'Successfully logged out.',
  passwordResetRequest: 'Password reset request was sent successfully.',
  passwordReset: 'Password was reset.',
};

export const formErrorMessages = {
  minLength: '{field} must be at least {minLength} characters long.',
  maxLength: '{field} can be at most {maxLength} characters long.',
  email: 'Email is not valid.',
  password: {
    uppercase: 'Password must include at least one uppercase letter.',
    lowercase: 'Password must include at least one lowercase letter.',
    number: 'Password must include at least one number.',
    special: 'Password must include at least one special character.',
    dontMatch: "Passwords don't match.",
  },
};
