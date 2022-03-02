# Vuex Moduler

Vuex moduler to create automatic modules with its actions,getters,mutations with simple configurations.

## Installation

Use the package manager [npm](https://nodejs.org/en/download/) to install vuex-moduler.

```bash
npm i @yazanolabi/vuex-moduler
```

## Usage

```javascript
import { moduler } from "@yazanolabi/vuex-moduler";

# returns a crud module ready for vuex
const module = moduler({
    api: "API PATH"
});
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
