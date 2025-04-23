import { createContext, useContext, useState } from "react"

interface SearchContextType {
  searchKeyword: string;
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>;
}

const SearchContext = createContext<SearchContextType>({
  searchKeyword: "",
  setSearchKeyword: () => {}
});

import { ReactNode } from "react";

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchKeyword, setSearchKeyword] = useState("")

  return (
    <SearchContext.Provider value={{ searchKeyword, setSearchKeyword }}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => useContext(SearchContext)
