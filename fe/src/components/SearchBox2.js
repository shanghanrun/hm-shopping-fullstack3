import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const SearchBox2 = ({ searchQuery, setSearchQuery, placeholder, field }) => {
  const [keyword, setKeyword]=useState('')

  const onCheckEnter = (event) => {
    console.log('서치시작')
    if (event.key === "Enter") {
      if(searchQuery.name ===''){
        delete searchQuery.name
      } 

      setSearchQuery({ ...searchQuery, [field]: event.target.value });
      setKeyword('')
    }
  };
  return (
    <div className="search-box">
      <FontAwesomeIcon icon={faSearch} />
      <input
        type="text"
        placeholder={placeholder}
        onKeyPress={onCheckEnter}
        onChange={(event) => setKeyword(event.target.value)}
        value={keyword}
      />
    </div>
  );
};

export default SearchBox2;
