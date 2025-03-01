import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ChatInputContext } from "@/contexts/chat-input-context";
import ChatPage from "@/pages/chat";

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
      <ChatInputContext.Provider value={{}}>
        <Router />
        <Toaster />
      </ChatInputContext.Provider>
    </QueryClientProvider>
  );
}

export default App;