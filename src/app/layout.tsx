import React from 'react';
import './globals.css';
import { ReactNode } from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import SessionProvider from '@/components/SessionProvider';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mahfez Tur - Hac ve Umre Turları",
  description: "Seyahat Edin Sıhhat Bulun",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css" />
        <style dangerouslySetInnerHTML={{ __html: `
          :where([class^="ri-"])::before { content: "\\f3c2"; }
          body {
            font-family: 'Poppins', sans-serif;
            color: #333;
          }
          input[type="range"] {
            -webkit-appearance: none;
            width: 100%;
            height: 6px;
            background: #e5e7eb;
            border-radius: 5px;
            outline: none;
          }
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            background: #4CAF50;
            border-radius: 50%;
            cursor: pointer;
          }
          input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            background: #4CAF50;
            border-radius: 50%;
            cursor: pointer;
            border: none;
          }
          input[type="checkbox"] {
            display: none;
          }
          .custom-checkbox {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 2px solid #d1d5db;
            border-radius: 4px;
            position: relative;
            cursor: pointer;
            transition: all 0.2s;
          }
          input[type="checkbox"]:checked + .custom-checkbox {
            background-color: #4CAF50;
            border-color: #4CAF50;
          }
          input[type="checkbox"]:checked + .custom-checkbox:after {
            content: '';
            position: absolute;
            left: 5px;
            top: 2px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
          .date-picker {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 8px 12px;
            width: 100%;
            outline: none;
          }
          .date-picker:focus {
            border-color: #4CAF50;
            box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
          }
          .tour-card {
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .tour-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          }
          .custom-select {
            position: relative;
            display: inline-block;
          }
          .custom-select select {
            display: none;
          }
          .select-selected {
            background-color: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
          }
          .select-items {
            position: absolute;
            background-color: white;
            top: 100%;
            left: 0;
            right: 0;
            z-index: 99;
            border: 1px solid #e5e7eb;
            border-radius: 0 0 8px 8px;
            max-height: 200px;
            overflow-y: auto;
          }
          .select-hide {
            display: none;
          }
          .select-items div, .select-selected {
            padding: 8px 16px;
            cursor: pointer;
          }
          .select-items div:hover {
            background-color: rgba(76, 175, 80, 0.1);
          }
          .same-as-selected {
            background-color: rgba(76, 175, 80, 0.1);
          }
          .switch {
            position: relative;
            display: inline-block;
            width: 44px;
            height: 24px;
          }
          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
          }
          .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
          input:checked + .slider {
            background-color: #4CAF50;
          }
          input:checked + .slider:before {
            transform: translateX(20px);
          }
        `}} />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow pt-16">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
} 