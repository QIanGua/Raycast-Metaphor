import { useEffect, useState } from "react";
import { Action, ActionPanel, List, getPreferenceValues, Icon, LaunchProps } from "@raycast/api";
import Metaphor from 'metaphor-node';

interface Preferences {
  MetaphorAPIKey: string;
}

export default function Command() {
  const [searchText, setSearchText] = useState();
  const [results, setResults] = useState([]);

  const apikey = getPreferenceValues<Preferences>().MetaphorAPIKey;
  // console.log(apikey)
  const metaphor = new Metaphor(apikey);

  useEffect(() => {
    const searchArticles = async () => {
      // const  response = await metaphor.search(searchText, {
      const  response = await metaphor.search('funny article about tech culture', {
        // 搜索选项 
        numResults: 10,
        // includeDomains: ['nytimes.com', 'wsj.com'],
        // startPublishedDate: '2023-06-12'
      });
      setResults(response.results);
      // console.log(response);
    }
    searchArticles();
  }, [searchText]);

  return (
    <List
    // searchText={searchText}
    // onSearchTextChange={setSearchText}
    >
      {results.map(result => (
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

