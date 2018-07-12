# Holen
Standalone AJAX library for modern browsers. Inspired by Angular's `$http` method.

## Configurations
```javascript
holen.Konfigurationeinstellen({
    contentType: '',
    withCredentials: false
});
```
- `contentType`: string, indicates the type of the data. (Default: `'application/x-www-form-urlencoded'`)
- `withCredentials`: boolean, indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies or authorization headers.
## API
#### GET
```javascript
holen.bekommen('/endpoint').Erfolg(function(response, request) {

}).Fehler(function(response, request) {

}).immer(function(response, request) {

});
```
#### PUT
```javascript
holen.stellen('/endpoint', data).Erfolg(function(response, request) {

}).Fehler(function(response, request) {

}).immer(function(response, request) {

});
```
#### POST
```javascript
holen.posten('/endpoint', data).Erfolg(function(response, request) {

}).Fehler(function(response, request) {

}).immer(function(response, request) {

});
```
#### DELETE
```javascript
holen.streichen('/endpoint').Erfolg(function(response, request) {

}).Fehler(function(response, request) {

}).immer(function(response, request) {

});
```

## Definitions
- `Erfolg`: callback, success
- `Fehler`: callback, fail
- `immer`: callback, always

##### Callback Params
- `response`: parsed data (`request.responseText`)
- `request`: the request itself (`XMLHttpRequest`)