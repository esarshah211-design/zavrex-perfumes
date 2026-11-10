import { supabase, isSupabaseConfigured } from './supabase';

const AUTH_KEYS = {
  SESSION: 'zavrex_admin_jwt_session',
  SALT: 'zavrex_admin_salt_v2',
  HASH: 'zavrex_admin_hash_v2',
  USERNAME: 'zavrex_admin_username_v2',
  TIMESTAMP: 'zavrex_admin_login_time',
};

// Default cryptographic baseline (Salted SHA-256)
// Storing only the one-way cryptographic hash - NEVER the plain text password in code
const INITIAL_SALT = 'zavrex_salt_peshawar_2026';
const INITIAL_HASH = '9c9785b099c7f39ed4c8f5ceb2ef9a793b032436316d2eb54c68ee6c171415b2';
const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_EMAIL = 'admin@zavrex.com';

/**
 * Computes SHA-256 cryptographic hash of string
 */
async function computeSha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generates a random cryptographic salt
 */
function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifies password against stored cryptographic hash
 */
export async function verifyPasswordHash(password: string): Promise<boolean> {
  try {
    const salt = localStorage.getItem(AUTH_KEYS.SALT) || INITIAL_SALT;
    const expectedHash = localStorage.getItem(AUTH_KEYS.HASH) || INITIAL_HASH;
    const computed = await computeSha256(`${salt}:${password}`);
    return computed === expectedHash;
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

/**
 * Authenticate Administrator
 * 1. Accepts 'admin', 'admin@zavrex.com', or any administrator email/username
 * 2. Authenticates through Supabase Auth when configured
 * 3. Fallback verifies against the salted cryptographic hash (Netlify / preview ready)
 * 4. Never exposes plain text password in code
 */
export async function loginAdmin(
  usernameOrEmail: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  const input = (usernameOrEmail || '').trim();
  const pwd = (password || '').trim();

  if (!input) {
    return { success: false, error: 'Please enter your administrator username or email.' };
  }
  if (!pwd) {
    return { success: false, error: 'Please enter your password.' };
  }

  // Target email for Supabase Auth
  const isEmail = input.includes('@');
  const targetEmail = isEmail ? input.toLowerCase() : DEFAULT_ADMIN_EMAIL;

  // 1. Supabase Authentication Attempt if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: targetEmail,
        password: pwd,
      });

      if (data?.session) {
        localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(data.session));
        localStorage.setItem(AUTH_KEYS.TIMESTAMP, Date.now().toString());
        localStorage.setItem(AUTH_KEYS.USERNAME, input);
        window.dispatchEvent(new Event('zavrex_admin_auth_changed'));
        return { success: true };
      }

      // If user does not exist on a newly deployed Supabase project, auto-bootstrap the initial admin
      if (error) {
        const isMatch = await verifyPasswordHash(pwd);
        if (isMatch) {
          try {
            const signupRes = await supabase.auth.signUp({
              email: targetEmail,
              password: pwd,
              options: {
                data: {
                  username: 'admin',
                  role: 'admin',
                },
              },
            });
            if (signupRes.data?.session) {
              localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(signupRes.data.session));
            }
          } catch (e) {
            console.warn('Auto-bootstrap Supabase admin notice:', e);
          }

          localStorage.setItem(AUTH_KEYS.SESSION, 'authenticated');
          localStorage.setItem(AUTH_KEYS.TIMESTAMP, Date.now().toString());
          localStorage.setItem(AUTH_KEYS.USERNAME, input);
          window.dispatchEvent(new Event('zavrex_admin_auth_changed'));
          return { success: true };
        }

        return { success: false, error: error.message || 'Incorrect administrator password.' };
      }
    } catch (err: any) {
      console.warn('Supabase Auth network notice, attempting cryptographic verification:', err);
    }
  }

  // 2. Cryptographic Salted Hash Verification (Zero-knowledge, offline & Netlify preview ready)
  const isMatch = await verifyPasswordHash(pwd);
  if (isMatch) {
    localStorage.setItem(AUTH_KEYS.SESSION, 'authenticated');
    localStorage.setItem(AUTH_KEYS.TIMESTAMP, Date.now().toString());
    localStorage.setItem(AUTH_KEYS.USERNAME, input);
    window.dispatchEvent(new Event('zavrex_admin_auth_changed'));
    return { success: true };
  }

  return { success: false, error: 'Incorrect administrator password. Please check your credentials.' };
}

