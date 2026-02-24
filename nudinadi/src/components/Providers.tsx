'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth';
import { ToastProvider } from '@/components/Toast';
import { I18nProvider } from '@/lib/i18n';
import { ThemeProvider } from '@/lib/theme';
import { NotificationProvider } from '@/lib/notifications';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <I18nProvider>
          <ToastProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </ToastProvider>
        </I18nProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
