import Table from "./table";
import data from "./table/mockData";
import axios from 'axios'

import "./App.css";

function App() {
  return (
    <div className="App">
      <Table
        dataSource={data.slice(0, 100)}
        // dataSource={() => {
        //   return new Promise((resolve) => {
        //     window.setTimeout(() => {
        //       resolve(axios.get('https://jsonplaceholder.typicode.com/posts'))
        //     }, 500)
        //   })
        // }}
        columns={["userId", "id", "title", "body"]}
        searchColumn={'title'}
      />
    </div>
  );
}

export default App;
