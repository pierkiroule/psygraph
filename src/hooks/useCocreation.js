import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "psychographe:cocreation:v1";

const hasWindow = () => typeof window !== "undefined";

const readStore = () => {
  if (!hasWindow()) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeStore = (value) => {
  if (!hasWindow()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
};

const randomCode = () => String(Math.floor(1000 + Math.random() * 9000));

export function useCocreation(sessionId) {
  const [room, setRoom] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (hasWindow()) setReady(true);
  }, []);

  const persist = useCallback(
    (roomData, nextContribs) => {
      if (!roomData) return;
      const store = readStore();
      store[roomData.code] = {
        room: roomData,
        contributions: nextContribs,
      };
      writeStore(store);
    },
    []
  );

  const createRoom = useCallback(
    (mode) => {
      if (!ready) return null;
      const code = randomCode();
      const newRoom = {
        code,
        mode,
        owner: sessionId,
        createdAt: Date.now(),
      };
      setRoom(newRoom);
      setContributions([]);
      persist(newRoom, []);
      return code;
    },
    [persist, ready, sessionId]
  );

  const joinRoom = useCallback(
    (code) => {
      if (!ready) return false;
      const store = readStore();
      const entry = store[code];
      if (!entry) return false;
      setRoom(entry.room);
      setContributions(entry.contributions || []);
      return true;
    },
    [ready]
  );

  const leaveRoom = useCallback(() => {
    setRoom(null);
    setContributions([]);
  }, []);

  const addContribution = useCallback(
    (payload) => {
      if (!room) return false;
      const hasCrypto =
        typeof globalThis !== "undefined" &&
        globalThis.crypto &&
        typeof globalThis.crypto.randomUUID === "function";
      const entry = {
        id: hasCrypto ? globalThis.crypto.randomUUID() : String(Date.now()),
        type: payload.type || room.mode,
        author: payload.author || sessionId,
        at: Date.now(),
        ...payload,
      };
      setContributions((prev) => {
        const next = [...prev, entry];
        persist(room, next);
        return next;
      });
      return true;
    },
    [persist, room, sessionId]
  );

  useEffect(() => {
    if (!hasWindow()) return;
    const handler = (event) => {
      if (event.key !== STORAGE_KEY || !room) return;
      try {
        const store = event.newValue ? JSON.parse(event.newValue) : {};
        const match = store[room.code];
        if (match) {
          setRoom(match.room);
          setContributions(match.contributions || []);
        }
      } catch {
        /* noop */
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [room]);

  const link = useMemo(() => {
    if (!room || !hasWindow()) return "";
    const { origin, pathname } = window.location;
    const url = new URL(origin + pathname);
    url.searchParams.set("psy", room.code);
    return url.toString();
  }, [room]);

  return {
    room,
    contributions,
    link,
    createRoom,
    joinRoom,
    leaveRoom,
    addContribution,
    ready,
  };
}
