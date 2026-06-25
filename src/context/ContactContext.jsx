import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CONTACT_INFO } from "../constants/data";
import { fetchContactInfo } from "../lib/api";

const ContactContext = createContext(null);

export function ContactProvider({ children }) {
  // Statik değerler başlangıç/yedek — veritabanı gelince üzerine yazılır
  const [contact, setContact] = useState(CONTACT_INFO);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchContactInfo();
      if (data) {
        // null alanları statik değerle doldur
        setContact({ ...CONTACT_INFO, ...cleanNulls(data) });
      }
    } catch (err) {
      console.error("[Contact] yüklenemedi:", err.message);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ContactContext.Provider value={{ contact, refresh }}>
      {children}
    </ContactContext.Provider>
  );
}

function cleanNulls(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined && v !== "") out[k] = v;
  }
  return out;
}

export const useContact = () => useContext(ContactContext);
