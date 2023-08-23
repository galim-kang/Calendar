import { styled } from 'styled-components';
import { LuSettings, LuBell } from 'react-icons/lu';
import SearchInfo from './SearchInfo';
import React, { useState, useEffect } from 'react';
import { scheduleSearchApi } from '../../api';

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3vh;
  border-bottom: 1px solid rgb(235, 237, 239);
  padding: 8px 0;
`;
const SearchBox = styled.input`
  margin-left: 150px;
  padding: 3px 0 3px 10px;
  border: none;
  outline: none;
  border-radius: 6px;
  background-color: white;
  box-shadow: inset 2px 5px 10px rgba(0, 0, 0, 0.1);
  transition: 300ms ease-in-out;
  width: 200px;
  &&:focus {
    background-color: rgb(249, 249, 249);
    border: 1px;
    outline: none;
    box-shadow:
      -3px -3px 8px rgba(235, 245, 235, 1),
      3px 3px 8px rgba(0, 0, 70, 0.3);
  }
`;
const Form = styled.form`
  width: 100%;
`;
const Button = styled.button`
  border: none;
  outline: none;
  background-color: white;

  margin-left: 5px;
  width: 50px;
`;
const IconBox = styled.div`
  display: flex;
  justify-content: end;
  opacity: 0.6;
  width: 15vw;
  padding-right: 0.6vw;
`;

function Header({ data, initialCalendars, initialEvents }) {
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (value.length >= 1) {
      setSearchIsOpen(true);
    } else {
      setSearchIsOpen(false);
    }
  };
  const handleSearch = (event) => {
    event.preventDefault(); // 기본 제출 동작 방지

    if (inputValue.length >= 1) {
      scheduleSearchApi({ search: inputValue })
        .then((data) => setSearchResults(data))
        .catch((error) => console.error(error));
    } else {
      setSearchResults([]);
    }
  };

  return (
    <HeaderContainer>
      <Form onSubmit={handleSearch}>
        <SearchBox
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="search"
        />
        <Button type="submit">검색</Button>
      </Form>
      {searchIsOpen ? (
        <SearchInfo
          onClose={() => setSearchIsOpen(false)}
          matchingData={searchResults}
          initialCalendars={initialCalendars}
          initialEvents={initialEvents}
        />
      ) : null}
      <IconBox>
        <LuBell />
        <LuSettings />
      </IconBox>
    </HeaderContainer>
  );
}
export default Header;
