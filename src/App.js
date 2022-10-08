import Table from "./table";
import data from "./mockData";
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
        searchColumn={'body'}
        // onSearchTermFilterChange={(term) => alert(term)}
        // renderCell={(cell) => <td className="test-cell">{cell}</td>}
        // renderRow={(row) => <tr className="test-row">{JSON.stringify(row)}</tr>}
        // renderCheckbox={() => <span>check box</span>}
        // renderCheckboxAll={() => <span>check box all</span>}
        // renderSearch={() => <span>check box all</span>}
      />
    </div>
  );
}

export default App;
