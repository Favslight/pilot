export const isGuestMode = () => false;
export const enableGuestMode = () => {};
export const disableGuestMode = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("guestMode");
  }
};

