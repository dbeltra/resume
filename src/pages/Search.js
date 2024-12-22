import React, { useState } from "react";
import { Link } from "react-router-dom";
import searchData from "../assets/searchResults.json";
import TabContent from "../components/tab-content";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [regex, setRegex] = useState(false);

  const placeholderText = "an awesome developer";

  const handleSearchChange = (e) => {
    const input = e.target.value;
    const currentLength = searchTerm.length;
    if (currentLength < placeholderText.length) {
      setSearchTerm(placeholderText.slice(0, currentLength + 1));
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(placeholderText);
    setLoading(true);

    setTimeout(() => {
      const randomResults = shuffleArray(searchData.results).slice(0, 4);
      setSearchResults(randomResults);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="">
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
              placeholder="Search for..."
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
          <p>Searching...</p>
        </div>
      )}

      {!loading && searchResults && (
        <div className="lg:mt-2 overflow-y-scroll  lg:w-3/4 col-span-2">
          <h2 className="text-lg mb-2">
            {`Search Results for "${placeholderText}"`}:
          </h2>
          <div className="border p-2 mb-4 rounded border-gray-500 flex items-center">
            <i className="material-symbols-filled mr-1">info</i>
            <div>
              Looks like I'm the developer you're looking for! Maybe you should{" "}
              <Link
                key={"Contact"}
                to={"/files/contact"}
                className={`text-secondary ml-1`}
              >
                <span>contact me</span>
              </Link>
              ?
            </div>
          </div>
          <ul className="list-none ">
            {searchResults.map((result, index) => (
              <li
                key={index}
                className=" hover:bg-black/5 transition-colors cursor-pointer p-2"
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
