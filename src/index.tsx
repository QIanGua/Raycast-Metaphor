import { useEffect, useState } from "react";
import { Action, ActionPanel, List, getPreferenceValues, Icon, showToast, Toast } from "@raycast/api";
import Metaphor from 'metaphor-node';
import { resolve } from "path";

interface Preferences {
  MetaphorAPIKey: string;
}

const apikey = getPreferenceValues<Preferences>().MetaphorAPIKey;
// console.log(apikey)
const metaphor = new Metaphor(apikey);

export default function Command() {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false); 
  
  useEffect(() => {
    const delaySearch = () => {
      // delay 2000 ms(2s)
      setTimeout(() => {
        searchArticles(searchText);
      }, 1000);
    }

    const searchArticles = async () => {
      setLoading(true); //  loading
      try {
        const response = await metaphor.search(searchText, {
          numResults: 10,
          useAutoprompt: true
        });

        setResults(response.results);
      } catch (error) {
        if (!error.message.includes('400')) {
          console.log(error.message);
          showToast({
            style: Toast.Style.Failure,
            title: "Something went wrong hhh",
            message: error.message,
          });
        }
      }
      setLoading(false); // 搜索结束,关闭 loading
    }
    delaySearch();
  }, [searchText]);

  return (
    <List
      isLoading={loading}
      searchText={searchText}
      navigationTitle="Search Results"
      onSearchTextChange={setSearchText}
    >
      {results.length > 0 && results.map(result => (
        <List.Item
          key={result.id}
          icon={Icon.Stars}
          title={result.title}
          subtitle={result.author}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser title="Open In Browser" url={result.url} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

