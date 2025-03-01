import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ChatInputProvider } from "@/contexts/chat-input-context";
import { PuterProvider } from "@/contexts/puter-context";
import ChatPage from "@/pages/chat";
import React, { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ChatPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PuterProvider>
        <ChatInputProvider>
          <Router />
          <Toaster />
        </ChatInputProvider>
      </PuterProvider>
    </QueryClientProvider>
  );
}

export default App;
