import { useState, useCallback } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import debounce from "lodash/debounce";
import { sendRequest } from "../../helpers/send-helper";

export default function Search({ onSuggestionSelected, onValueChange }) {
  const [value, setValue] = useState("");
  const [postalCode, setPostalCode] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [buildingName, setBuildingName] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const registerRef = useOnclickOutside(() => {
    setShowSuggestions(false);
  });

  const fetchSuggestions = useCallback(
    debounce(async (value) => {
      const data = await sendRequest(
        `/api/jobs/autocomplete/${encodeURIComponent(value)}`,
        "GET"
      );
      setSuggestions(data.predictions);
      setShowSuggestions(true);
    }, 1000),
    []
  );

  const handleSelect = (suggestion) => () => {
    setValue(suggestion.description);
    setShowSuggestions(false);
    sendRequest(
      `/api/jobs/geocode/${encodeURIComponent(suggestion.description)}`,
      "GET"
    ).then(({ postalCode, formattedAddress }) => {
      setPostalCode(postalCode);
      const buildingName = formattedAddress.split(",")[0];
      setBuildingName(buildingName);
      onSuggestionSelected(suggestion.description, postalCode, buildingName);
    });
  };

  const renderSuggestions = () =>
    suggestions.map((suggestion) => (
      <li key={suggestion.place_id} onClick={handleSelect(suggestion)}>
        <strong>{suggestion.structured_formatting.main_text}</strong>{" "}
        <small>{suggestion.structured_formatting.secondary_text}</small>
      </li>
    ));

  const handleInput = (e) => {
    const value = e.target.value;
    setValue(value);
    fetchSuggestions(value);
    onValueChange(value);
  };

  return (
    <div className="autosearch">
      <input value={value} onChange={handleInput} />
      {showSuggestions && suggestions.length > 0 && (
        <ul ref={registerRef}>{renderSuggestions()}</ul>
      )}
    </div>
  );
}
