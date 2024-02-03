import {
  getAllKeywordChannels,
  getAllMentionsChannel,
  getAllUserChannels,
  getOfficialChannels,
} from "../HTTPcalls.ts";
import { useEffect, useState } from "react";
import { Channel } from "../utils/types.ts";
import Autosuggest from "react-autosuggest";

export function TextArea() {
  const [userChannels, setUserChannels] = useState<Channel[]>();
  const [officialChannels, setOfficialChannels] = useState<Channel[]>();
  const [keywordChannels, setKeywordChannels] = useState<Channel[]>();
  const [mentionChannels, setMentionChannels] = useState<Channel[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState("");
  const [suggestionsList, setSuggestions] = useState([]);
  const [triggerChars] = useState(["@", "#", "§"]);
  // @ts-ignore
  const [cursor, setCursor] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const userC = await getAllUserChannels();
      setUserChannels(userC.length > 0 ? userC : []);
      const officialC = await getOfficialChannels();
      setOfficialChannels(officialC.length > 0 ? officialC : []);
      const mentionC = await getAllMentionsChannel();
      setMentionChannels(mentionC.length > 0 ? mentionC : []);
      const keywordC = await getAllKeywordChannels();
      setKeywordChannels(keywordC.length > 0 ? keywordC : []);
    };
    fetchData().then(() => {
      setIsLoading(false);
    });
  }, []);

  // @ts-ignore
  const onChange = (_, { newValue }) => {
    setValue(newValue);
  };

  // @ts-ignore
  const onSuggestionsFetchRequested = ({ value }) => {
    const lastChar = value.charAt(value.length - 1);
    const triggerExists = triggerChars.includes(lastChar);

    if (triggerExists) {
      // @ts-ignore
      setSuggestions(getSuggestions(lastChar));
    } else {
      setSuggestions([]);
    }
  };

  const getSuggestionValue = (suggestion: Channel) => suggestion.name;

  const renderSuggestion = (suggestion: Channel) => (
    <div>{suggestion.name}</div>
  );

  const getSuggestions = (trigger: string) => {
    let inputValue = "";
    trigger.trim() === trigger.trim().toLowerCase()
      ? (inputValue = trigger.trim().toLowerCase())
      : (inputValue = trigger.trim().toUpperCase());

    if (trigger === "@" && mentionChannels) {
      return mentionChannels.filter((suggestion) =>
        suggestion.name.toLowerCase().includes(inputValue),
      );
    } else if (trigger === "#" && keywordChannels) {
      return keywordChannels.filter((suggestion) =>
        suggestion.name.toLowerCase().includes(inputValue),
      );
    } else if (trigger === "§") {
      if (inputValue === inputValue.toUpperCase() && officialChannels) {
        return officialChannels.filter((suggestion) =>
          suggestion.name.toLowerCase().includes(inputValue),
        );
      } else if (inputValue === inputValue.toLowerCase() && userChannels) {
        return userChannels.filter((suggestion) =>
          suggestion.name.toLowerCase().includes(inputValue),
        );
      }
    }
  };

  const inputProps = {
    placeholder: "Type a name (one of @, #, § to trigger suggestions)",
    value,
    onChange,
  };
  if (!isLoading) {
    return (
      <Autosuggest
        suggestions={suggestionsList}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={() => setSuggestions([])}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        highlightFirstSuggestion={true}
        focusInputOnSuggestionClick={false}
        multiSection={false}
        alwaysRenderSuggestions={true}
        onSuggestionSelected={(_, { suggestionValue }) => {
          setValue(
            value.replace(
              new RegExp(
                `[${triggerChars.join("")}]([^${triggerChars.join("")}\\s]*)$`,
              ),
              `${triggerChars}${suggestionValue} `,
            ),
          );
          setSuggestions([]);
          setCursor(0);
        }}
      />
    );
  }
}
