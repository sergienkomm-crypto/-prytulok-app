import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initialState, PrototypeState } from "./domain";
const key = "prytulok-prototype-v1";
const Context = createContext<{
  state: PrototypeState;
  setState: React.Dispatch<React.SetStateAction<PrototypeState>>;
  ready: boolean;
  storageError: boolean;
  reset: () => void;
} | null>(null);
export function Store({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key)
      .then((raw) => {
        if (raw && active) {
          const s = JSON.parse(raw);
          if (
            typeof s.onboarded === "boolean" &&
            Array.isArray(s.favorites) &&
            Array.isArray(s.conversations)
          )
            setState({ ...initialState, ...s });
        }
      })
      .catch(() => {
        if (active) setStorageError(true);
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (ready)
      AsyncStorage.setItem(key, JSON.stringify(state)).catch(() =>
        setStorageError(true),
      );
  }, [state, ready]);
  return (
    <Context.Provider
      value={{
        state,
        setState,
        ready,
        storageError,
        reset: () => setState(initialState),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const value = useContext(Context);
  if (!value) throw Error("Store is missing");
  return value;
}
