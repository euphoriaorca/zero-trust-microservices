## Random utilities

Random functions repeatedly used in NodeJs packages.

### Installation
```
npm install --save @distinctai/random-utils
```

### Documentation

Examples

```javascript
import { whereClauseFromObject, capitalize, strContains, equalsIgnoreCase } from '@distinctai/random-utils';

// For mysql; generate where clause from joins from object
whereClauseFromObject({
  id: 'abxyz',
  name: 'jonh',
}); // -> `id` = 'abxyz' AND `name` = 'john'

whereClauseFromObject({ // with alias
  id: 'abxyz',
  name: 'jonh',
}, 'u'); // -> `u`.`id` = 'abxyz' AND `u`.`name` = 'john'

// Capitalize every word in a string
capitalize('distinct technologies'); // -> Distinct Technologies

// Find word in string
strContains('The quick brown fox', 'brown'); // -> true

// Case-insensitive string comparison
equalsIgnoreCase('BROWN', 'brown'); // -> true
```

### License

Unlicensed
