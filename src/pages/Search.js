import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TabContent from "../components/TabContent";

// Helper function to shuffle an array
const shuffleArray = (array) => {
  let shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const SearchButton = ({ children, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-2 py-1 text-xs rounded border border-gray-500 hover:bg-gray-600 transition-colors ${
      isActive ? "bg-gray-600" : "bg-transparent"
    }`}
  >
    {children}
  </button>
);

const SearchContent = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchInitiated, setSearchInitiated] = useState(false); // Track if search is initiated
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [regex, setRegex] = useState(false);

  const placeholderText = t("searchPlaceholderText");

  const fetchSearchData = async (language) => {
    setLoading(true);
    try {
      const data = await import(`../assets/searchResults.${language}.json`);
      setSearchResults(data.results);
    } catch (error) {
      console.error("Error loading search data:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchData(i18n.language);
  }, [i18n.language]);

  const handleSearchChange = (e) => {
    const currentLength = searchTerm.length;
    if (currentLength < placeholderText.length) {
      setSearchTerm(placeholderText.slice(0, currentLength + 1));
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(placeholderText);
    setLoading(true);
    setSearchInitiated(true); // Mark search as initiated

    setTimeout(() => {
      if (searchResults) {
        const randomResults = shuffleArray(searchResults).slice(0, 4);
        setSearchResults(randomResults);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="px-4">
      <div className="lg:w-1/2 ">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={t("searchPlaceholder")}
              className="w-full p-2 pr-32 bg-gray-700 text-white rounded-s"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <SearchButton
                isActive={caseSensitive}
                onClick={() => setCaseSensitive(!caseSensitive)}
              >
                Aa
              </SearchButton>
              <SearchButton
                isActive={wholeWord}
                onClick={() => setWholeWord(!wholeWord)}
              >
                [ab]
              </SearchButton>
              <SearchButton isActive={regex} onClick={() => setRegex(!regex)}>
                *.
              </SearchButton>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-primary hover:bg-primary-700 text-white rounded-e flex items-center"
          >
            <i className="material-symbols-filled">search</i>
          </button>
        </form>
      </div>

      {loading && (
        <div className="lg:mt-2 text-left  col-span-2">
          <p>{t("searchSearchingText")}</p>
        </div>
      )}

      {!loading && searchInitiated && searchResults && (
        <div className="lg:mt-2 overflow-y-scroll  lg:w-3/4 col-span-2">
          <h2 className="text-lg mb-2">
            {t("searchResultsTitle", { placeholderText })}
          </h2>
          <div className="border p-2 mb-4 rounded border-gray-500 flex items-center">
            <i className="material-symbols-filled mr-1">info</i>
            <div>
              {t("searchResultsInfo")}{" "}
              <Link
                key={"Contact"}
                to={"/files/contact"}
                className={`text-secondary ml-1`}
              >
                <span>{t("searchResultsContact")}</span>
              </Link>
              ?
            </div>
          </div>
          <ul className="list-none ">
            {searchResults.map((result, index) => (
              <li
                key={index}
                className="hover:bg-black/5 transition-colors cursor-pointer p-2"
              >
                <h3 className="text-md font-bold">{result.title}</h3>
                <p className="text-sm">{result.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const Search = () => {
  return <TabContent Content={SearchContent}></TabContent>;
};

export default Search;
