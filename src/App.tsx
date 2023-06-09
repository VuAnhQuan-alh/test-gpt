import "./App.css";

import axios from "axios";
import ExpiryMap from "expiry-map";
import { useEffect, useState } from "react";
import Browser from "webextension-polyfill";

// let provider: any;
// async function getProvider() {
//   provider = await Browser.storage.local.get("provider");
//   console.log(provider);

//   return {};
// }

const KEY_ACCESS_TOKEN = "accessToken";
const cache = new ExpiryMap(10 * 1000);
export async function getChatGPTAccessToken(): Promise<string> {
  if (cache.get(KEY_ACCESS_TOKEN)) {
    return cache.get(KEY_ACCESS_TOKEN);
  }

  const resp = await axios({
    method: "get",
    url: "https://chat.openai.com/api/auth/session",
    headers: {},
  });
  if (resp.status === 403) {
    throw new Error("CLOUDFLARE");
  }
  const data = await resp.data;
  if (!data.accessToken) {
    throw new Error("UNAUTHORIZED");
  }
  cache.set(KEY_ACCESS_TOKEN, data.accessToken);
  return data.accessToken;
}

function App() {
  const [count, setCount] = useState(0);

  // useEffect(() => {
  //   if (!provider) {
  //     (async function () {
  //       await getProvider();
  //     })();
  //   }
  // }, [provider]);

  useEffect(() => {
    console.log(document.cookie);
    (async function () {
      const token = await getChatGPTAccessToken();
      console.log(token);
    })();
  }, []);

  return (
    <div className="App">
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
