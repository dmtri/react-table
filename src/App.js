import Table from "./table";
import data from "./mockData";
import axios from "axios";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Table
        dataSource={data.slice(0, 100)}
        // dataSource={() => {
        //   return new Promise((resolve) => {
        //     window.setTimeout(() => {
        //       resolve(axios.get("https://jsonplaceholder.typicode.com/posts"));
        //     }, 500);
        //   });
        // }}
        columns={[
          { title: "User ID", path: "userId" },
          { title: "Post ID", path: "id" },
          { title: "Title", path: "title" },
          { title: "Body", path: "body" },
        ]}
        searchColumn="userId.id"
        // onSearchTermFilterChange={(term) => alert(term)}
        // onCellClick={(cell) => alert(JSON.stringify(cell))}
        // renderCell={(cell) => <td className="test-cell">{cell}</td>}
        // renderRow={(row) => <tr className="test-row">{JSON.stringify(row)}</tr>}
        // renderLoader={() => <span>Custom Loader</span>}
        // renderCheckbox={() => <span>check box</span>}
        // renderCheckboxAll={() => <span>check box all</span>}
        // renderSearch={() => <span>check box all</span>}
      />
    </div>
  );
}

export default App;
