import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { HashRouter, Route, Routes } from "react-router-dom";
import { ArweaveWalletKit } from "@arweave-wallet-kit/react";
import WanderStrategy from "@arweave-wallet-kit/wander-strategy";
import WAuthStrategy, { WAuthProviders } from "@wauth/strategy";
import AosyncStrategy from "@vela-ventures/aosync-strategy";

import AnotherPage from "./dashboard";
import Login from "./login";
import ProtectedRoute from "./components/protectedRoutes";
import LandingPage from "./landing";
import BotSelection from "./AppSelection";

// ✅ Sonner toast
import { Toaster } from "sonner";

function Main() {
  return (
    <ArweaveWalletKit
      config={{
        appInfo: {
          name: "ArAO Starter",
          logo: "t8cPU_PWjdLXRBAN89nzb9JQoRAf5ZBF2kkTZoxtJPc",
        },
        strategies: [
          new WanderStrategy(),
          new WAuthStrategy({ provider: WAuthProviders.Google }),
          new WAuthStrategy({ provider: WAuthProviders.Github }),
          new AosyncStrategy(),
        ],
        permissions: ["ACCESS_ADDRESS", "SIGNATURE", "SIGN_TRANSACTION"],
      }}
      theme={{ displayTheme: "dark" }}
    >
      <ThemeProvider defaultTheme="dark">
        {/* ✅ Sonner Toaster globally */}
        <Toaster position="bottom-right" 
        richColors
        theme="dark" />

        <HashRouter>
          <Routes>
            <Route index element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AnotherPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bot-selection"
              element={
                <ProtectedRoute>
                  <BotSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/:serverId/server"
              element={
                <ProtectedRoute>
                  <BotSelection />
                </ProtectedRoute>
              }
            />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </ArweaveWalletKit>
  );
}

createRoot(document.getElementById("root")!).render(<Main />);
