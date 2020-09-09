App-Console
===========
Add a custom console to add text interactivity to your app.

Getting Started
---------------

Install package
```
yarn add https://github.com/IJMacD/app-console
```

Quick start React app:

```jsx
import React from 'react';
import './App.css';
import { Console } from 'app-console';

import "app-console/dist/index.css";

function App() {
  const context = { myVar: 42, executables: { hello: () => "hey you!" } };

  return (
    <div className="App">
      <Console context={context} style={{ fontSize: 10 }} />
    </div>
  );
}

export default App;

```

Remember to include app-console CSS file as demonstrated.

Interoperability
----------------

|Task|Bash|Cmd|PowerShell|App-Console|
|----|----|---|----------|-----------|
|echo|`echo 1 2 3` (on same line)|`echo 1 2 3` (on same line)|`echo 1 2 3` (newline between each)|`echo 1 2 3` (on same line)|
|Assign a variable|`name=value`|`SET name=value`|`set name value`|`name = value`<br>`set name value`|
|Print a variable|`echo $name`|`echo %name%`|`echo $name`|`$name`|
|Path Variable|`echo $PATH`|`echo %PATH%`|`$env:PATH`|N/A|
|List all variables|`env` (includes values)|`SET` (includes values)|`gci env:` (Environment) `gv` (local)|`$variables` (just names) `variables` (includes values)|
|Sub-expression|`$(date)`|?|`$(date)`|`${date}`|
|Execute command in variable|`$CC *.c`|?|?|`eval $a`|
|Maths|`echo $((5 + 2))`|`SET /A "_result=5+2"`|`5 + 2`|`5 + 2`|