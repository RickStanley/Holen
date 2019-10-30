# Holen

Yep, another standalone AJAX library for modern browsers... AUF DEUTSCH! Inspired by Angular's `$http` method.

## Configurations

```javascript
Holen.Konfigurationeinstellen({
  Inhaltstyp: "",
  mitZeugnisse: false,
  xAngefordertMit: true,
  inArbeit: null
});
```

- (contentType) `Inhaltstyp`: `string`, indicates the type of the data. (Default: `'application/x-www-form-urlencoded'`)
- (withCredentials) `mitZeugnisse`: `boolean`, indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies or authorization headers.
- (xRequestedWith) `xAngefordertMit`: `boolean`, should flag that this call is ajax?
- (onProgress) `inArbeit`: `function`, if it's uploading something, you can use progress callback.

## API

#### GET

```javascript
import Holen from './holen.mjs';

Holen
  .bekommen("/endpoint")
  .Erfolg(function(response, request) {})
  .Fehler(function(response, request) {})
  .immer(function(response, request) {});
```

#### PUT

```javascript
import Holen from './holen.mjs';

Holen.stellen('/endpoint', data, options?).Erfolg(function(response, request) {

}).Fehler(function(response, request) {

}).immer(function(response, request) {

});
```

#### POST

```javascript
import Holen from './holen.mjs';

Holen.posten('/endpoint', data, options?).Erfolg(function(response, request) {

}).Fehler(function(response, request) {

}).immer(function(response, request) {

});
```

#### DELETE

```javascript
import Holen from './holen.mjs';

Holen
  .streichen("/endpoint")
  .Erfolg(function(response, request) {})
  .Fehler(function(response, request) {})
  .immer(function(response, request) {});
```

## Function definitions

- `Erfolg`: callback, success
- `Fehler`: callback, fail
- `immer`: callback, always

##### Callback Params

- `response`: parsed data (`JSON`) or text (`request.responseText`)
- `request`: the request itself (`XMLHttpRequest`)

##### Function params

For POST and PUT you have `data` parameter, it can be a `FormData`, a encoded string (data serialization `foo=bar&morpheus=leader`) or an JSON-valid object.
As for the third argument you can pass an object to override the global configuration for this specific call (with the same keys as the global one).

## Examples

### Progress

```javascript
import Holen from './holen.mjs';

const formData = new FormData(document.querySelector(".my-form-with-file"));
Holen.posten("/endpoint", formData, {
  inArbeit: evt => {
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget/onprogress
    // evt.loaded -> the bytes the browser received
    // evt.total -> the total bytes set by the header
    if (evt.lengthComputable) {
      const percentComplete = (evt.loaded / evt.total) * 100;
    }
  }
});
// .Erfolg().Fehler().immer();
```

### Override options

```javascript
import Holen from './holen.mjs';

// Useful when you just need to login a user and return an session cookie to the browser
Holen.posten('/my-endpoint-sign-in', {user: 'Rick', password: 'blah'}, { mitZeugnisse: true });
```

### Override Holen static options

```javascript
import Holen from './holen.mjs';

// Now all calls from this point are going to have mitZeugnisse default to true
Holen.mitZeugnisse = true;
Holen.posten('/my-endpoint-sign-in', {user: 'Rick', password: 'blah'});
```