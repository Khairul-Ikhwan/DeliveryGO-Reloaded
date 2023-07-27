import React, { useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import debounce from "lodash/debounce";
import { sendRequest } from "../../helpers/send-helper";

export default function Search() {
  const [value, setValue] = useState("");
  const [postalCode, setPostalCode] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const registerRef = useOnclickOutside(() => {
    setValue("");
  });

  const handleInput = (e) => {
    setValue(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const fetchSuggestions = debounce(async (value) => {
    const data = await sendRequest(
      `/api/jobs/autocomplete/${encodeURIComponent(value)}`,
      "GET"
    );
    setSuggestions(data.predictions);
  }, 200);

  const handleSelect = (suggestion) => () => {
    setValue(suggestion.description);
    sendRequest(
      `/api/jobs/geocode/${encodeURIComponent(suggestion.description)}`,
      "GET"
    ).then(({ postalCode }) => {
      setPostalCode(postalCode);
    });
  };

  const renderSuggestions = () =>
    suggestions.map((suggestion) => (
      <li key={suggestion.place_id} onClick={handleSelect(suggestion)}>
        <strong>{suggestion.structured_formatting.main_text}</strong>{" "}
        <small>{suggestion.structured_formatting.secondary_text}</small>
      </li>
    ));

  return (
    <div ref={registerRef}>
      <input value={value} onChange={handleInput} />

      {suggestions.length > 0 && <ul>{renderSuggestions()}</ul>}
      {postalCode && <div>Postal Code: {postalCode}</div>}
    </div>
  );
}