/**
 * Check if admin session is currently active
 */
export function isCurrentAdminAuthenticated(): boolean {
  try {
    const session = localStorage.getItem(AUTH_KEYS.SESSION);
    if (!session) return false;

    // Optional 24-hour expiration check
    const timestamp = localStorage.getItem(AUTH_KEYS.TIMESTAMP);
    if (timestamp) {
      const elapsed = Date.now() - parseInt(timestamp, 10);
      const MAX_SESSION_MS = 24 * 60 * 60 * 1000; // 24 hours
      if (elapsed > MAX_SESSION_MS) {
        logoutAdmin();
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Sign out administrator
 */
export async function logoutAdmin(): Promise<void> {
  try {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
  } catch (e) {
    console.warn('Supabase signOut notice:', e);
  } finally {
    localStorage.removeItem(AUTH_KEYS.SESSION);
    localStorage.removeItem(AUTH_KEYS.TIMESTAMP);
    window.dispatchEvent(new Event('zavrex_admin_auth_changed'));
  }
}

/**
 * Change Administrator Password
 * Securely verifies current password, then updates Supabase and/or the cryptographic hash
 */
export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  // Validate new password strength
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters long.' };
  }

  // Verify current password first
  const isCurrentValid = await verifyPasswordHash(currentPassword);
  if (!isCurrentValid) {
    return { success: false, error: 'Current password verification failed.' };
  }

  // Update in Supabase Auth if connected
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        console.warn('Supabase password update error:', error.message);
      }
    } catch (e) {
      console.warn('Supabase password update error:', e);
    }
  }

  // Update cryptographic salted hash
  try {
    const newSalt = generateSalt();
    const newHash = await computeSha256(`${newSalt}:${newPassword}`);
    localStorage.setItem(AUTH_KEYS.SALT, newSalt);
    localStorage.setItem(AUTH_KEYS.HASH, newHash);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update cryptographic hash.' };
  }
}

/**
 * Request Password Reset (Supabase Auth reset link + emergency recovery)
 */
export async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; message: string; isEmailSent: boolean }> {
  const targetEmail = (email || '').trim().toLowerCase() || DEFAULT_ADMIN_EMAIL;

  if (isSupabaseConfigured && supabase) {
    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/admin`
        : 'https://zavrex.com/admin';

      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: redirectUrl,
      });

      if (!error) {
        return {
          success: true,
          isEmailSent: true,
          message: `A secure password reset link has been dispatched to ${targetEmail} via Supabase Auth. Please check your inbox.`,
        };
      }
    } catch (err) {
      console.warn('Supabase password reset request notice:', err);
    }
  }

  return {
    success: true,
    isEmailSent: false,
    message: `Password recovery initialized for ${targetEmail}. Use your Master Security Recovery Key to reset your password immediately.`,
  };
}

/**
 * Reset Administrator Password via Recovery Key
 * Verifies recovery key against SHA-256 hash (never stored in plaintext)
 */
const RECOVERY_KEY_HASH = 'de7e460c65266002658a9bee351b54ce248ff6069bec9d2c3d0dfc6f4e7a2705';

export async function resetAdminPasswordWithRecovery(
  recoveryKey: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters long.' };
  }

  // Verify recovery key hash
  const inputHash = await computeSha256(recoveryKey.trim());
  if (inputHash !== RECOVERY_KEY_HASH) {
    return { success: false, error: 'Invalid master recovery key. Please verify and try again.' };
  }

  // Update in Supabase Auth if connected
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.updateUser({ password: newPassword });
    } catch (e) {
      console.warn('Supabase reset updateUser notice:', e);
    }
  }

  // Update cryptographic salted hash
  try {
    const newSalt = generateSalt();
    const newHash = await computeSha256(`${newSalt}:${newPassword}`);
    localStorage.setItem(AUTH_KEYS.SALT, newSalt);
    localStorage.setItem(AUTH_KEYS.HASH, newHash);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update cryptographic hash.' };
  }
}

