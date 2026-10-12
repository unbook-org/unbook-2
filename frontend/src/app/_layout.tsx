import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function RootLayout() {
  return (
    <>
      {/* Cada tela já renderiza o próprio banner, navbar e rodapé. */}
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </>
  );
}
