import { UsernameType } from "@/types";

export const checkUsernameType = (username: string) => {
  if (!username) return UsernameType.invalid;

  const trimmed = username.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const phoneRegex = /^(?:\+84|84|0)(?:3|5|7|8|9)(?:[0-9]{8}|(?:[0-9]{2}[\s\.-]?){3}[0-9]{2})$/;

  if (emailRegex.test(trimmed)) {
    return UsernameType.email;
  }

  if (phoneRegex.test(trimmed.replace(/[\s\.-]/g, ''))) {
    return UsernameType.phone;
  }

  if (/^[a-z0-9]+$/.test(trimmed)) {
    return UsernameType.normal;
  }

  return UsernameType.invalid;
}