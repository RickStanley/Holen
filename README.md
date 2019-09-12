# Holen
Yep, another standalone AJAX library for modern browsers... AUF DEUTSCH! Inspired by Angular's `$http` method.

## Configurations
```javascript
holen.Konfigurationeinstellen({
    contentType: '',
    withCredentials: false,
	xRequestedWith: true
});
```
- `contentType`: string, indicates the type of the data. (Default: `'application/x-www-form-urlencoded'`)
- `withCredentials`: boolean, indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies or authorization headers.
- `xRequestedWith`: boolean, should flag that this call is ajax?

## API

#### GET
```javascript
holen.bekommen('/endpoint').Erfolg(function(response, request, options?) {

}).Fehler(function(response, request) {

}).immer(function(response, request) {

});
```
#### PUT
```javascript
holen.stellen('/endpoint', data, customConfig).Erfolg(function(response, request, options?) {

}).Fehler(function(response, request) {

}).immer(function(response, request) {

});
```
#### POST
```javascript
holen.posten('/endpoint', data, customConfig).Erfolg(function(response, request, options?) {

}).Fehler(function(response, request) {

}).immer(function(response, request) {

});
```
#### DELETE
```javascript
holen.streichen('/endpoint').Erfolg(function(response, request, options?) {

}).Fehler(function(response, request) {

}).immer(function(response, request) {

});
```

## Function definitions
- `Erfolg`: callback, success
- `Fehler`: callback, fail
- `immer`: callback, always

##### Function params
For POST and PUT you have `data` parameter, it can be a `FormData`, a encoded string (data serialization `foo=bar&morpheus=leader`) or an JSON-valid object.
As for the third argument you can pass an object to override the global configuration for this specific call (with the same keys as the global one).

##### Callback Params
- `response`: parsed data or text (`request.responseText`)
- `request`: the request itself (`XMLHttpRequest`)