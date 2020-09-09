import React from 'react';
import './App.css';
import { Console } from 'app-console';

import "app-console/dist/index.css";

const demoScript = `
echo Welcome to the demo "script.";
sleep 1;
echo Sit back and watch some sample commands;
sleep 1;
echo executed before your "eyes!";
sleep 1;
echo ">" date;
date;
sleep 1;
echo ">" sleep 3;
sleep 3;
echo ">" date;
tee \${date} d;
sleep 1;
echo ">" echo '$0';
echo $d;
sleep 1;
echo ">" 5 + 2;
5 + 2;
sleep 1;
echo ">" a = '\${6 * 2}';
a = \${6 * 2};
sleep 1;
echo ">" echo Answer is '$a';
echo Answer is $a;
sleep 1;
echo ">" range 3;
range 3;
sleep 1;
echo ">" '$0 | json';
range 3 | json;
sleep 1;
echo '> range 50 | grep 7' ;
range 50 | grep 7;
sleep 1;
echo '> foreach \${range 10}; sleep 1; $item; done;';
foreach \${range 10}; sleep 1; $item; done;
echo ' ';
echo 'Thanks!';
`;

const executables = {
  demo () {
    return this.execute(demoScript);
  },
};

function App() {
  return (
    <div className="App">
      <p>Type demo or help to get started.</p>
      <Console context={{ executables }} />
    </div>
  );
}

export default App;
