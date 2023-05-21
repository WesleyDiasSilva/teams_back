import * as argon2 from 'argon2';

export async function hashPassword(password: string) {
  try {
    const hash = await argon2.hash(password);
    return hash as string;
  } catch (err) {
    return '';
  }
}

export async function verifyPassword(hash: string, password: string) {
  try {
    if (await argon2.verify(hash, password)) {
      return true;
    }
  } catch (err) {
    return false;
  }
}
