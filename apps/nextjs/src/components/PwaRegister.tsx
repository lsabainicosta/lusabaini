"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
          Promise.all(registrations.map((registration) => registration.unregister()))
        )
        .catch((error) =>
          console.error("Service worker cleanup failed", error)
        );
      return;
    }

    navigator.serviceWorker
      .register("/service-worker.js")
      .catch((error) =>
        console.error("Service worker registration failed", error)
      );
  }, []);

  return null;
}
