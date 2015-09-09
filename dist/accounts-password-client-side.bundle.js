//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;

/* Package-scope variables */
var Hook;

(function () {

//////////////////////////////////////////////////////////////////////////////////
//                                                                              //
// packages/callback-hook/hook.js                                               //
//                                                                              //
//////////////////////////////////////////////////////////////////////////////////
                                                                                //
// XXX This pattern is under development. Do not add more callsites             // 1
// using this package for now. See:                                             // 2
// https://meteor.hackpad.com/Design-proposal-Hooks-YxvgEW06q6f                 // 3
//                                                                              // 4
// Encapsulates the pattern of registering callbacks on a hook.                 // 5
//                                                                              // 6
// The `each` method of the hook calls its iterator function argument           // 7
// with each registered callback.  This allows the hook to                      // 8
// conditionally decide not to call the callback (if, for example, the          // 9
// observed object has been closed or terminated).                              // 10
//                                                                              // 11
// Callbacks are bound with `Meteor.bindEnvironment`, so they will be           // 12
// called with the Meteor environment of the calling code that                  // 13
// registered the callback.                                                     // 14
//                                                                              // 15
// Registering a callback returns an object with a single `stop`                // 16
// method which unregisters the callback.                                       // 17
//                                                                              // 18
// The code is careful to allow a callback to be safely unregistered            // 19
// while the callbacks are being iterated over.                                 // 20
//                                                                              // 21
// If the hook is configured with the `exceptionHandler` option, the            // 22
// handler will be called if a called callback throws an exception.             // 23
// By default (if the exception handler doesn't itself throw an                 // 24
// exception, or if the iterator function doesn't return a falsy value          // 25
// to terminate the calling of callbacks), the remaining callbacks              // 26
// will still be called.                                                        // 27
//                                                                              // 28
// Alternatively, the `debugPrintExceptions` option can be specified            // 29
// as string describing the callback.  On an exception the string and           // 30
// the exception will be printed to the console log with                        // 31
// `Meteor._debug`, and the exception otherwise ignored.                        // 32
//                                                                              // 33
// If an exception handler isn't specified, exceptions thrown in the            // 34
// callback will propagate up to the iterator function, and will                // 35
// terminate calling the remaining callbacks if not caught.                     // 36
                                                                                // 37
Hook = function (options) {                                                     // 38
  var self = this;                                                              // 39
  options = options || {};                                                      // 40
  self.nextCallbackId = 0;                                                      // 41
  self.callbacks = {};                                                          // 42
                                                                                // 43
  if (options.exceptionHandler)                                                 // 44
    self.exceptionHandler = options.exceptionHandler;                           // 45
  else if (options.debugPrintExceptions) {                                      // 46
    if (! _.isString(options.debugPrintExceptions))                             // 47
      throw new Error("Hook option debugPrintExceptions should be a string");   // 48
    self.exceptionHandler = options.debugPrintExceptions;                       // 49
  }                                                                             // 50
};                                                                              // 51
                                                                                // 52
_.extend(Hook.prototype, {                                                      // 53
  register: function (callback) {                                               // 54
    var self = this;                                                            // 55
                                                                                // 56
    callback = Meteor.bindEnvironment(                                          // 57
      callback,                                                                 // 58
      self.exceptionHandler || function (exception) {                           // 59
        // Note: this relies on the undocumented fact that if bindEnvironment's // 60
        // onException throws, and you are invoking the callback either in the  // 61
        // browser or from within a Fiber in Node, the exception is propagated. // 62
        throw exception;                                                        // 63
      }                                                                         // 64
    );                                                                          // 65
                                                                                // 66
    var id = self.nextCallbackId++;                                             // 67
    self.callbacks[id] = callback;                                              // 68
                                                                                // 69
    return {                                                                    // 70
      stop: function () {                                                       // 71
        delete self.callbacks[id];                                              // 72
      }                                                                         // 73
    };                                                                          // 74
  },                                                                            // 75
                                                                                // 76
  // For each registered callback, call the passed iterator function            // 77
  // with the callback.                                                         // 78
  //                                                                            // 79
  // The iterator function can choose whether or not to call the                // 80
  // callback.  (For example, it might not call the callback if the             // 81
  // observed object has been closed or terminated).                            // 82
  //                                                                            // 83
  // The iteration is stopped if the iterator function returns a falsy          // 84
  // value or throws an exception.                                              // 85
  //                                                                            // 86
  each: function (iterator) {                                                   // 87
    var self = this;                                                            // 88
                                                                                // 89
    // Invoking bindEnvironment'd callbacks outside of a Fiber in Node doesn't  // 90
    // run them to completion (and exceptions thrown from onException are not   // 91
    // propagated), so we need to be in a Fiber.                                // 92
    Meteor._nodeCodeMustBeInFiber();                                            // 93
                                                                                // 94
    var ids = _.keys(self.callbacks);                                           // 95
    for (var i = 0;  i < ids.length;  ++i) {                                    // 96
      var id = ids[i];                                                          // 97
      // check to see if the callback was removed during iteration              // 98
      if (_.has(self.callbacks, id)) {                                          // 99
        var callback = self.callbacks[id];                                      // 100
                                                                                // 101
        if (! iterator(callback))                                               // 102
          break;                                                                // 103
      }                                                                         // 104
    }                                                                           // 105
  }                                                                             // 106
});                                                                             // 107
                                                                                // 108
//////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['callback-hook'] = {
  Hook: Hook
};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Random = Package.random.Random;

(function () {

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// packages/localstorage/localstorage.js                                            //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
// Meteor._localStorage is not an ideal name, but we can change it later.           // 1
                                                                                    // 2
// Let's test to make sure that localStorage actually works. For example, in        // 3
// Safari with private browsing on, window.localStorage exists but actually         // 4
// trying to use it throws.                                                         // 5
// Accessing window.localStorage can also immediately throw an error in IE (#1291). // 6
                                                                                    // 7
var key = '_localstorage_test_' + Random.id();                                      // 8
var retrieved;                                                                      // 9
try {                                                                               // 10
  if (window.localStorage) {                                                        // 11
    window.localStorage.setItem(key, key);                                          // 12
    retrieved = window.localStorage.getItem(key);                                   // 13
    window.localStorage.removeItem(key);                                            // 14
  }                                                                                 // 15
} catch (e) {                                                                       // 16
  // ... ignore                                                                     // 17
}                                                                                   // 18
if (key === retrieved) {                                                            // 19
  Meteor._localStorage = {                                                          // 20
    getItem: function (key) {                                                       // 21
      return window.localStorage.getItem(key);                                      // 22
    },                                                                              // 23
    setItem: function (key, value) {                                                // 24
      window.localStorage.setItem(key, value);                                      // 25
    },                                                                              // 26
    removeItem: function (key) {                                                    // 27
      window.localStorage.removeItem(key);                                          // 28
    }                                                                               // 29
  };                                                                                // 30
}                                                                                   // 31
                                                                                    // 32
if (!Meteor._localStorage) {                                                        // 33
  Meteor._debug(                                                                    // 34
    "You are running a browser with no localStorage or userData "                   // 35
      + "support. Logging in from one tab will not cause another "                  // 36
      + "tab to be logged in.");                                                    // 37
                                                                                    // 38
  Meteor._localStorage = {                                                          // 39
    _data: {},                                                                      // 40
                                                                                    // 41
    setItem: function (key, val) {                                                  // 42
      this._data[key] = val;                                                        // 43
    },                                                                              // 44
    removeItem: function (key) {                                                    // 45
      delete this._data[key];                                                       // 46
    },                                                                              // 47
    getItem: function (key) {                                                       // 48
      var value = this._data[key];                                                  // 49
      if (value === undefined)                                                      // 50
        return null;                                                                // 51
      else                                                                          // 52
        return value;                                                               // 53
    }                                                                               // 54
  };                                                                                // 55
}                                                                                   // 56
                                                                                    // 57
//////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.localstorage = {};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Random = Package.random.Random;
var Hook = Package['callback-hook'].Hook;
var DDP = Package.ddp.DDP;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var Accounts, AccountsTest, EXPIRE_TOKENS_INTERVAL_MS, CONNECTION_CLOSE_DELAY_MS, getTokenLifetimeMs, onLoginHook, onLoginFailureHook, autoLoginEnabled, tokenRegex, match, makeClientLoggedOut, makeClientLoggedIn, storeLoginToken, unstoreLoginToken, storedLoginToken, storedLoginTokenExpires;

(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/accounts-base/accounts_common.js                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
/**                                                                                                                  // 1
 * @namespace Accounts                                                                                               // 2
 * @summary The namespace for all accounts-related methods.                                                          // 3
 */                                                                                                                  // 4
Accounts = {};                                                                                                       // 5
                                                                                                                     // 6
// Currently this is read directly by packages like accounts-password                                                // 7
// and accounts-ui-unstyled.                                                                                         // 8
Accounts._options = {};                                                                                              // 9
                                                                                                                     // 10
// how long (in days) until a login token expires                                                                    // 11
var DEFAULT_LOGIN_EXPIRATION_DAYS = 90;                                                                              // 12
// Clients don't try to auto-login with a token that is going to expire within                                       // 13
// .1 * DEFAULT_LOGIN_EXPIRATION_DAYS, capped at MIN_TOKEN_LIFETIME_CAP_SECS.                                        // 14
// Tries to avoid abrupt disconnects from expiring tokens.                                                           // 15
var MIN_TOKEN_LIFETIME_CAP_SECS = 3600; // one hour                                                                  // 16
// how often (in milliseconds) we check for expired tokens                                                           // 17
EXPIRE_TOKENS_INTERVAL_MS = 600 * 1000; // 10 minutes                                                                // 18
// how long we wait before logging out clients when Meteor.logoutOtherClients is                                     // 19
// called                                                                                                            // 20
CONNECTION_CLOSE_DELAY_MS = 10 * 1000;                                                                               // 21
                                                                                                                     // 22
// Set up config for the accounts system. Call this on both the client                                               // 23
// and the server.                                                                                                   // 24
//                                                                                                                   // 25
// XXX we should add some enforcement that this is called on both the                                                // 26
// client and the server. Otherwise, a user can                                                                      // 27
// 'forbidClientAccountCreation' only on the client and while it looks                                               // 28
// like their app is secure, the server will still accept createUser                                                 // 29
// calls. https://github.com/meteor/meteor/issues/828                                                                // 30
//                                                                                                                   // 31
// @param options {Object} an object with fields:                                                                    // 32
// - sendVerificationEmail {Boolean}                                                                                 // 33
//     Send email address verification emails to new users created from                                              // 34
//     client signups.                                                                                               // 35
// - forbidClientAccountCreation {Boolean}                                                                           // 36
//     Do not allow clients to create accounts directly.                                                             // 37
// - restrictCreationByEmailDomain {Function or String}                                                              // 38
//     Require created users to have an email matching the function or                                               // 39
//     having the string as domain.                                                                                  // 40
// - loginExpirationInDays {Number}                                                                                  // 41
//     Number of days since login until a user is logged out (login token                                            // 42
//     expires).                                                                                                     // 43
                                                                                                                     // 44
/**                                                                                                                  // 45
 * @summary Set global accounts options.                                                                             // 46
 * @locus Anywhere                                                                                                   // 47
 * @param {Object} options                                                                                           // 48
 * @param {Boolean} options.sendVerificationEmail New users with an email address will receive an address verification email.
 * @param {Boolean} options.forbidClientAccountCreation Calls to [`createUser`](#accounts_createuser) from the client will be rejected. In addition, if you are using [accounts-ui](#accountsui), the "Create account" link will not be available.
 * @param {String | Function} options.restrictCreationByEmailDomain If set to a string, only allows new users if the domain part of their email address matches the string. If set to a function, only allows new users if the function returns true.  The function is passed the full email address of the proposed new user.  Works with password-based sign-in and external services that expose email addresses (Google, Facebook, GitHub). All existing users still can log in after enabling this option. Example: `Accounts.config({ restrictCreationByEmailDomain: 'school.edu' })`.
 * @param {Number} options.loginExpirationInDays The number of days from when a user logs in until their token expires and they are logged out. Defaults to 90. Set to `null` to disable login expiration.
 * @param {String} options.oauthSecretKey When using the `oauth-encryption` package, the 16 byte key using to encrypt sensitive account credentials in the database, encoded in base64.  This option may only be specifed on the server.  See packages/oauth-encryption/README.md for details.
 */                                                                                                                  // 54
Accounts.config = function(options) {                                                                                // 55
  // We don't want users to accidentally only call Accounts.config on the                                            // 56
  // client, where some of the options will have partial effects (eg removing                                        // 57
  // the "create account" button from accounts-ui if forbidClientAccountCreation                                     // 58
  // is set, or redirecting Google login to a specific-domain page) without                                          // 59
  // having their full effects.                                                                                      // 60
  if (Meteor.isServer) {                                                                                             // 61
    __meteor_runtime_config__.accountsConfigCalled = true;                                                           // 62
  } else if (!__meteor_runtime_config__.accountsConfigCalled) {                                                      // 63
    // XXX would be nice to "crash" the client and replace the UI with an error                                      // 64
    // message, but there's no trivial way to do this.                                                               // 65
    Meteor._debug("Accounts.config was called on the client but not on the " +                                       // 66
                  "server; some configuration options may not take effect.");                                        // 67
  }                                                                                                                  // 68
                                                                                                                     // 69
  // We need to validate the oauthSecretKey option at the time                                                       // 70
  // Accounts.config is called. We also deliberately don't store the                                                 // 71
  // oauthSecretKey in Accounts._options.                                                                            // 72
  if (_.has(options, "oauthSecretKey")) {                                                                            // 73
    if (Meteor.isClient)                                                                                             // 74
      throw new Error("The oauthSecretKey option may only be specified on the server");                              // 75
    if (! Package["oauth-encryption"])                                                                               // 76
      throw new Error("The oauth-encryption package must be loaded to set oauthSecretKey");                          // 77
    Package["oauth-encryption"].OAuthEncryption.loadKey(options.oauthSecretKey);                                     // 78
    options = _.omit(options, "oauthSecretKey");                                                                     // 79
  }                                                                                                                  // 80
                                                                                                                     // 81
  // validate option keys                                                                                            // 82
  var VALID_KEYS = ["sendVerificationEmail", "forbidClientAccountCreation",                                          // 83
                    "restrictCreationByEmailDomain", "loginExpirationInDays"];                                       // 84
  _.each(_.keys(options), function (key) {                                                                           // 85
    if (!_.contains(VALID_KEYS, key)) {                                                                              // 86
      throw new Error("Accounts.config: Invalid key: " + key);                                                       // 87
    }                                                                                                                // 88
  });                                                                                                                // 89
                                                                                                                     // 90
  // set values in Accounts._options                                                                                 // 91
  _.each(VALID_KEYS, function (key) {                                                                                // 92
    if (key in options) {                                                                                            // 93
      if (key in Accounts._options) {                                                                                // 94
        throw new Error("Can't set `" + key + "` more than once");                                                   // 95
      } else {                                                                                                       // 96
        Accounts._options[key] = options[key];                                                                       // 97
      }                                                                                                              // 98
    }                                                                                                                // 99
  });                                                                                                                // 100
                                                                                                                     // 101
  // If the user set loginExpirationInDays to null, then we need to clear the                                        // 102
  // timer that periodically expires tokens.                                                                         // 103
  if (Meteor.isServer)                                                                                               // 104
    maybeStopExpireTokensInterval();                                                                                 // 105
};                                                                                                                   // 106
                                                                                                                     // 107
if (Meteor.isClient) {                                                                                               // 108
  // The connection used by the Accounts system. This is the connection                                              // 109
  // that will get logged in by Meteor.login(), and this is the                                                      // 110
  // connection whose login state will be reflected by Meteor.userId().                                              // 111
  //                                                                                                                 // 112
  // It would be much preferable for this to be in accounts_client.js,                                               // 113
  // but it has to be here because it's needed to create the                                                         // 114
  // Meteor.users collection.                                                                                        // 115
  Accounts.connection = Meteor.connection;                                                                           // 116
                                                                                                                     // 117
  if (typeof __meteor_runtime_config__ !== "undefined" &&                                                            // 118
      __meteor_runtime_config__.ACCOUNTS_CONNECTION_URL) {                                                           // 119
    // Temporary, internal hook to allow the server to point the client                                              // 120
    // to a different authentication server. This is for a very                                                      // 121
    // particular use case that comes up when implementing a oauth                                                   // 122
    // server. Unsupported and may go away at any point in time.                                                     // 123
    //                                                                                                               // 124
    // We will eventually provide a general way to use account-base                                                  // 125
    // against any DDP connection, not just one special one.                                                         // 126
    Accounts.connection = DDP.connect(                                                                               // 127
      __meteor_runtime_config__.ACCOUNTS_CONNECTION_URL)                                                             // 128
  }                                                                                                                  // 129
}                                                                                                                    // 130
                                                                                                                     // 131
// Users table. Don't use the normal autopublish, since we want to hide                                              // 132
// some fields. Code to autopublish this is in accounts_server.js.                                                   // 133
// XXX Allow users to configure this collection name.                                                                // 134
                                                                                                                     // 135
/**                                                                                                                  // 136
 * @summary A [Mongo.Collection](#collections) containing user documents.                                            // 137
 * @locus Anywhere                                                                                                   // 138
 * @type {Mongo.Collection}                                                                                          // 139
 */                                                                                                                  // 140
Meteor.users = new Mongo.Collection("users", {                                                                       // 141
  _preventAutopublish: true,                                                                                         // 142
  connection: Meteor.isClient ? Accounts.connection : Meteor.connection                                              // 143
});                                                                                                                  // 144
// There is an allow call in accounts_server that restricts this                                                     // 145
// collection.                                                                                                       // 146
                                                                                                                     // 147
// loginServiceConfiguration and ConfigError are maintained for backwards compatibility                              // 148
Meteor.startup(function () {                                                                                         // 149
  var ServiceConfiguration =                                                                                         // 150
    Package['service-configuration'].ServiceConfiguration;                                                           // 151
  Accounts.loginServiceConfiguration = ServiceConfiguration.configurations;                                          // 152
  Accounts.ConfigError = ServiceConfiguration.ConfigError;                                                           // 153
});                                                                                                                  // 154
                                                                                                                     // 155
// Thrown when the user cancels the login process (eg, closes an oauth                                               // 156
// popup, declines retina scan, etc)                                                                                 // 157
Accounts.LoginCancelledError = function(description) {                                                               // 158
  this.message = description;                                                                                        // 159
};                                                                                                                   // 160
                                                                                                                     // 161
// This is used to transmit specific subclass errors over the wire. We should                                        // 162
// come up with a more generic way to do this (eg, with some sort of symbolic                                        // 163
// error code rather than a number).                                                                                 // 164
Accounts.LoginCancelledError.numericError = 0x8acdc2f;                                                               // 165
Accounts.LoginCancelledError.prototype = new Error();                                                                // 166
Accounts.LoginCancelledError.prototype.name = 'Accounts.LoginCancelledError';                                        // 167
                                                                                                                     // 168
getTokenLifetimeMs = function () {                                                                                   // 169
  return (Accounts._options.loginExpirationInDays ||                                                                 // 170
          DEFAULT_LOGIN_EXPIRATION_DAYS) * 24 * 60 * 60 * 1000;                                                      // 171
};                                                                                                                   // 172
                                                                                                                     // 173
Accounts._tokenExpiration = function (when) {                                                                        // 174
  // We pass when through the Date constructor for backwards compatibility;                                          // 175
  // `when` used to be a number.                                                                                     // 176
  return new Date((new Date(when)).getTime() + getTokenLifetimeMs());                                                // 177
};                                                                                                                   // 178
                                                                                                                     // 179
Accounts._tokenExpiresSoon = function (when) {                                                                       // 180
  var minLifetimeMs = .1 * getTokenLifetimeMs();                                                                     // 181
  var minLifetimeCapMs = MIN_TOKEN_LIFETIME_CAP_SECS * 1000;                                                         // 182
  if (minLifetimeMs > minLifetimeCapMs)                                                                              // 183
    minLifetimeMs = minLifetimeCapMs;                                                                                // 184
  return new Date() > (new Date(when) - minLifetimeMs);                                                              // 185
};                                                                                                                   // 186
                                                                                                                     // 187
// Callback exceptions are printed with Meteor._debug and ignored.                                                   // 188
onLoginHook = new Hook({                                                                                             // 189
  debugPrintExceptions: "onLogin callback"                                                                           // 190
});                                                                                                                  // 191
onLoginFailureHook = new Hook({                                                                                      // 192
  debugPrintExceptions: "onLoginFailure callback"                                                                    // 193
});                                                                                                                  // 194
                                                                                                                     // 195
                                                                                                                     // 196
/**                                                                                                                  // 197
 * @summary Register a callback to be called after a login attempt succeeds.                                         // 198
 * @locus Anywhere                                                                                                   // 199
 * @param {Function} func The callback to be called when login is successful.                                        // 200
 */                                                                                                                  // 201
Accounts.onLogin = function (func) {                                                                                 // 202
  return onLoginHook.register(func);                                                                                 // 203
};                                                                                                                   // 204
                                                                                                                     // 205
/**                                                                                                                  // 206
 * @summary Register a callback to be called after a login attempt fails.                                            // 207
 * @locus Anywhere                                                                                                   // 208
 * @param {Function} func The callback to be called after the login has failed.                                      // 209
 */                                                                                                                  // 210
Accounts.onLoginFailure = function (func) {                                                                          // 211
  return onLoginFailureHook.register(func);                                                                          // 212
};                                                                                                                   // 213
                                                                                                                     // 214
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/accounts-base/url_client.js                                                                              //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// By default, allow the autologin process to happen                                                                 // 1
autoLoginEnabled = true;                                                                                             // 2
                                                                                                                     // 3
// All of the special hash URLs we support for accounts interactions                                                 // 4
var accountsPaths = ["reset-password", "verify-email", "enroll-account"];                                            // 5
                                                                                                                     // 6
// Separate out this functionality for testing                                                                       // 7
var attemptToMatchHash = function (hash, success) {                                                                  // 8
  _.each(accountsPaths, function (urlPart) {                                                                         // 9
    var token;                                                                                                       // 10
                                                                                                                     // 11
    tokenRegex = new RegExp("^\\#\\/" + urlPart + "\\/(.*)$");                                                       // 12
    match = hash.match(tokenRegex);                                                                                  // 13
                                                                                                                     // 14
    if (match) {                                                                                                     // 15
      token = match[1];                                                                                              // 16
                                                                                                                     // 17
      // XXX COMPAT WITH 0.9.3                                                                                       // 18
      if (urlPart === "reset-password") {                                                                            // 19
        Accounts._resetPasswordToken = token;                                                                        // 20
      } else if (urlPart === "verify-email") {                                                                       // 21
        Accounts._verifyEmailToken = token;                                                                          // 22
      } else if (urlPart === "enroll-account") {                                                                     // 23
        Accounts._enrollAccountToken = token;                                                                        // 24
      }                                                                                                              // 25
    } else {                                                                                                         // 26
      return;                                                                                                        // 27
    }                                                                                                                // 28
                                                                                                                     // 29
    // Do some stuff with the token we matched                                                                       // 30
    success(token, urlPart);                                                                                         // 31
  });                                                                                                                // 32
};                                                                                                                   // 33
                                                                                                                     // 34
// We only support one callback per URL                                                                              // 35
var accountsCallbacks = {};                                                                                          // 36
                                                                                                                     // 37
// The UI flow will call this when done to log in the existing person                                                // 38
var enableAutoLogin = function () {                                                                                  // 39
  Accounts._enableAutoLogin();                                                                                       // 40
};                                                                                                                   // 41
                                                                                                                     // 42
// Actually call the function, has to happen in the top level so that we can                                         // 43
// mess with autoLoginEnabled.                                                                                       // 44
attemptToMatchHash(window.location.hash, function (token, urlPart) {                                                 // 45
  // put login in a suspended state to wait for the interaction to finish                                            // 46
  autoLoginEnabled = false;                                                                                          // 47
                                                                                                                     // 48
  // reset the URL                                                                                                   // 49
  window.location.hash = "";                                                                                         // 50
                                                                                                                     // 51
  // wait for other packages to register callbacks                                                                   // 52
  Meteor.startup(function () {                                                                                       // 53
    // if a callback has been registered for this kind of token, call it                                             // 54
    if (accountsCallbacks[urlPart]) {                                                                                // 55
      accountsCallbacks[urlPart](token, enableAutoLogin);                                                            // 56
    }                                                                                                                // 57
  });                                                                                                                // 58
});                                                                                                                  // 59
                                                                                                                     // 60
// Export for testing                                                                                                // 61
AccountsTest = {                                                                                                     // 62
  attemptToMatchHash: attemptToMatchHash                                                                             // 63
};                                                                                                                   // 64
                                                                                                                     // 65
// XXX these should be moved to accounts-password eventually. Right now                                              // 66
// this is prevented by the need to set autoLoginEnabled=false, but in                                               // 67
// some bright future we won't need to do that anymore.                                                              // 68
                                                                                                                     // 69
/**                                                                                                                  // 70
 * @summary Register a function to call when a reset password link is clicked                                        // 71
 * in an email sent by                                                                                               // 72
 * [`Accounts.sendResetPasswordEmail`](#accounts_sendresetpasswordemail).                                            // 73
 * This function should be called in top-level code, not inside                                                      // 74
 * `Meteor.startup()`.                                                                                               // 75
 * @param  {Function} callback The function to call. It is given two arguments:                                      // 76
 *                                                                                                                   // 77
 * 1. `token`: A password reset token that can be passed to                                                          // 78
 * [`Accounts.resetPassword`](#accounts_resetpassword).                                                              // 79
 * 2. `done`: A function to call when the password reset UI flow is complete. The normal                             // 80
 * login process is suspended until this function is called, so that the                                             // 81
 * password for user A can be reset even if user B was logged in.                                                    // 82
 * @locus Client                                                                                                     // 83
 */                                                                                                                  // 84
Accounts.onResetPasswordLink = function (callback) {                                                                 // 85
  if (accountsCallbacks["reset-password"]) {                                                                         // 86
    Meteor._debug("Accounts.onResetPasswordLink was called more than once. " +                                       // 87
      "Only one callback added will be executed.");                                                                  // 88
  }                                                                                                                  // 89
                                                                                                                     // 90
  accountsCallbacks["reset-password"] = callback;                                                                    // 91
};                                                                                                                   // 92
                                                                                                                     // 93
/**                                                                                                                  // 94
 * @summary Register a function to call when an email verification link is                                           // 95
 * clicked in an email sent by                                                                                       // 96
 * [`Accounts.sendVerificationEmail`](#accounts_sendverificationemail).                                              // 97
 * This function should be called in top-level code, not inside                                                      // 98
 * `Meteor.startup()`.                                                                                               // 99
 * @param  {Function} callback The function to call. It is given two arguments:                                      // 100
 *                                                                                                                   // 101
 * 1. `token`: An email verification token that can be passed to                                                     // 102
 * [`Accounts.verifyEmail`](#accounts_verifyemail).                                                                  // 103
 * 2. `done`: A function to call when the email verification UI flow is complete.                                    // 104
 * The normal login process is suspended until this function is called, so                                           // 105
 * that the user can be notified that they are verifying their email before                                          // 106
 * being logged in.                                                                                                  // 107
 * @locus Client                                                                                                     // 108
 */                                                                                                                  // 109
Accounts.onEmailVerificationLink = function (callback) {                                                             // 110
  if (accountsCallbacks["verify-email"]) {                                                                           // 111
    Meteor._debug("Accounts.onEmailVerificationLink was called more than once. " +                                   // 112
      "Only one callback added will be executed.");                                                                  // 113
  }                                                                                                                  // 114
                                                                                                                     // 115
  accountsCallbacks["verify-email"] = callback;                                                                      // 116
};                                                                                                                   // 117
                                                                                                                     // 118
/**                                                                                                                  // 119
 * @summary Register a function to call when an account enrollment link is                                           // 120
 * clicked in an email sent by                                                                                       // 121
 * [`Accounts.sendEnrollmentEmail`](#accounts_sendenrollmentemail).                                                  // 122
 * This function should be called in top-level code, not inside                                                      // 123
 * `Meteor.startup()`.                                                                                               // 124
 * @param  {Function} callback The function to call. It is given two arguments:                                      // 125
 *                                                                                                                   // 126
 * 1. `token`: A password reset token that can be passed to                                                          // 127
 * [`Accounts.resetPassword`](#accounts_resetpassword) to give the newly                                             // 128
 * enrolled account a password.                                                                                      // 129
 * 2. `done`: A function to call when the enrollment UI flow is complete.                                            // 130
 * The normal login process is suspended until this function is called, so that                                      // 131
 * user A can be enrolled even if user B was logged in.                                                              // 132
 * @locus Client                                                                                                     // 133
 */                                                                                                                  // 134
Accounts.onEnrollmentLink = function (callback) {                                                                    // 135
  if (accountsCallbacks["enroll-account"]) {                                                                         // 136
    Meteor._debug("Accounts.onEnrollmentLink was called more than once. " +                                          // 137
      "Only one callback added will be executed.");                                                                  // 138
  }                                                                                                                  // 139
                                                                                                                     // 140
  accountsCallbacks["enroll-account"] = callback;                                                                    // 141
};                                                                                                                   // 142
                                                                                                                     // 143
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/accounts-base/accounts_client.js                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
///                                                                                                                  // 1
/// CURRENT USER                                                                                                     // 2
///                                                                                                                  // 3
                                                                                                                     // 4
// This is reactive.                                                                                                 // 5
                                                                                                                     // 6
/**                                                                                                                  // 7
 * @summary Get the current user id, or `null` if no user is logged in. A reactive data source.                      // 8
 * @locus Anywhere but publish functions                                                                             // 9
 */                                                                                                                  // 10
Meteor.userId = function () {                                                                                        // 11
  return Accounts.connection.userId();                                                                               // 12
};                                                                                                                   // 13
                                                                                                                     // 14
var loggingIn = false;                                                                                               // 15
var loggingInDeps = new Tracker.Dependency;                                                                          // 16
// This is mostly just called within this file, but Meteor.loginWithPassword                                         // 17
// also uses it to make loggingIn() be true during the beginPasswordExchange                                         // 18
// method call too.                                                                                                  // 19
Accounts._setLoggingIn = function (x) {                                                                              // 20
  if (loggingIn !== x) {                                                                                             // 21
    loggingIn = x;                                                                                                   // 22
    loggingInDeps.changed();                                                                                         // 23
  }                                                                                                                  // 24
};                                                                                                                   // 25
                                                                                                                     // 26
/**                                                                                                                  // 27
 * @summary True if a login method (such as `Meteor.loginWithPassword`, `Meteor.loginWithFacebook`, or `Accounts.createUser`) is currently in progress. A reactive data source.
 * @locus Client                                                                                                     // 29
 */                                                                                                                  // 30
Meteor.loggingIn = function () {                                                                                     // 31
  loggingInDeps.depend();                                                                                            // 32
  return loggingIn;                                                                                                  // 33
};                                                                                                                   // 34
                                                                                                                     // 35
// This calls userId, which is reactive.                                                                             // 36
                                                                                                                     // 37
/**                                                                                                                  // 38
 * @summary Get the current user record, or `null` if no user is logged in. A reactive data source.                  // 39
 * @locus Anywhere but publish functions                                                                             // 40
 */                                                                                                                  // 41
Meteor.user = function () {                                                                                          // 42
  var userId = Meteor.userId();                                                                                      // 43
  if (!userId)                                                                                                       // 44
    return null;                                                                                                     // 45
  return Meteor.users.findOne(userId);                                                                               // 46
};                                                                                                                   // 47
                                                                                                                     // 48
///                                                                                                                  // 49
/// LOGIN METHODS                                                                                                    // 50
///                                                                                                                  // 51
                                                                                                                     // 52
// Call a login method on the server.                                                                                // 53
//                                                                                                                   // 54
// A login method is a method which on success calls `this.setUserId(id)` and                                        // 55
// `Accounts._setLoginToken` on the server and returns an object with fields                                         // 56
// 'id' (containing the user id), 'token' (containing a resume token), and                                           // 57
// optionally `tokenExpires`.                                                                                        // 58
//                                                                                                                   // 59
// This function takes care of:                                                                                      // 60
//   - Updating the Meteor.loggingIn() reactive data source                                                          // 61
//   - Calling the method in 'wait' mode                                                                             // 62
//   - On success, saving the resume token to localStorage                                                           // 63
//   - On success, calling Accounts.connection.setUserId()                                                           // 64
//   - Setting up an onReconnect handler which logs in with                                                          // 65
//     the resume token                                                                                              // 66
//                                                                                                                   // 67
// Options:                                                                                                          // 68
// - methodName: The method to call (default 'login')                                                                // 69
// - methodArguments: The arguments for the method                                                                   // 70
// - validateResult: If provided, will be called with the result of the                                              // 71
//                 method. If it throws, the client will not be logged in (and                                       // 72
//                 its error will be passed to the callback).                                                        // 73
// - userCallback: Will be called with no arguments once the user is fully                                           // 74
//                 logged in, or with the error on error.                                                            // 75
//                                                                                                                   // 76
Accounts.callLoginMethod = function (options) {                                                                      // 77
  options = _.extend({                                                                                               // 78
    methodName: 'login',                                                                                             // 79
    methodArguments: [{}],                                                                                           // 80
    _suppressLoggingIn: false                                                                                        // 81
  }, options);                                                                                                       // 82
  // Set defaults for callback arguments to no-op functions; make sure we                                            // 83
  // override falsey values too.                                                                                     // 84
  _.each(['validateResult', 'userCallback'], function (f) {                                                          // 85
    if (!options[f])                                                                                                 // 86
      options[f] = function () {};                                                                                   // 87
  });                                                                                                                // 88
  // Prepare callbacks: user provided and onLogin/onLoginFailure hooks.                                              // 89
  var loginCallbacks = _.once(function (error) {                                                                     // 90
    if (!error) {                                                                                                    // 91
      onLoginHook.each(function (callback) {                                                                         // 92
        callback();                                                                                                  // 93
      });                                                                                                            // 94
    } else {                                                                                                         // 95
      onLoginFailureHook.each(function (callback) {                                                                  // 96
        callback();                                                                                                  // 97
      });                                                                                                            // 98
    }                                                                                                                // 99
    options.userCallback.apply(this, arguments);                                                                     // 100
  });                                                                                                                // 101
                                                                                                                     // 102
  var reconnected = false;                                                                                           // 103
                                                                                                                     // 104
  // We want to set up onReconnect as soon as we get a result token back from                                        // 105
  // the server, without having to wait for subscriptions to rerun. This is                                          // 106
  // because if we disconnect and reconnect between getting the result and                                           // 107
  // getting the results of subscription rerun, we WILL NOT re-send this                                             // 108
  // method (because we never re-send methods whose results we've received)                                          // 109
  // but we WILL call loggedInAndDataReadyCallback at "reconnect quiesce"                                            // 110
  // time. This will lead to makeClientLoggedIn(result.id) even though we                                            // 111
  // haven't actually sent a login method!                                                                           // 112
  //                                                                                                                 // 113
  // But by making sure that we send this "resume" login in that case (and                                           // 114
  // calling makeClientLoggedOut if it fails), we'll end up with an accurate                                         // 115
  // client-side userId. (It's important that livedata_connection guarantees                                         // 116
  // that the "reconnect quiesce"-time call to loggedInAndDataReadyCallback                                          // 117
  // will occur before the callback from the resume login call.)                                                     // 118
  var onResultReceived = function (err, result) {                                                                    // 119
    if (err || !result || !result.token) {                                                                           // 120
      Accounts.connection.onReconnect = null;                                                                        // 121
    } else {                                                                                                         // 122
      Accounts.connection.onReconnect = function () {                                                                // 123
        reconnected = true;                                                                                          // 124
        // If our token was updated in storage, use the latest one.                                                  // 125
        var storedToken = storedLoginToken();                                                                        // 126
        if (storedToken) {                                                                                           // 127
          result = {                                                                                                 // 128
            token: storedToken,                                                                                      // 129
            tokenExpires: storedLoginTokenExpires()                                                                  // 130
          };                                                                                                         // 131
        }                                                                                                            // 132
        if (! result.tokenExpires)                                                                                   // 133
          result.tokenExpires = Accounts._tokenExpiration(new Date());                                               // 134
        if (Accounts._tokenExpiresSoon(result.tokenExpires)) {                                                       // 135
          makeClientLoggedOut();                                                                                     // 136
        } else {                                                                                                     // 137
          Accounts.callLoginMethod({                                                                                 // 138
            methodArguments: [{resume: result.token}],                                                               // 139
            // Reconnect quiescence ensures that the user doesn't see an                                             // 140
            // intermediate state before the login method finishes. So we don't                                      // 141
            // need to show a logging-in animation.                                                                  // 142
            _suppressLoggingIn: true,                                                                                // 143
            userCallback: function (error) {                                                                         // 144
              var storedTokenNow = storedLoginToken();                                                               // 145
              if (error) {                                                                                           // 146
                // If we had a login error AND the current stored token is the                                       // 147
                // one that we tried to log in with, then declare ourselves                                          // 148
                // logged out. If there's a token in storage but it's not the                                        // 149
                // token that we tried to log in with, we don't know anything                                        // 150
                // about whether that token is valid or not, so do nothing. The                                      // 151
                // periodic localStorage poll will decide if we are logged in or                                     // 152
                // out with this token, if it hasn't already. Of course, even                                        // 153
                // with this check, another tab could insert a new valid token                                       // 154
                // immediately before we clear localStorage here, which would                                        // 155
                // lead to both tabs being logged out, but by checking the token                                     // 156
                // in storage right now we hope to make that unlikely to happen.                                     // 157
                //                                                                                                   // 158
                // If there is no token in storage right now, we don't have to                                       // 159
                // do anything; whatever code removed the token from storage was                                     // 160
                // responsible for calling `makeClientLoggedOut()`, or the                                           // 161
                // periodic localStorage poll will call `makeClientLoggedOut`                                        // 162
                // eventually if another tab wiped the token from storage.                                           // 163
                if (storedTokenNow && storedTokenNow === result.token) {                                             // 164
                  makeClientLoggedOut();                                                                             // 165
                }                                                                                                    // 166
              }                                                                                                      // 167
              // Possibly a weird callback to call, but better than nothing if                                       // 168
              // there is a reconnect between "login result received" and "data                                      // 169
              // ready".                                                                                             // 170
              loginCallbacks(error);                                                                                 // 171
            }});                                                                                                     // 172
        }                                                                                                            // 173
      };                                                                                                             // 174
    }                                                                                                                // 175
  };                                                                                                                 // 176
                                                                                                                     // 177
  // This callback is called once the local cache of the current-user                                                // 178
  // subscription (and all subscriptions, in fact) are guaranteed to be up to                                        // 179
  // date.                                                                                                           // 180
  var loggedInAndDataReadyCallback = function (error, result) {                                                      // 181
    // If the login method returns its result but the connection is lost                                             // 182
    // before the data is in the local cache, it'll set an onReconnect (see                                          // 183
    // above). The onReconnect will try to log in using the token, and *it*                                          // 184
    // will call userCallback via its own version of this                                                            // 185
    // loggedInAndDataReadyCallback. So we don't have to do anything here.                                           // 186
    if (reconnected)                                                                                                 // 187
      return;                                                                                                        // 188
                                                                                                                     // 189
    // Note that we need to call this even if _suppressLoggingIn is true,                                            // 190
    // because it could be matching a _setLoggingIn(true) from a                                                     // 191
    // half-completed pre-reconnect login method.                                                                    // 192
    Accounts._setLoggingIn(false);                                                                                   // 193
    if (error || !result) {                                                                                          // 194
      error = error || new Error(                                                                                    // 195
        "No result from call to " + options.methodName);                                                             // 196
      loginCallbacks(error);                                                                                         // 197
      return;                                                                                                        // 198
    }                                                                                                                // 199
    try {                                                                                                            // 200
      options.validateResult(result);                                                                                // 201
    } catch (e) {                                                                                                    // 202
      loginCallbacks(e);                                                                                             // 203
      return;                                                                                                        // 204
    }                                                                                                                // 205
                                                                                                                     // 206
    // Make the client logged in. (The user data should already be loaded!)                                          // 207
    makeClientLoggedIn(result.id, result.token, result.tokenExpires);                                                // 208
    loginCallbacks();                                                                                                // 209
  };                                                                                                                 // 210
                                                                                                                     // 211
  if (!options._suppressLoggingIn)                                                                                   // 212
    Accounts._setLoggingIn(true);                                                                                    // 213
  Accounts.connection.apply(                                                                                         // 214
    options.methodName,                                                                                              // 215
    options.methodArguments,                                                                                         // 216
    {wait: true, onResultReceived: onResultReceived},                                                                // 217
    loggedInAndDataReadyCallback);                                                                                   // 218
};                                                                                                                   // 219
                                                                                                                     // 220
makeClientLoggedOut = function() {                                                                                   // 221
  unstoreLoginToken();                                                                                               // 222
  Accounts.connection.setUserId(null);                                                                               // 223
  Accounts.connection.onReconnect = null;                                                                            // 224
};                                                                                                                   // 225
                                                                                                                     // 226
makeClientLoggedIn = function(userId, token, tokenExpires) {                                                         // 227
  storeLoginToken(userId, token, tokenExpires);                                                                      // 228
  Accounts.connection.setUserId(userId);                                                                             // 229
};                                                                                                                   // 230
                                                                                                                     // 231
/**                                                                                                                  // 232
 * @summary Log the user out.                                                                                        // 233
 * @locus Client                                                                                                     // 234
 * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */                                                                                                                  // 236
Meteor.logout = function (callback) {                                                                                // 237
  Accounts.connection.apply('logout', [], {wait: true}, function(error, result) {                                    // 238
    if (error) {                                                                                                     // 239
      callback && callback(error);                                                                                   // 240
    } else {                                                                                                         // 241
      makeClientLoggedOut();                                                                                         // 242
      callback && callback();                                                                                        // 243
    }                                                                                                                // 244
  });                                                                                                                // 245
};                                                                                                                   // 246
                                                                                                                     // 247
/**                                                                                                                  // 248
 * @summary Log out other clients logged in as the current user, but does not log out the client that calls this function.
 * @locus Client                                                                                                     // 250
 * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */                                                                                                                  // 252
Meteor.logoutOtherClients = function (callback) {                                                                    // 253
  // We need to make two method calls: one to replace our current token,                                             // 254
  // and another to remove all tokens except the current one. We want to                                             // 255
  // call these two methods one after the other, without any other                                                   // 256
  // methods running between them. For example, we don't want `logout`                                               // 257
  // to be called in between our two method calls (otherwise the second                                              // 258
  // method call would return an error). Another example: we don't want                                              // 259
  // logout to be called before the callback for `getNewToken`;                                                      // 260
  // otherwise we would momentarily log the user out and then write a                                                // 261
  // new token to localStorage.                                                                                      // 262
  //                                                                                                                 // 263
  // To accomplish this, we make both calls as wait methods, and queue                                               // 264
  // them one after the other, without spinning off the event loop in                                                // 265
  // between. Even though we queue `removeOtherTokens` before                                                        // 266
  // `getNewToken`, we won't actually send the `removeOtherTokens` call                                              // 267
  // until the `getNewToken` callback has finished running, because they                                             // 268
  // are both wait methods.                                                                                          // 269
  Accounts.connection.apply(                                                                                         // 270
    'getNewToken',                                                                                                   // 271
    [],                                                                                                              // 272
    { wait: true },                                                                                                  // 273
    function (err, result) {                                                                                         // 274
      if (! err) {                                                                                                   // 275
        storeLoginToken(Meteor.userId(), result.token, result.tokenExpires);                                         // 276
      }                                                                                                              // 277
    }                                                                                                                // 278
  );                                                                                                                 // 279
  Accounts.connection.apply(                                                                                         // 280
    'removeOtherTokens',                                                                                             // 281
    [],                                                                                                              // 282
    { wait: true },                                                                                                  // 283
    function (err) {                                                                                                 // 284
      callback && callback(err);                                                                                     // 285
    }                                                                                                                // 286
  );                                                                                                                 // 287
};                                                                                                                   // 288
                                                                                                                     // 289
                                                                                                                     // 290
///                                                                                                                  // 291
/// LOGIN SERVICES                                                                                                   // 292
///                                                                                                                  // 293
                                                                                                                     // 294
var loginServicesHandle =                                                                                            // 295
  Accounts.connection.subscribe("meteor.loginServiceConfiguration");                                                 // 296
                                                                                                                     // 297
// A reactive function returning whether the loginServiceConfiguration                                               // 298
// subscription is ready. Used by accounts-ui to hide the login button                                               // 299
// until we have all the configuration loaded                                                                        // 300
//                                                                                                                   // 301
Accounts.loginServicesConfigured = function () {                                                                     // 302
  return loginServicesHandle.ready();                                                                                // 303
};                                                                                                                   // 304
                                                                                                                     // 305
// Some login services such as the redirect login flow or the resume                                                 // 306
// login handler can log the user in at page load time.  The                                                         // 307
// Meteor.loginWithX functions have a callback argument, but the                                                     // 308
// callback function instance won't be in memory any longer if the                                                   // 309
// page was reloaded.  The `onPageLoadLogin` function allows a                                                       // 310
// callback to be registered for the case where the login was                                                        // 311
// initiated in a previous VM, and we now have the result of the login                                               // 312
// attempt in a new VM.                                                                                              // 313
                                                                                                                     // 314
var pageLoadLoginCallbacks = [];                                                                                     // 315
var pageLoadLoginAttemptInfo = null;                                                                                 // 316
                                                                                                                     // 317
// Register a callback to be called if we have information about a                                                   // 318
// login attempt at page load time.  Call the callback immediately if                                                // 319
// we already have the page load login attempt info, otherwise stash                                                 // 320
// the callback to be called if and when we do get the attempt info.                                                 // 321
//                                                                                                                   // 322
Accounts.onPageLoadLogin = function (f) {                                                                            // 323
  if (pageLoadLoginAttemptInfo)                                                                                      // 324
    f(pageLoadLoginAttemptInfo);                                                                                     // 325
  else                                                                                                               // 326
    pageLoadLoginCallbacks.push(f);                                                                                  // 327
};                                                                                                                   // 328
                                                                                                                     // 329
                                                                                                                     // 330
// Receive the information about the login attempt at page load time.                                                // 331
// Call registered callbacks, and also record the info in case                                                       // 332
// someone's callback hasn't been registered yet.                                                                    // 333
//                                                                                                                   // 334
Accounts._pageLoadLogin = function (attemptInfo) {                                                                   // 335
  if (pageLoadLoginAttemptInfo) {                                                                                    // 336
    Meteor._debug("Ignoring unexpected duplicate page load login attempt info");                                     // 337
    return;                                                                                                          // 338
  }                                                                                                                  // 339
  _.each(pageLoadLoginCallbacks, function (callback) { callback(attemptInfo); });                                    // 340
  pageLoadLoginCallbacks = [];                                                                                       // 341
  pageLoadLoginAttemptInfo = attemptInfo;                                                                            // 342
};                                                                                                                   // 343
                                                                                                                     // 344
                                                                                                                     // 345
///                                                                                                                  // 346
/// HANDLEBARS HELPERS                                                                                               // 347
///                                                                                                                  // 348
                                                                                                                     // 349
// If our app has a Blaze, register the {{currentUser}} and {{loggingIn}}                                            // 350
// global helpers.                                                                                                   // 351
if (Package.blaze) {                                                                                                 // 352
  /**                                                                                                                // 353
   * @global                                                                                                         // 354
   * @name  currentUser                                                                                              // 355
   * @isHelper true                                                                                                  // 356
   * @summary Calls [Meteor.user()](#meteor_user). Use `{{#if currentUser}}` to check whether the user is logged in. // 357
   */                                                                                                                // 358
  Package.blaze.Blaze.Template.registerHelper('currentUser', function () {                                           // 359
    return Meteor.user();                                                                                            // 360
  });                                                                                                                // 361
                                                                                                                     // 362
  /**                                                                                                                // 363
   * @global                                                                                                         // 364
   * @name  loggingIn                                                                                                // 365
   * @isHelper true                                                                                                  // 366
   * @summary Calls [Meteor.loggingIn()](#meteor_loggingin).                                                         // 367
   */                                                                                                                // 368
  Package.blaze.Blaze.Template.registerHelper('loggingIn', function () {                                             // 369
    return Meteor.loggingIn();                                                                                       // 370
  });                                                                                                                // 371
}                                                                                                                    // 372
                                                                                                                     // 373
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/accounts-base/localstorage_token.js                                                                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
// This file deals with storing a login token and user id in the                                                     // 1
// browser's localStorage facility. It polls local storage every few                                                 // 2
// seconds to synchronize login state between multiple tabs in the same                                              // 3
// browser.                                                                                                          // 4
                                                                                                                     // 5
var lastLoginTokenWhenPolled;                                                                                        // 6
                                                                                                                     // 7
// Login with a Meteor access token. This is the only public function                                                // 8
// here.                                                                                                             // 9
Meteor.loginWithToken = function (token, callback) {                                                                 // 10
  Accounts.callLoginMethod({                                                                                         // 11
    methodArguments: [{resume: token}],                                                                              // 12
    userCallback: callback});                                                                                        // 13
};                                                                                                                   // 14
                                                                                                                     // 15
// Semi-internal API. Call this function to re-enable auto login after                                               // 16
// if it was disabled at startup.                                                                                    // 17
Accounts._enableAutoLogin = function () {                                                                            // 18
  autoLoginEnabled = true;                                                                                           // 19
  pollStoredLoginToken();                                                                                            // 20
};                                                                                                                   // 21
                                                                                                                     // 22
                                                                                                                     // 23
///                                                                                                                  // 24
/// STORING                                                                                                          // 25
///                                                                                                                  // 26
                                                                                                                     // 27
// Key names to use in localStorage                                                                                  // 28
var loginTokenKey = "Meteor.loginToken";                                                                             // 29
var loginTokenExpiresKey = "Meteor.loginTokenExpires";                                                               // 30
var userIdKey = "Meteor.userId";                                                                                     // 31
                                                                                                                     // 32
// Call this from the top level of the test file for any test that does                                              // 33
// logging in and out, to protect multiple tabs running the same tests                                               // 34
// simultaneously from interfering with each others' localStorage.                                                   // 35
Accounts._isolateLoginTokenForTest = function () {                                                                   // 36
  loginTokenKey = loginTokenKey + Random.id();                                                                       // 37
  userIdKey = userIdKey + Random.id();                                                                               // 38
};                                                                                                                   // 39
                                                                                                                     // 40
storeLoginToken = function(userId, token, tokenExpires) {                                                            // 41
  Meteor._localStorage.setItem(userIdKey, userId);                                                                   // 42
  Meteor._localStorage.setItem(loginTokenKey, token);                                                                // 43
  if (! tokenExpires)                                                                                                // 44
    tokenExpires = Accounts._tokenExpiration(new Date());                                                            // 45
  Meteor._localStorage.setItem(loginTokenExpiresKey, tokenExpires);                                                  // 46
                                                                                                                     // 47
  // to ensure that the localstorage poller doesn't end up trying to                                                 // 48
  // connect a second time                                                                                           // 49
  lastLoginTokenWhenPolled = token;                                                                                  // 50
};                                                                                                                   // 51
                                                                                                                     // 52
unstoreLoginToken = function() {                                                                                     // 53
  Meteor._localStorage.removeItem(userIdKey);                                                                        // 54
  Meteor._localStorage.removeItem(loginTokenKey);                                                                    // 55
  Meteor._localStorage.removeItem(loginTokenExpiresKey);                                                             // 56
                                                                                                                     // 57
  // to ensure that the localstorage poller doesn't end up trying to                                                 // 58
  // connect a second time                                                                                           // 59
  lastLoginTokenWhenPolled = null;                                                                                   // 60
};                                                                                                                   // 61
                                                                                                                     // 62
// This is private, but it is exported for now because it is used by a                                               // 63
// test in accounts-password.                                                                                        // 64
//                                                                                                                   // 65
storedLoginToken = Accounts._storedLoginToken = function() {                                                         // 66
  return Meteor._localStorage.getItem(loginTokenKey);                                                                // 67
};                                                                                                                   // 68
                                                                                                                     // 69
storedLoginTokenExpires = function () {                                                                              // 70
  return Meteor._localStorage.getItem(loginTokenExpiresKey);                                                         // 71
};                                                                                                                   // 72
                                                                                                                     // 73
var storedUserId = function() {                                                                                      // 74
  return Meteor._localStorage.getItem(userIdKey);                                                                    // 75
};                                                                                                                   // 76
                                                                                                                     // 77
var unstoreLoginTokenIfExpiresSoon = function () {                                                                   // 78
  var tokenExpires = Meteor._localStorage.getItem(loginTokenExpiresKey);                                             // 79
  if (tokenExpires && Accounts._tokenExpiresSoon(new Date(tokenExpires)))                                            // 80
    unstoreLoginToken();                                                                                             // 81
};                                                                                                                   // 82
                                                                                                                     // 83
///                                                                                                                  // 84
/// AUTO-LOGIN                                                                                                       // 85
///                                                                                                                  // 86
                                                                                                                     // 87
if (autoLoginEnabled) {                                                                                              // 88
  // Immediately try to log in via local storage, so that any DDP                                                    // 89
  // messages are sent after we have established our user account                                                    // 90
  unstoreLoginTokenIfExpiresSoon();                                                                                  // 91
  var token = storedLoginToken();                                                                                    // 92
  if (token) {                                                                                                       // 93
    // On startup, optimistically present us as logged in while the                                                  // 94
    // request is in flight. This reduces page flicker on startup.                                                   // 95
    var userId = storedUserId();                                                                                     // 96
    userId && Accounts.connection.setUserId(userId);                                                                 // 97
    Meteor.loginWithToken(token, function (err) {                                                                    // 98
      if (err) {                                                                                                     // 99
        Meteor._debug("Error logging in with token: " + err);                                                        // 100
        makeClientLoggedOut();                                                                                       // 101
      }                                                                                                              // 102
      Accounts._pageLoadLogin({                                                                                      // 103
        type: "resume",                                                                                              // 104
        allowed: !err,                                                                                               // 105
        error: err,                                                                                                  // 106
        methodName: "login",                                                                                         // 107
        // XXX This is duplicate code with loginWithToken, but                                                       // 108
        // loginWithToken can also be called at other times besides                                                  // 109
        // page load.                                                                                                // 110
        methodArguments: [{resume: token}]                                                                           // 111
      });                                                                                                            // 112
    });                                                                                                              // 113
  }                                                                                                                  // 114
}                                                                                                                    // 115
                                                                                                                     // 116
// Poll local storage every 3 seconds to login if someone logged in in                                               // 117
// another tab                                                                                                       // 118
lastLoginTokenWhenPolled = token;                                                                                    // 119
var pollStoredLoginToken = function() {                                                                              // 120
  if (! autoLoginEnabled)                                                                                            // 121
    return;                                                                                                          // 122
                                                                                                                     // 123
  var currentLoginToken = storedLoginToken();                                                                        // 124
                                                                                                                     // 125
  // != instead of !== just to make sure undefined and null are treated the same                                     // 126
  if (lastLoginTokenWhenPolled != currentLoginToken) {                                                               // 127
    if (currentLoginToken) {                                                                                         // 128
      Meteor.loginWithToken(currentLoginToken, function (err) {                                                      // 129
        if (err)                                                                                                     // 130
          makeClientLoggedOut();                                                                                     // 131
      });                                                                                                            // 132
    } else {                                                                                                         // 133
      Meteor.logout();                                                                                               // 134
    }                                                                                                                // 135
  }                                                                                                                  // 136
  lastLoginTokenWhenPolled = currentLoginToken;                                                                      // 137
};                                                                                                                   // 138
                                                                                                                     // 139
setInterval(pollStoredLoginToken, 3000);                                                                             // 140
                                                                                                                     // 141
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-base'] = {
  Accounts: Accounts,
  AccountsTest: AccountsTest
};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var ServiceConfiguration;

(function () {

////////////////////////////////////////////////////////////////////////////////////////
//                                                                                    //
// packages/service-configuration/service_configuration_common.js                     //
//                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////
                                                                                      //
if (typeof ServiceConfiguration === 'undefined') {                                    // 1
  ServiceConfiguration = {};                                                          // 2
}                                                                                     // 3
                                                                                      // 4
                                                                                      // 5
// Table containing documents with configuration options for each                     // 6
// login service                                                                      // 7
ServiceConfiguration.configurations = new Mongo.Collection(                           // 8
  "meteor_accounts_loginServiceConfiguration", {                                      // 9
    _preventAutopublish: true,                                                        // 10
    connection: Meteor.isClient ? Accounts.connection : Meteor.connection             // 11
  });                                                                                 // 12
// Leave this collection open in insecure mode. In theory, someone could              // 13
// hijack your oauth connect requests to a different endpoint or appId,               // 14
// but you did ask for 'insecure'. The advantage is that it is much                   // 15
// easier to write a configuration wizard that works only in insecure                 // 16
// mode.                                                                              // 17
                                                                                      // 18
                                                                                      // 19
// Thrown when trying to use a login service which is not configured                  // 20
ServiceConfiguration.ConfigError = function (serviceName) {                           // 21
  if (Meteor.isClient && !Accounts.loginServicesConfigured()) {                       // 22
    this.message = "Login service configuration not yet loaded";                      // 23
  } else if (serviceName) {                                                           // 24
    this.message = "Service " + serviceName + " not configured";                      // 25
  } else {                                                                            // 26
    this.message = "Service not configured";                                          // 27
  }                                                                                   // 28
};                                                                                    // 29
ServiceConfiguration.ConfigError.prototype = new Error();                             // 30
ServiceConfiguration.ConfigError.prototype.name = 'ServiceConfiguration.ConfigError'; // 31
                                                                                      // 32
////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['service-configuration'] = {
  ServiceConfiguration: ServiceConfiguration
};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;

/* Package-scope variables */
var SHA256;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/sha/sha256.js                                                                                     //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
/// METEOR WRAPPER                                                                                            // 1
//                                                                                                            // 2
SHA256 = (function () {                                                                                       // 3
                                                                                                              // 4
                                                                                                              // 5
/**                                                                                                           // 6
*                                                                                                             // 7
*  Secure Hash Algorithm (SHA256)                                                                             // 8
*  http://www.webtoolkit.info/javascript-sha256.html                                                          // 9
*  http://anmar.eu.org/projects/jssha2/                                                                       // 10
*                                                                                                             // 11
*  Original code by Angel Marin, Paul Johnston.                                                               // 12
*                                                                                                             // 13
**/                                                                                                           // 14
                                                                                                              // 15
function SHA256(s){                                                                                           // 16
                                                                                                              // 17
	var chrsz   = 8;                                                                                             // 18
	var hexcase = 0;                                                                                             // 19
                                                                                                              // 20
	function safe_add (x, y) {                                                                                   // 21
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);                                                                      // 22
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);                                                              // 23
		return (msw << 16) | (lsw & 0xFFFF);                                                                        // 24
	}                                                                                                            // 25
                                                                                                              // 26
	function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }                                                  // 27
	function R (X, n) { return ( X >>> n ); }                                                                    // 28
	function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }                                                      // 29
	function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }                                              // 30
	function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }                                            // 31
	function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }                                            // 32
	function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }                                             // 33
	function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }                                           // 34
                                                                                                              // 35
	function core_sha256 (m, l) {                                                                                // 36
		var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
		var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
		var W = new Array(64);                                                                                      // 39
		var a, b, c, d, e, f, g, h, i, j;                                                                           // 40
		var T1, T2;                                                                                                 // 41
                                                                                                              // 42
		m[l >> 5] |= 0x80 << (24 - l % 32);                                                                         // 43
		m[((l + 64 >> 9) << 4) + 15] = l;                                                                           // 44
                                                                                                              // 45
		for ( var i = 0; i<m.length; i+=16 ) {                                                                      // 46
			a = HASH[0];                                                                                               // 47
			b = HASH[1];                                                                                               // 48
			c = HASH[2];                                                                                               // 49
			d = HASH[3];                                                                                               // 50
			e = HASH[4];                                                                                               // 51
			f = HASH[5];                                                                                               // 52
			g = HASH[6];                                                                                               // 53
			h = HASH[7];                                                                                               // 54
                                                                                                              // 55
			for ( var j = 0; j<64; j++) {                                                                              // 56
				if (j < 16) W[j] = m[j + i];                                                                              // 57
				else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]); // 58
                                                                                                              // 59
				T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);                    // 60
				T2 = safe_add(Sigma0256(a), Maj(a, b, c));                                                                // 61
                                                                                                              // 62
				h = g;                                                                                                    // 63
				g = f;                                                                                                    // 64
				f = e;                                                                                                    // 65
				e = safe_add(d, T1);                                                                                      // 66
				d = c;                                                                                                    // 67
				c = b;                                                                                                    // 68
				b = a;                                                                                                    // 69
				a = safe_add(T1, T2);                                                                                     // 70
			}                                                                                                          // 71
                                                                                                              // 72
			HASH[0] = safe_add(a, HASH[0]);                                                                            // 73
			HASH[1] = safe_add(b, HASH[1]);                                                                            // 74
			HASH[2] = safe_add(c, HASH[2]);                                                                            // 75
			HASH[3] = safe_add(d, HASH[3]);                                                                            // 76
			HASH[4] = safe_add(e, HASH[4]);                                                                            // 77
			HASH[5] = safe_add(f, HASH[5]);                                                                            // 78
			HASH[6] = safe_add(g, HASH[6]);                                                                            // 79
			HASH[7] = safe_add(h, HASH[7]);                                                                            // 80
		}                                                                                                           // 81
		return HASH;                                                                                                // 82
	}                                                                                                            // 83
                                                                                                              // 84
	function str2binb (str) {                                                                                    // 85
		var bin = Array();                                                                                          // 86
		var mask = (1 << chrsz) - 1;                                                                                // 87
		for(var i = 0; i < str.length * chrsz; i += chrsz) {                                                        // 88
			bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);                                            // 89
		}                                                                                                           // 90
		return bin;                                                                                                 // 91
	}                                                                                                            // 92
                                                                                                              // 93
	function Utf8Encode(string) {                                                                                // 94
		// METEOR change:                                                                                           // 95
		// The webtoolkit.info version of this code added this                                                      // 96
		// Utf8Encode function (which does seem necessary for dealing                                               // 97
		// with arbitrary Unicode), but the following line seems                                                    // 98
		// problematic:                                                                                             // 99
		//                                                                                                          // 100
		// string = string.replace(/\r\n/g,"\n");                                                                   // 101
		var utftext = "";                                                                                           // 102
                                                                                                              // 103
		for (var n = 0; n < string.length; n++) {                                                                   // 104
                                                                                                              // 105
			var c = string.charCodeAt(n);                                                                              // 106
                                                                                                              // 107
			if (c < 128) {                                                                                             // 108
				utftext += String.fromCharCode(c);                                                                        // 109
			}                                                                                                          // 110
			else if((c > 127) && (c < 2048)) {                                                                         // 111
				utftext += String.fromCharCode((c >> 6) | 192);                                                           // 112
				utftext += String.fromCharCode((c & 63) | 128);                                                           // 113
			}                                                                                                          // 114
			else {                                                                                                     // 115
				utftext += String.fromCharCode((c >> 12) | 224);                                                          // 116
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);                                                    // 117
				utftext += String.fromCharCode((c & 63) | 128);                                                           // 118
			}                                                                                                          // 119
                                                                                                              // 120
		}                                                                                                           // 121
                                                                                                              // 122
		return utftext;                                                                                             // 123
	}                                                                                                            // 124
                                                                                                              // 125
	function binb2hex (binarray) {                                                                               // 126
		var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";                                            // 127
		var str = "";                                                                                               // 128
		for(var i = 0; i < binarray.length * 4; i++) {                                                              // 129
			str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +                                         // 130
			hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);                                                 // 131
		}                                                                                                           // 132
		return str;                                                                                                 // 133
	}                                                                                                            // 134
                                                                                                              // 135
	s = Utf8Encode(s);                                                                                           // 136
	return binb2hex(core_sha256(str2binb(s), s.length * chrsz));                                                 // 137
                                                                                                              // 138
}                                                                                                             // 139
                                                                                                              // 140
/// METEOR WRAPPER                                                                                            // 141
return SHA256;                                                                                                // 142
})();                                                                                                         // 143
                                                                                                              // 144
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.sha = {
  SHA256: SHA256
};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Random = Package.random.Random;
var check = Package.check.check;
var Match = Package.check.Match;
var SHA256 = Package.sha.SHA256;
var _ = Package.underscore._;

/* Package-scope variables */
var SRP, BigInteger;

(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/srp/biginteger.js                                                                                       //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
/// METEOR WRAPPER                                                                                                  // 1
BigInteger = (function () {                                                                                         // 2
                                                                                                                    // 3
                                                                                                                    // 4
/// BEGIN jsbn.js                                                                                                   // 5
                                                                                                                    // 6
/*                                                                                                                  // 7
 * Copyright (c) 2003-2005  Tom Wu                                                                                  // 8
 * All Rights Reserved.                                                                                             // 9
 *                                                                                                                  // 10
 * Permission is hereby granted, free of charge, to any person obtaining                                            // 11
 * a copy of this software and associated documentation files (the                                                  // 12
 * "Software"), to deal in the Software without restriction, including                                              // 13
 * without limitation the rights to use, copy, modify, merge, publish,                                              // 14
 * distribute, sublicense, and/or sell copies of the Software, and to                                               // 15
 * permit persons to whom the Software is furnished to do so, subject to                                            // 16
 * the following conditions:                                                                                        // 17
 *                                                                                                                  // 18
 * The above copyright notice and this permission notice shall be                                                   // 19
 * included in all copies or substantial portions of the Software.                                                  // 20
 *                                                                                                                  // 21
 * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND,                                               // 22
 * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY                                                 // 23
 * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.                                                 // 24
 *                                                                                                                  // 25
 * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,                                                  // 26
 * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER                                         // 27
 * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF                                           // 28
 * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT                                           // 29
 * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.                                                // 30
 *                                                                                                                  // 31
 * In addition, the following condition applies:                                                                    // 32
 *                                                                                                                  // 33
 * All redistributions must retain an intact copy of this copyright notice                                          // 34
 * and disclaimer.                                                                                                  // 35
 */                                                                                                                 // 36
                                                                                                                    // 37
// Basic JavaScript BN library - subset useful for RSA encryption.                                                  // 38
                                                                                                                    // 39
// Bits per digit                                                                                                   // 40
var dbits;                                                                                                          // 41
                                                                                                                    // 42
// JavaScript engine analysis                                                                                       // 43
var canary = 0xdeadbeefcafe;                                                                                        // 44
var j_lm = ((canary&0xffffff)==0xefcafe);                                                                           // 45
                                                                                                                    // 46
// (public) Constructor                                                                                             // 47
function BigInteger(a,b,c) {                                                                                        // 48
  if(a != null)                                                                                                     // 49
    if("number" == typeof a) this.fromNumber(a,b,c);                                                                // 50
    else if(b == null && "string" != typeof a) this.fromString(a,256);                                              // 51
    else this.fromString(a,b);                                                                                      // 52
}                                                                                                                   // 53
                                                                                                                    // 54
// return new, unset BigInteger                                                                                     // 55
function nbi() { return new BigInteger(null); }                                                                     // 56
                                                                                                                    // 57
// am: Compute w_j += (x*this_i), propagate carries,                                                                // 58
// c is initial carry, returns final carry.                                                                         // 59
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue                                                                      // 60
// We need to select the fastest one that works in this environment.                                                // 61
                                                                                                                    // 62
// am1: use a single mult and divide to get the high bits,                                                          // 63
// max digit bits should be 26 because                                                                              // 64
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)                                                                // 65
function am1(i,x,w,j,c,n) {                                                                                         // 66
  while(--n >= 0) {                                                                                                 // 67
    var v = x*this[i++]+w[j]+c;                                                                                     // 68
    c = Math.floor(v/0x4000000);                                                                                    // 69
    w[j++] = v&0x3ffffff;                                                                                           // 70
  }                                                                                                                 // 71
  return c;                                                                                                         // 72
}                                                                                                                   // 73
// am2 avoids a big mult-and-extract completely.                                                                    // 74
// Max digit bits should be <= 30 because we do bitwise ops                                                         // 75
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)                                                                   // 76
function am2(i,x,w,j,c,n) {                                                                                         // 77
  var xl = x&0x7fff, xh = x>>15;                                                                                    // 78
  while(--n >= 0) {                                                                                                 // 79
    var l = this[i]&0x7fff;                                                                                         // 80
    var h = this[i++]>>15;                                                                                          // 81
    var m = xh*l+h*xl;                                                                                              // 82
    l = xl*l+((m&0x7fff)<<15)+w[j]+(c&0x3fffffff);                                                                  // 83
    c = (l>>>30)+(m>>>15)+xh*h+(c>>>30);                                                                            // 84
    w[j++] = l&0x3fffffff;                                                                                          // 85
  }                                                                                                                 // 86
  return c;                                                                                                         // 87
}                                                                                                                   // 88
// Alternately, set max digit bits to 28 since some                                                                 // 89
// browsers slow down when dealing with 32-bit numbers.                                                             // 90
function am3(i,x,w,j,c,n) {                                                                                         // 91
  var xl = x&0x3fff, xh = x>>14;                                                                                    // 92
  while(--n >= 0) {                                                                                                 // 93
    var l = this[i]&0x3fff;                                                                                         // 94
    var h = this[i++]>>14;                                                                                          // 95
    var m = xh*l+h*xl;                                                                                              // 96
    l = xl*l+((m&0x3fff)<<14)+w[j]+c;                                                                               // 97
    c = (l>>28)+(m>>14)+xh*h;                                                                                       // 98
    w[j++] = l&0xfffffff;                                                                                           // 99
  }                                                                                                                 // 100
  return c;                                                                                                         // 101
}                                                                                                                   // 102
                                                                                                                    // 103
/* XXX METEOR XXX                                                                                                   // 104
if(j_lm && (navigator.appName == "Microsoft Internet Explorer")) {                                                  // 105
  BigInteger.prototype.am = am2;                                                                                    // 106
  dbits = 30;                                                                                                       // 107
}                                                                                                                   // 108
else if(j_lm && (navigator.appName != "Netscape")) {                                                                // 109
  BigInteger.prototype.am = am1;                                                                                    // 110
  dbits = 26;                                                                                                       // 111
}                                                                                                                   // 112
else                                                                                                                // 113
*/                                                                                                                  // 114
                                                                                                                    // 115
{ // Mozilla/Netscape seems to prefer am3                                                                           // 116
  BigInteger.prototype.am = am3;                                                                                    // 117
  dbits = 28;                                                                                                       // 118
}                                                                                                                   // 119
                                                                                                                    // 120
BigInteger.prototype.DB = dbits;                                                                                    // 121
BigInteger.prototype.DM = ((1<<dbits)-1);                                                                           // 122
BigInteger.prototype.DV = (1<<dbits);                                                                               // 123
                                                                                                                    // 124
var BI_FP = 52;                                                                                                     // 125
BigInteger.prototype.FV = Math.pow(2,BI_FP);                                                                        // 126
BigInteger.prototype.F1 = BI_FP-dbits;                                                                              // 127
BigInteger.prototype.F2 = 2*dbits-BI_FP;                                                                            // 128
                                                                                                                    // 129
// Digit conversions                                                                                                // 130
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";                                                                 // 131
var BI_RC = new Array();                                                                                            // 132
var rr,vv;                                                                                                          // 133
rr = "0".charCodeAt(0);                                                                                             // 134
for(vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv;                                                                        // 135
rr = "a".charCodeAt(0);                                                                                             // 136
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;                                                                       // 137
rr = "A".charCodeAt(0);                                                                                             // 138
for(vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv;                                                                       // 139
                                                                                                                    // 140
function int2char(n) { return BI_RM.charAt(n); }                                                                    // 141
function intAt(s,i) {                                                                                               // 142
  var c = BI_RC[s.charCodeAt(i)];                                                                                   // 143
  return (c==null)?-1:c;                                                                                            // 144
}                                                                                                                   // 145
                                                                                                                    // 146
// (protected) copy this to r                                                                                       // 147
function bnpCopyTo(r) {                                                                                             // 148
  for(var i = this.t-1; i >= 0; --i) r[i] = this[i];                                                                // 149
  r.t = this.t;                                                                                                     // 150
  r.s = this.s;                                                                                                     // 151
}                                                                                                                   // 152
                                                                                                                    // 153
// (protected) set from integer value x, -DV <= x < DV                                                              // 154
function bnpFromInt(x) {                                                                                            // 155
  this.t = 1;                                                                                                       // 156
  this.s = (x<0)?-1:0;                                                                                              // 157
  if(x > 0) this[0] = x;                                                                                            // 158
  else if(x < -1) this[0] = x+DV;                                                                                   // 159
  else this.t = 0;                                                                                                  // 160
}                                                                                                                   // 161
                                                                                                                    // 162
// return bigint initialized to value                                                                               // 163
function nbv(i) { var r = nbi(); r.fromInt(i); return r; }                                                          // 164
                                                                                                                    // 165
// (protected) set from string and radix                                                                            // 166
function bnpFromString(s,b) {                                                                                       // 167
  var k;                                                                                                            // 168
  if(b == 16) k = 4;                                                                                                // 169
  else if(b == 8) k = 3;                                                                                            // 170
  else if(b == 256) k = 8; // byte array                                                                            // 171
  else if(b == 2) k = 1;                                                                                            // 172
  else if(b == 32) k = 5;                                                                                           // 173
  else if(b == 4) k = 2;                                                                                            // 174
  else { this.fromRadix(s,b); return; }                                                                             // 175
  this.t = 0;                                                                                                       // 176
  this.s = 0;                                                                                                       // 177
  var i = s.length, mi = false, sh = 0;                                                                             // 178
  while(--i >= 0) {                                                                                                 // 179
    var x = (k==8)?s[i]&0xff:intAt(s,i);                                                                            // 180
    if(x < 0) {                                                                                                     // 181
      if(s.charAt(i) == "-") mi = true;                                                                             // 182
      continue;                                                                                                     // 183
    }                                                                                                               // 184
    mi = false;                                                                                                     // 185
    if(sh == 0)                                                                                                     // 186
      this[this.t++] = x;                                                                                           // 187
    else if(sh+k > this.DB) {                                                                                       // 188
      this[this.t-1] |= (x&((1<<(this.DB-sh))-1))<<sh;                                                              // 189
      this[this.t++] = (x>>(this.DB-sh));                                                                           // 190
    }                                                                                                               // 191
    else                                                                                                            // 192
      this[this.t-1] |= x<<sh;                                                                                      // 193
    sh += k;                                                                                                        // 194
    if(sh >= this.DB) sh -= this.DB;                                                                                // 195
  }                                                                                                                 // 196
  if(k == 8 && (s[0]&0x80) != 0) {                                                                                  // 197
    this.s = -1;                                                                                                    // 198
    if(sh > 0) this[this.t-1] |= ((1<<(this.DB-sh))-1)<<sh;                                                         // 199
  }                                                                                                                 // 200
  this.clamp();                                                                                                     // 201
  if(mi) BigInteger.ZERO.subTo(this,this);                                                                          // 202
}                                                                                                                   // 203
                                                                                                                    // 204
// (protected) clamp off excess high words                                                                          // 205
function bnpClamp() {                                                                                               // 206
  var c = this.s&this.DM;                                                                                           // 207
  while(this.t > 0 && this[this.t-1] == c) --this.t;                                                                // 208
}                                                                                                                   // 209
                                                                                                                    // 210
// (public) return string representation in given radix                                                             // 211
function bnToString(b) {                                                                                            // 212
  if(this.s < 0) return "-"+this.negate().toString(b);                                                              // 213
  var k;                                                                                                            // 214
  if(b == 16) k = 4;                                                                                                // 215
  else if(b == 8) k = 3;                                                                                            // 216
  else if(b == 2) k = 1;                                                                                            // 217
  else if(b == 32) k = 5;                                                                                           // 218
  else if(b == 4) k = 2;                                                                                            // 219
  else return this.toRadix(b);                                                                                      // 220
  var km = (1<<k)-1, d, m = false, r = "", i = this.t;                                                              // 221
  var p = this.DB-(i*this.DB)%k;                                                                                    // 222
  if(i-- > 0) {                                                                                                     // 223
    if(p < this.DB && (d = this[i]>>p) > 0) { m = true; r = int2char(d); }                                          // 224
    while(i >= 0) {                                                                                                 // 225
      if(p < k) {                                                                                                   // 226
        d = (this[i]&((1<<p)-1))<<(k-p);                                                                            // 227
        d |= this[--i]>>(p+=this.DB-k);                                                                             // 228
      }                                                                                                             // 229
      else {                                                                                                        // 230
        d = (this[i]>>(p-=k))&km;                                                                                   // 231
        if(p <= 0) { p += this.DB; --i; }                                                                           // 232
      }                                                                                                             // 233
      if(d > 0) m = true;                                                                                           // 234
      if(m) r += int2char(d);                                                                                       // 235
    }                                                                                                               // 236
  }                                                                                                                 // 237
  return m?r:"0";                                                                                                   // 238
}                                                                                                                   // 239
                                                                                                                    // 240
// (public) -this                                                                                                   // 241
function bnNegate() { var r = nbi(); BigInteger.ZERO.subTo(this,r); return r; }                                     // 242
                                                                                                                    // 243
// (public) |this|                                                                                                  // 244
function bnAbs() { return (this.s<0)?this.negate():this; }                                                          // 245
                                                                                                                    // 246
// (public) return + if this > a, - if this < a, 0 if equal                                                         // 247
function bnCompareTo(a) {                                                                                           // 248
  var r = this.s-a.s;                                                                                               // 249
  if(r != 0) return r;                                                                                              // 250
  var i = this.t;                                                                                                   // 251
  r = i-a.t;                                                                                                        // 252
  if(r != 0) return r;                                                                                              // 253
  while(--i >= 0) if((r=this[i]-a[i]) != 0) return r;                                                               // 254
  return 0;                                                                                                         // 255
}                                                                                                                   // 256
                                                                                                                    // 257
// returns bit length of the integer x                                                                              // 258
function nbits(x) {                                                                                                 // 259
  var r = 1, t;                                                                                                     // 260
  if((t=x>>>16) != 0) { x = t; r += 16; }                                                                           // 261
  if((t=x>>8) != 0) { x = t; r += 8; }                                                                              // 262
  if((t=x>>4) != 0) { x = t; r += 4; }                                                                              // 263
  if((t=x>>2) != 0) { x = t; r += 2; }                                                                              // 264
  if((t=x>>1) != 0) { x = t; r += 1; }                                                                              // 265
  return r;                                                                                                         // 266
}                                                                                                                   // 267
                                                                                                                    // 268
// (public) return the number of bits in "this"                                                                     // 269
function bnBitLength() {                                                                                            // 270
  if(this.t <= 0) return 0;                                                                                         // 271
  return this.DB*(this.t-1)+nbits(this[this.t-1]^(this.s&this.DM));                                                 // 272
}                                                                                                                   // 273
                                                                                                                    // 274
// (protected) r = this << n*DB                                                                                     // 275
function bnpDLShiftTo(n,r) {                                                                                        // 276
  var i;                                                                                                            // 277
  for(i = this.t-1; i >= 0; --i) r[i+n] = this[i];                                                                  // 278
  for(i = n-1; i >= 0; --i) r[i] = 0;                                                                               // 279
  r.t = this.t+n;                                                                                                   // 280
  r.s = this.s;                                                                                                     // 281
}                                                                                                                   // 282
                                                                                                                    // 283
// (protected) r = this >> n*DB                                                                                     // 284
function bnpDRShiftTo(n,r) {                                                                                        // 285
  for(var i = n; i < this.t; ++i) r[i-n] = this[i];                                                                 // 286
  r.t = Math.max(this.t-n,0);                                                                                       // 287
  r.s = this.s;                                                                                                     // 288
}                                                                                                                   // 289
                                                                                                                    // 290
// (protected) r = this << n                                                                                        // 291
function bnpLShiftTo(n,r) {                                                                                         // 292
  var bs = n%this.DB;                                                                                               // 293
  var cbs = this.DB-bs;                                                                                             // 294
  var bm = (1<<cbs)-1;                                                                                              // 295
  var ds = Math.floor(n/this.DB), c = (this.s<<bs)&this.DM, i;                                                      // 296
  for(i = this.t-1; i >= 0; --i) {                                                                                  // 297
    r[i+ds+1] = (this[i]>>cbs)|c;                                                                                   // 298
    c = (this[i]&bm)<<bs;                                                                                           // 299
  }                                                                                                                 // 300
  for(i = ds-1; i >= 0; --i) r[i] = 0;                                                                              // 301
  r[ds] = c;                                                                                                        // 302
  r.t = this.t+ds+1;                                                                                                // 303
  r.s = this.s;                                                                                                     // 304
  r.clamp();                                                                                                        // 305
}                                                                                                                   // 306
                                                                                                                    // 307
// (protected) r = this >> n                                                                                        // 308
function bnpRShiftTo(n,r) {                                                                                         // 309
  r.s = this.s;                                                                                                     // 310
  var ds = Math.floor(n/this.DB);                                                                                   // 311
  if(ds >= this.t) { r.t = 0; return; }                                                                             // 312
  var bs = n%this.DB;                                                                                               // 313
  var cbs = this.DB-bs;                                                                                             // 314
  var bm = (1<<bs)-1;                                                                                               // 315
  r[0] = this[ds]>>bs;                                                                                              // 316
  for(var i = ds+1; i < this.t; ++i) {                                                                              // 317
    r[i-ds-1] |= (this[i]&bm)<<cbs;                                                                                 // 318
    r[i-ds] = this[i]>>bs;                                                                                          // 319
  }                                                                                                                 // 320
  if(bs > 0) r[this.t-ds-1] |= (this.s&bm)<<cbs;                                                                    // 321
  r.t = this.t-ds;                                                                                                  // 322
  r.clamp();                                                                                                        // 323
}                                                                                                                   // 324
                                                                                                                    // 325
// (protected) r = this - a                                                                                         // 326
function bnpSubTo(a,r) {                                                                                            // 327
  var i = 0, c = 0, m = Math.min(a.t,this.t);                                                                       // 328
  while(i < m) {                                                                                                    // 329
    c += this[i]-a[i];                                                                                              // 330
    r[i++] = c&this.DM;                                                                                             // 331
    c >>= this.DB;                                                                                                  // 332
  }                                                                                                                 // 333
  if(a.t < this.t) {                                                                                                // 334
    c -= a.s;                                                                                                       // 335
    while(i < this.t) {                                                                                             // 336
      c += this[i];                                                                                                 // 337
      r[i++] = c&this.DM;                                                                                           // 338
      c >>= this.DB;                                                                                                // 339
    }                                                                                                               // 340
    c += this.s;                                                                                                    // 341
  }                                                                                                                 // 342
  else {                                                                                                            // 343
    c += this.s;                                                                                                    // 344
    while(i < a.t) {                                                                                                // 345
      c -= a[i];                                                                                                    // 346
      r[i++] = c&this.DM;                                                                                           // 347
      c >>= this.DB;                                                                                                // 348
    }                                                                                                               // 349
    c -= a.s;                                                                                                       // 350
  }                                                                                                                 // 351
  r.s = (c<0)?-1:0;                                                                                                 // 352
  if(c < -1) r[i++] = this.DV+c;                                                                                    // 353
  else if(c > 0) r[i++] = c;                                                                                        // 354
  r.t = i;                                                                                                          // 355
  r.clamp();                                                                                                        // 356
}                                                                                                                   // 357
                                                                                                                    // 358
// (protected) r = this * a, r != this,a (HAC 14.12)                                                                // 359
// "this" should be the larger one if appropriate.                                                                  // 360
function bnpMultiplyTo(a,r) {                                                                                       // 361
  var x = this.abs(), y = a.abs();                                                                                  // 362
  var i = x.t;                                                                                                      // 363
  r.t = i+y.t;                                                                                                      // 364
  while(--i >= 0) r[i] = 0;                                                                                         // 365
  for(i = 0; i < y.t; ++i) r[i+x.t] = x.am(0,y[i],r,i,0,x.t);                                                       // 366
  r.s = 0;                                                                                                          // 367
  r.clamp();                                                                                                        // 368
  if(this.s != a.s) BigInteger.ZERO.subTo(r,r);                                                                     // 369
}                                                                                                                   // 370
                                                                                                                    // 371
// (protected) r = this^2, r != this (HAC 14.16)                                                                    // 372
function bnpSquareTo(r) {                                                                                           // 373
  var x = this.abs();                                                                                               // 374
  var i = r.t = 2*x.t;                                                                                              // 375
  while(--i >= 0) r[i] = 0;                                                                                         // 376
  for(i = 0; i < x.t-1; ++i) {                                                                                      // 377
    var c = x.am(i,x[i],r,2*i,0,1);                                                                                 // 378
    if((r[i+x.t]+=x.am(i+1,2*x[i],r,2*i+1,c,x.t-i-1)) >= x.DV) {                                                    // 379
      r[i+x.t] -= x.DV;                                                                                             // 380
      r[i+x.t+1] = 1;                                                                                               // 381
    }                                                                                                               // 382
  }                                                                                                                 // 383
  if(r.t > 0) r[r.t-1] += x.am(i,x[i],r,2*i,0,1);                                                                   // 384
  r.s = 0;                                                                                                          // 385
  r.clamp();                                                                                                        // 386
}                                                                                                                   // 387
                                                                                                                    // 388
// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)                                         // 389
// r != q, this != m.  q or r may be null.                                                                          // 390
function bnpDivRemTo(m,q,r) {                                                                                       // 391
  var pm = m.abs();                                                                                                 // 392
  if(pm.t <= 0) return;                                                                                             // 393
  var pt = this.abs();                                                                                              // 394
  if(pt.t < pm.t) {                                                                                                 // 395
    if(q != null) q.fromInt(0);                                                                                     // 396
    if(r != null) this.copyTo(r);                                                                                   // 397
    return;                                                                                                         // 398
  }                                                                                                                 // 399
  if(r == null) r = nbi();                                                                                          // 400
  var y = nbi(), ts = this.s, ms = m.s;                                                                             // 401
  var nsh = this.DB-nbits(pm[pm.t-1]);	// normalize modulus                                                         // 402
  if(nsh > 0) { pm.lShiftTo(nsh,y); pt.lShiftTo(nsh,r); }                                                           // 403
  else { pm.copyTo(y); pt.copyTo(r); }                                                                              // 404
  var ys = y.t;                                                                                                     // 405
  var y0 = y[ys-1];                                                                                                 // 406
  if(y0 == 0) return;                                                                                               // 407
  var yt = y0*(1<<this.F1)+((ys>1)?y[ys-2]>>this.F2:0);                                                             // 408
  var d1 = this.FV/yt, d2 = (1<<this.F1)/yt, e = 1<<this.F2;                                                        // 409
  var i = r.t, j = i-ys, t = (q==null)?nbi():q;                                                                     // 410
  y.dlShiftTo(j,t);                                                                                                 // 411
  if(r.compareTo(t) >= 0) {                                                                                         // 412
    r[r.t++] = 1;                                                                                                   // 413
    r.subTo(t,r);                                                                                                   // 414
  }                                                                                                                 // 415
  BigInteger.ONE.dlShiftTo(ys,t);                                                                                   // 416
  t.subTo(y,y);	// "negative" y so we can replace sub with am later                                                 // 417
  while(y.t < ys) y[y.t++] = 0;                                                                                     // 418
  while(--j >= 0) {                                                                                                 // 419
    // Estimate quotient digit                                                                                      // 420
    var qd = (r[--i]==y0)?this.DM:Math.floor(r[i]*d1+(r[i-1]+e)*d2);                                                // 421
    if((r[i]+=y.am(0,qd,r,j,0,ys)) < qd) {	// Try it out                                                            // 422
      y.dlShiftTo(j,t);                                                                                             // 423
      r.subTo(t,r);                                                                                                 // 424
      while(r[i] < --qd) r.subTo(t,r);                                                                              // 425
    }                                                                                                               // 426
  }                                                                                                                 // 427
  if(q != null) {                                                                                                   // 428
    r.drShiftTo(ys,q);                                                                                              // 429
    if(ts != ms) BigInteger.ZERO.subTo(q,q);                                                                        // 430
  }                                                                                                                 // 431
  r.t = ys;                                                                                                         // 432
  r.clamp();                                                                                                        // 433
  if(nsh > 0) r.rShiftTo(nsh,r);	// Denormalize remainder                                                           // 434
  if(ts < 0) BigInteger.ZERO.subTo(r,r);                                                                            // 435
}                                                                                                                   // 436
                                                                                                                    // 437
// (public) this mod a                                                                                              // 438
function bnMod(a) {                                                                                                 // 439
  var r = nbi();                                                                                                    // 440
  this.abs().divRemTo(a,null,r);                                                                                    // 441
  if(this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r,r);                                                  // 442
  return r;                                                                                                         // 443
}                                                                                                                   // 444
                                                                                                                    // 445
// Modular reduction using "classic" algorithm                                                                      // 446
function Classic(m) { this.m = m; }                                                                                 // 447
function cConvert(x) {                                                                                              // 448
  if(x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m);                                                     // 449
  else return x;                                                                                                    // 450
}                                                                                                                   // 451
function cRevert(x) { return x; }                                                                                   // 452
function cReduce(x) { x.divRemTo(this.m,null,x); }                                                                  // 453
function cMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }                                                       // 454
function cSqrTo(x,r) { x.squareTo(r); this.reduce(r); }                                                             // 455
                                                                                                                    // 456
Classic.prototype.convert = cConvert;                                                                               // 457
Classic.prototype.revert = cRevert;                                                                                 // 458
Classic.prototype.reduce = cReduce;                                                                                 // 459
Classic.prototype.mulTo = cMulTo;                                                                                   // 460
Classic.prototype.sqrTo = cSqrTo;                                                                                   // 461
                                                                                                                    // 462
// (protected) return "-1/this % 2^DB"; useful for Mont. reduction                                                  // 463
// justification:                                                                                                   // 464
//         xy == 1 (mod m)                                                                                          // 465
//         xy =  1+km                                                                                               // 466
//   xy(2-xy) = (1+km)(1-km)                                                                                        // 467
// x[y(2-xy)] = 1-k^2m^2                                                                                            // 468
// x[y(2-xy)] == 1 (mod m^2)                                                                                        // 469
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2                                                                   // 470
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.                                            // 471
// JS multiply "overflows" differently from C/C++, so care is needed here.                                          // 472
function bnpInvDigit() {                                                                                            // 473
  if(this.t < 1) return 0;                                                                                          // 474
  var x = this[0];                                                                                                  // 475
  if((x&1) == 0) return 0;                                                                                          // 476
  var y = x&3;		// y == 1/x mod 2^2                                                                                 // 477
  y = (y*(2-(x&0xf)*y))&0xf;	// y == 1/x mod 2^4                                                                    // 478
  y = (y*(2-(x&0xff)*y))&0xff;	// y == 1/x mod 2^8                                                                  // 479
  y = (y*(2-(((x&0xffff)*y)&0xffff)))&0xffff;	// y == 1/x mod 2^16                                                  // 480
  // last step - calculate inverse mod DV directly;                                                                 // 481
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints                                                // 482
  y = (y*(2-x*y%this.DV))%this.DV;		// y == 1/x mod 2^dbits                                                         // 483
  // we really want the negative inverse, and -DV < y < DV                                                          // 484
  return (y>0)?this.DV-y:-y;                                                                                        // 485
}                                                                                                                   // 486
                                                                                                                    // 487
// Montgomery reduction                                                                                             // 488
function Montgomery(m) {                                                                                            // 489
  this.m = m;                                                                                                       // 490
  this.mp = m.invDigit();                                                                                           // 491
  this.mpl = this.mp&0x7fff;                                                                                        // 492
  this.mph = this.mp>>15;                                                                                           // 493
  this.um = (1<<(m.DB-15))-1;                                                                                       // 494
  this.mt2 = 2*m.t;                                                                                                 // 495
}                                                                                                                   // 496
                                                                                                                    // 497
// xR mod m                                                                                                         // 498
function montConvert(x) {                                                                                           // 499
  var r = nbi();                                                                                                    // 500
  x.abs().dlShiftTo(this.m.t,r);                                                                                    // 501
  r.divRemTo(this.m,null,r);                                                                                        // 502
  if(x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r,r);                                                // 503
  return r;                                                                                                         // 504
}                                                                                                                   // 505
                                                                                                                    // 506
// x/R mod m                                                                                                        // 507
function montRevert(x) {                                                                                            // 508
  var r = nbi();                                                                                                    // 509
  x.copyTo(r);                                                                                                      // 510
  this.reduce(r);                                                                                                   // 511
  return r;                                                                                                         // 512
}                                                                                                                   // 513
                                                                                                                    // 514
// x = x/R mod m (HAC 14.32)                                                                                        // 515
function montReduce(x) {                                                                                            // 516
  while(x.t <= this.mt2)	// pad x so am has enough room later                                                       // 517
    x[x.t++] = 0;                                                                                                   // 518
  for(var i = 0; i < this.m.t; ++i) {                                                                               // 519
    // faster way of calculating u0 = x[i]*mp mod DV                                                                // 520
    var j = x[i]&0x7fff;                                                                                            // 521
    var u0 = (j*this.mpl+(((j*this.mph+(x[i]>>15)*this.mpl)&this.um)<<15))&x.DM;                                    // 522
    // use am to combine the multiply-shift-add into one call                                                       // 523
    j = i+this.m.t;                                                                                                 // 524
    x[j] += this.m.am(0,u0,x,i,0,this.m.t);                                                                         // 525
    // propagate carry                                                                                              // 526
    while(x[j] >= x.DV) { x[j] -= x.DV; x[++j]++; }                                                                 // 527
  }                                                                                                                 // 528
  x.clamp();                                                                                                        // 529
  x.drShiftTo(this.m.t,x);                                                                                          // 530
  if(x.compareTo(this.m) >= 0) x.subTo(this.m,x);                                                                   // 531
}                                                                                                                   // 532
                                                                                                                    // 533
// r = "x^2/R mod m"; x != r                                                                                        // 534
function montSqrTo(x,r) { x.squareTo(r); this.reduce(r); }                                                          // 535
                                                                                                                    // 536
// r = "xy/R mod m"; x,y != r                                                                                       // 537
function montMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }                                                    // 538
                                                                                                                    // 539
Montgomery.prototype.convert = montConvert;                                                                         // 540
Montgomery.prototype.revert = montRevert;                                                                           // 541
Montgomery.prototype.reduce = montReduce;                                                                           // 542
Montgomery.prototype.mulTo = montMulTo;                                                                             // 543
Montgomery.prototype.sqrTo = montSqrTo;                                                                             // 544
                                                                                                                    // 545
// (protected) true iff this is even                                                                                // 546
function bnpIsEven() { return ((this.t>0)?(this[0]&1):this.s) == 0; }                                               // 547
                                                                                                                    // 548
// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)                                             // 549
function bnpExp(e,z) {                                                                                              // 550
  if(e > 0xffffffff || e < 1) return BigInteger.ONE;                                                                // 551
  var r = nbi(), r2 = nbi(), g = z.convert(this), i = nbits(e)-1;                                                   // 552
  g.copyTo(r);                                                                                                      // 553
  while(--i >= 0) {                                                                                                 // 554
    z.sqrTo(r,r2);                                                                                                  // 555
    if((e&(1<<i)) > 0) z.mulTo(r2,g,r);                                                                             // 556
    else { var t = r; r = r2; r2 = t; }                                                                             // 557
  }                                                                                                                 // 558
  return z.revert(r);                                                                                               // 559
}                                                                                                                   // 560
                                                                                                                    // 561
// (public) this^e % m, 0 <= e < 2^32                                                                               // 562
function bnModPowInt(e,m) {                                                                                         // 563
  var z;                                                                                                            // 564
  if(e < 256 || m.isEven()) z = new Classic(m); else z = new Montgomery(m);                                         // 565
  return this.exp(e,z);                                                                                             // 566
}                                                                                                                   // 567
                                                                                                                    // 568
// protected                                                                                                        // 569
BigInteger.prototype.copyTo = bnpCopyTo;                                                                            // 570
BigInteger.prototype.fromInt = bnpFromInt;                                                                          // 571
BigInteger.prototype.fromString = bnpFromString;                                                                    // 572
BigInteger.prototype.clamp = bnpClamp;                                                                              // 573
BigInteger.prototype.dlShiftTo = bnpDLShiftTo;                                                                      // 574
BigInteger.prototype.drShiftTo = bnpDRShiftTo;                                                                      // 575
BigInteger.prototype.lShiftTo = bnpLShiftTo;                                                                        // 576
BigInteger.prototype.rShiftTo = bnpRShiftTo;                                                                        // 577
BigInteger.prototype.subTo = bnpSubTo;                                                                              // 578
BigInteger.prototype.multiplyTo = bnpMultiplyTo;                                                                    // 579
BigInteger.prototype.squareTo = bnpSquareTo;                                                                        // 580
BigInteger.prototype.divRemTo = bnpDivRemTo;                                                                        // 581
BigInteger.prototype.invDigit = bnpInvDigit;                                                                        // 582
BigInteger.prototype.isEven = bnpIsEven;                                                                            // 583
BigInteger.prototype.exp = bnpExp;                                                                                  // 584
                                                                                                                    // 585
// public                                                                                                           // 586
BigInteger.prototype.toString = bnToString;                                                                         // 587
BigInteger.prototype.negate = bnNegate;                                                                             // 588
BigInteger.prototype.abs = bnAbs;                                                                                   // 589
BigInteger.prototype.compareTo = bnCompareTo;                                                                       // 590
BigInteger.prototype.bitLength = bnBitLength;                                                                       // 591
BigInteger.prototype.mod = bnMod;                                                                                   // 592
BigInteger.prototype.modPowInt = bnModPowInt;                                                                       // 593
                                                                                                                    // 594
// "constants"                                                                                                      // 595
BigInteger.ZERO = nbv(0);                                                                                           // 596
BigInteger.ONE = nbv(1);                                                                                            // 597
                                                                                                                    // 598
                                                                                                                    // 599
/// BEGIN jsbn2.js                                                                                                  // 600
                                                                                                                    // 601
/*                                                                                                                  // 602
 * Copyright (c) 2003-2005  Tom Wu                                                                                  // 603
 * All Rights Reserved.                                                                                             // 604
 *                                                                                                                  // 605
 * Permission is hereby granted, free of charge, to any person obtaining                                            // 606
 * a copy of this software and associated documentation files (the                                                  // 607
 * "Software"), to deal in the Software without restriction, including                                              // 608
 * without limitation the rights to use, copy, modify, merge, publish,                                              // 609
 * distribute, sublicense, and/or sell copies of the Software, and to                                               // 610
 * permit persons to whom the Software is furnished to do so, subject to                                            // 611
 * the following conditions:                                                                                        // 612
 *                                                                                                                  // 613
 * The above copyright notice and this permission notice shall be                                                   // 614
 * included in all copies or substantial portions of the Software.                                                  // 615
 *                                                                                                                  // 616
 * THE SOFTWARE IS PROVIDED "AS-IS" AND WITHOUT WARRANTY OF ANY KIND,                                               // 617
 * EXPRESS, IMPLIED OR OTHERWISE, INCLUDING WITHOUT LIMITATION, ANY                                                 // 618
 * WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.                                                 // 619
 *                                                                                                                  // 620
 * IN NO EVENT SHALL TOM WU BE LIABLE FOR ANY SPECIAL, INCIDENTAL,                                                  // 621
 * INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY KIND, OR ANY DAMAGES WHATSOEVER                                         // 622
 * RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER OR NOT ADVISED OF                                           // 623
 * THE POSSIBILITY OF DAMAGE, AND ON ANY THEORY OF LIABILITY, ARISING OUT                                           // 624
 * OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.                                                // 625
 *                                                                                                                  // 626
 * In addition, the following condition applies:                                                                    // 627
 *                                                                                                                  // 628
 * All redistributions must retain an intact copy of this copyright notice                                          // 629
 * and disclaimer.                                                                                                  // 630
 */                                                                                                                 // 631
                                                                                                                    // 632
// Extended JavaScript BN functions, required for RSA private ops.                                                  // 633
                                                                                                                    // 634
// (public)                                                                                                         // 635
function bnClone() { var r = nbi(); this.copyTo(r); return r; }                                                     // 636
                                                                                                                    // 637
// (public) return value as integer                                                                                 // 638
function bnIntValue() {                                                                                             // 639
  if(this.s < 0) {                                                                                                  // 640
    if(this.t == 1) return this[0]-this.DV;                                                                         // 641
    else if(this.t == 0) return -1;                                                                                 // 642
  }                                                                                                                 // 643
  else if(this.t == 1) return this[0];                                                                              // 644
  else if(this.t == 0) return 0;                                                                                    // 645
  // assumes 16 < DB < 32                                                                                           // 646
  return ((this[1]&((1<<(32-this.DB))-1))<<this.DB)|this[0];                                                        // 647
}                                                                                                                   // 648
                                                                                                                    // 649
// (public) return value as byte                                                                                    // 650
function bnByteValue() { return (this.t==0)?this.s:(this[0]<<24)>>24; }                                             // 651
                                                                                                                    // 652
// (public) return value as short (assumes DB>=16)                                                                  // 653
function bnShortValue() { return (this.t==0)?this.s:(this[0]<<16)>>16; }                                            // 654
                                                                                                                    // 655
// (protected) return x s.t. r^x < DV                                                                               // 656
function bnpChunkSize(r) { return Math.floor(Math.LN2*this.DB/Math.log(r)); }                                       // 657
                                                                                                                    // 658
// (public) 0 if this == 0, 1 if this > 0                                                                           // 659
function bnSigNum() {                                                                                               // 660
  if(this.s < 0) return -1;                                                                                         // 661
  else if(this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0;                                                   // 662
  else return 1;                                                                                                    // 663
}                                                                                                                   // 664
                                                                                                                    // 665
// (protected) convert to radix string                                                                              // 666
function bnpToRadix(b) {                                                                                            // 667
  if(b == null) b = 10;                                                                                             // 668
  if(this.signum() == 0 || b < 2 || b > 36) return "0";                                                             // 669
  var cs = this.chunkSize(b);                                                                                       // 670
  var a = Math.pow(b,cs);                                                                                           // 671
  var d = nbv(a), y = nbi(), z = nbi(), r = "";                                                                     // 672
  this.divRemTo(d,y,z);                                                                                             // 673
  while(y.signum() > 0) {                                                                                           // 674
    r = (a+z.intValue()).toString(b).substr(1) + r;                                                                 // 675
    y.divRemTo(d,y,z);                                                                                              // 676
  }                                                                                                                 // 677
  return z.intValue().toString(b) + r;                                                                              // 678
}                                                                                                                   // 679
                                                                                                                    // 680
// (protected) convert from radix string                                                                            // 681
function bnpFromRadix(s,b) {                                                                                        // 682
  this.fromInt(0);                                                                                                  // 683
  if(b == null) b = 10;                                                                                             // 684
  var cs = this.chunkSize(b);                                                                                       // 685
  var d = Math.pow(b,cs), mi = false, j = 0, w = 0;                                                                 // 686
  for(var i = 0; i < s.length; ++i) {                                                                               // 687
    var x = intAt(s,i);                                                                                             // 688
    if(x < 0) {                                                                                                     // 689
      if(s.charAt(i) == "-" && this.signum() == 0) mi = true;                                                       // 690
      continue;                                                                                                     // 691
    }                                                                                                               // 692
    w = b*w+x;                                                                                                      // 693
    if(++j >= cs) {                                                                                                 // 694
      this.dMultiply(d);                                                                                            // 695
      this.dAddOffset(w,0);                                                                                         // 696
      j = 0;                                                                                                        // 697
      w = 0;                                                                                                        // 698
    }                                                                                                               // 699
  }                                                                                                                 // 700
  if(j > 0) {                                                                                                       // 701
    this.dMultiply(Math.pow(b,j));                                                                                  // 702
    this.dAddOffset(w,0);                                                                                           // 703
  }                                                                                                                 // 704
  if(mi) BigInteger.ZERO.subTo(this,this);                                                                          // 705
}                                                                                                                   // 706
                                                                                                                    // 707
// (protected) alternate constructor                                                                                // 708
function bnpFromNumber(a,b,c) {                                                                                     // 709
  if("number" == typeof b) {                                                                                        // 710
    // new BigInteger(int,int,RNG)                                                                                  // 711
    if(a < 2) this.fromInt(1);                                                                                      // 712
    else {                                                                                                          // 713
      this.fromNumber(a,c);                                                                                         // 714
      if(!this.testBit(a-1))	// force MSB set                                                                       // 715
        this.bitwiseTo(BigInteger.ONE.shiftLeft(a-1),op_or,this);                                                   // 716
      if(this.isEven()) this.dAddOffset(1,0); // force odd                                                          // 717
      while(!this.isProbablePrime(b)) {                                                                             // 718
        this.dAddOffset(2,0);                                                                                       // 719
        if(this.bitLength() > a) this.subTo(BigInteger.ONE.shiftLeft(a-1),this);                                    // 720
      }                                                                                                             // 721
    }                                                                                                               // 722
  }                                                                                                                 // 723
  else {                                                                                                            // 724
    // new BigInteger(int,RNG)                                                                                      // 725
    var x = new Array(), t = a&7;                                                                                   // 726
    x.length = (a>>3)+1;                                                                                            // 727
    b.nextBytes(x);                                                                                                 // 728
    if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;                                                                    // 729
    this.fromString(x,256);                                                                                         // 730
  }                                                                                                                 // 731
}                                                                                                                   // 732
                                                                                                                    // 733
// (public) convert to bigendian byte array                                                                         // 734
function bnToByteArray() {                                                                                          // 735
  var i = this.t, r = new Array();                                                                                  // 736
  r[0] = this.s;                                                                                                    // 737
  var p = this.DB-(i*this.DB)%8, d, k = 0;                                                                          // 738
  if(i-- > 0) {                                                                                                     // 739
    if(p < this.DB && (d = this[i]>>p) != (this.s&this.DM)>>p)                                                      // 740
      r[k++] = d|(this.s<<(this.DB-p));                                                                             // 741
    while(i >= 0) {                                                                                                 // 742
      if(p < 8) {                                                                                                   // 743
        d = (this[i]&((1<<p)-1))<<(8-p);                                                                            // 744
        d |= this[--i]>>(p+=this.DB-8);                                                                             // 745
      }                                                                                                             // 746
      else {                                                                                                        // 747
        d = (this[i]>>(p-=8))&0xff;                                                                                 // 748
        if(p <= 0) { p += this.DB; --i; }                                                                           // 749
      }                                                                                                             // 750
      if((d&0x80) != 0) d |= -256;                                                                                  // 751
      if(k == 0 && (this.s&0x80) != (d&0x80)) ++k;                                                                  // 752
      if(k > 0 || d != this.s) r[k++] = d;                                                                          // 753
    }                                                                                                               // 754
  }                                                                                                                 // 755
  return r;                                                                                                         // 756
}                                                                                                                   // 757
                                                                                                                    // 758
function bnEquals(a) { return(this.compareTo(a)==0); }                                                              // 759
function bnMin(a) { return(this.compareTo(a)<0)?this:a; }                                                           // 760
function bnMax(a) { return(this.compareTo(a)>0)?this:a; }                                                           // 761
                                                                                                                    // 762
// (protected) r = this op a (bitwise)                                                                              // 763
function bnpBitwiseTo(a,op,r) {                                                                                     // 764
  var i, f, m = Math.min(a.t,this.t);                                                                               // 765
  for(i = 0; i < m; ++i) r[i] = op(this[i],a[i]);                                                                   // 766
  if(a.t < this.t) {                                                                                                // 767
    f = a.s&this.DM;                                                                                                // 768
    for(i = m; i < this.t; ++i) r[i] = op(this[i],f);                                                               // 769
    r.t = this.t;                                                                                                   // 770
  }                                                                                                                 // 771
  else {                                                                                                            // 772
    f = this.s&this.DM;                                                                                             // 773
    for(i = m; i < a.t; ++i) r[i] = op(f,a[i]);                                                                     // 774
    r.t = a.t;                                                                                                      // 775
  }                                                                                                                 // 776
  r.s = op(this.s,a.s);                                                                                             // 777
  r.clamp();                                                                                                        // 778
}                                                                                                                   // 779
                                                                                                                    // 780
// (public) this & a                                                                                                // 781
function op_and(x,y) { return x&y; }                                                                                // 782
function bnAnd(a) { var r = nbi(); this.bitwiseTo(a,op_and,r); return r; }                                          // 783
                                                                                                                    // 784
// (public) this | a                                                                                                // 785
function op_or(x,y) { return x|y; }                                                                                 // 786
function bnOr(a) { var r = nbi(); this.bitwiseTo(a,op_or,r); return r; }                                            // 787
                                                                                                                    // 788
// (public) this ^ a                                                                                                // 789
function op_xor(x,y) { return x^y; }                                                                                // 790
function bnXor(a) { var r = nbi(); this.bitwiseTo(a,op_xor,r); return r; }                                          // 791
                                                                                                                    // 792
// (public) this & ~a                                                                                               // 793
function op_andnot(x,y) { return x&~y; }                                                                            // 794
function bnAndNot(a) { var r = nbi(); this.bitwiseTo(a,op_andnot,r); return r; }                                    // 795
                                                                                                                    // 796
// (public) ~this                                                                                                   // 797
function bnNot() {                                                                                                  // 798
  var r = nbi();                                                                                                    // 799
  for(var i = 0; i < this.t; ++i) r[i] = this.DM&~this[i];                                                          // 800
  r.t = this.t;                                                                                                     // 801
  r.s = ~this.s;                                                                                                    // 802
  return r;                                                                                                         // 803
}                                                                                                                   // 804
                                                                                                                    // 805
// (public) this << n                                                                                               // 806
function bnShiftLeft(n) {                                                                                           // 807
  var r = nbi();                                                                                                    // 808
  if(n < 0) this.rShiftTo(-n,r); else this.lShiftTo(n,r);                                                           // 809
  return r;                                                                                                         // 810
}                                                                                                                   // 811
                                                                                                                    // 812
// (public) this >> n                                                                                               // 813
function bnShiftRight(n) {                                                                                          // 814
  var r = nbi();                                                                                                    // 815
  if(n < 0) this.lShiftTo(-n,r); else this.rShiftTo(n,r);                                                           // 816
  return r;                                                                                                         // 817
}                                                                                                                   // 818
                                                                                                                    // 819
// return index of lowest 1-bit in x, x < 2^31                                                                      // 820
function lbit(x) {                                                                                                  // 821
  if(x == 0) return -1;                                                                                             // 822
  var r = 0;                                                                                                        // 823
  if((x&0xffff) == 0) { x >>= 16; r += 16; }                                                                        // 824
  if((x&0xff) == 0) { x >>= 8; r += 8; }                                                                            // 825
  if((x&0xf) == 0) { x >>= 4; r += 4; }                                                                             // 826
  if((x&3) == 0) { x >>= 2; r += 2; }                                                                               // 827
  if((x&1) == 0) ++r;                                                                                               // 828
  return r;                                                                                                         // 829
}                                                                                                                   // 830
                                                                                                                    // 831
// (public) returns index of lowest 1-bit (or -1 if none)                                                           // 832
function bnGetLowestSetBit() {                                                                                      // 833
  for(var i = 0; i < this.t; ++i)                                                                                   // 834
    if(this[i] != 0) return i*this.DB+lbit(this[i]);                                                                // 835
  if(this.s < 0) return this.t*this.DB;                                                                             // 836
  return -1;                                                                                                        // 837
}                                                                                                                   // 838
                                                                                                                    // 839
// return number of 1 bits in x                                                                                     // 840
function cbit(x) {                                                                                                  // 841
  var r = 0;                                                                                                        // 842
  while(x != 0) { x &= x-1; ++r; }                                                                                  // 843
  return r;                                                                                                         // 844
}                                                                                                                   // 845
                                                                                                                    // 846
// (public) return number of set bits                                                                               // 847
function bnBitCount() {                                                                                             // 848
  var r = 0, x = this.s&this.DM;                                                                                    // 849
  for(var i = 0; i < this.t; ++i) r += cbit(this[i]^x);                                                             // 850
  return r;                                                                                                         // 851
}                                                                                                                   // 852
                                                                                                                    // 853
// (public) true iff nth bit is set                                                                                 // 854
function bnTestBit(n) {                                                                                             // 855
  var j = Math.floor(n/this.DB);                                                                                    // 856
  if(j >= this.t) return(this.s!=0);                                                                                // 857
  return((this[j]&(1<<(n%this.DB)))!=0);                                                                            // 858
}                                                                                                                   // 859
                                                                                                                    // 860
// (protected) this op (1<<n)                                                                                       // 861
function bnpChangeBit(n,op) {                                                                                       // 862
  var r = BigInteger.ONE.shiftLeft(n);                                                                              // 863
  this.bitwiseTo(r,op,r);                                                                                           // 864
  return r;                                                                                                         // 865
}                                                                                                                   // 866
                                                                                                                    // 867
// (public) this | (1<<n)                                                                                           // 868
function bnSetBit(n) { return this.changeBit(n,op_or); }                                                            // 869
                                                                                                                    // 870
// (public) this & ~(1<<n)                                                                                          // 871
function bnClearBit(n) { return this.changeBit(n,op_andnot); }                                                      // 872
                                                                                                                    // 873
// (public) this ^ (1<<n)                                                                                           // 874
function bnFlipBit(n) { return this.changeBit(n,op_xor); }                                                          // 875
                                                                                                                    // 876
// (protected) r = this + a                                                                                         // 877
function bnpAddTo(a,r) {                                                                                            // 878
  var i = 0, c = 0, m = Math.min(a.t,this.t);                                                                       // 879
  while(i < m) {                                                                                                    // 880
    c += this[i]+a[i];                                                                                              // 881
    r[i++] = c&this.DM;                                                                                             // 882
    c >>= this.DB;                                                                                                  // 883
  }                                                                                                                 // 884
  if(a.t < this.t) {                                                                                                // 885
    c += a.s;                                                                                                       // 886
    while(i < this.t) {                                                                                             // 887
      c += this[i];                                                                                                 // 888
      r[i++] = c&this.DM;                                                                                           // 889
      c >>= this.DB;                                                                                                // 890
    }                                                                                                               // 891
    c += this.s;                                                                                                    // 892
  }                                                                                                                 // 893
  else {                                                                                                            // 894
    c += this.s;                                                                                                    // 895
    while(i < a.t) {                                                                                                // 896
      c += a[i];                                                                                                    // 897
      r[i++] = c&this.DM;                                                                                           // 898
      c >>= this.DB;                                                                                                // 899
    }                                                                                                               // 900
    c += a.s;                                                                                                       // 901
  }                                                                                                                 // 902
  r.s = (c<0)?-1:0;                                                                                                 // 903
  if(c > 0) r[i++] = c;                                                                                             // 904
  else if(c < -1) r[i++] = this.DV+c;                                                                               // 905
  r.t = i;                                                                                                          // 906
  r.clamp();                                                                                                        // 907
}                                                                                                                   // 908
                                                                                                                    // 909
// (public) this + a                                                                                                // 910
function bnAdd(a) { var r = nbi(); this.addTo(a,r); return r; }                                                     // 911
                                                                                                                    // 912
// (public) this - a                                                                                                // 913
function bnSubtract(a) { var r = nbi(); this.subTo(a,r); return r; }                                                // 914
                                                                                                                    // 915
// (public) this * a                                                                                                // 916
function bnMultiply(a) { var r = nbi(); this.multiplyTo(a,r); return r; }                                           // 917
                                                                                                                    // 918
// (public) this / a                                                                                                // 919
function bnDivide(a) { var r = nbi(); this.divRemTo(a,r,null); return r; }                                          // 920
                                                                                                                    // 921
// (public) this % a                                                                                                // 922
function bnRemainder(a) { var r = nbi(); this.divRemTo(a,null,r); return r; }                                       // 923
                                                                                                                    // 924
// (public) [this/a,this%a]                                                                                         // 925
function bnDivideAndRemainder(a) {                                                                                  // 926
  var q = nbi(), r = nbi();                                                                                         // 927
  this.divRemTo(a,q,r);                                                                                             // 928
  return new Array(q,r);                                                                                            // 929
}                                                                                                                   // 930
                                                                                                                    // 931
// (protected) this *= n, this >= 0, 1 < n < DV                                                                     // 932
function bnpDMultiply(n) {                                                                                          // 933
  this[this.t] = this.am(0,n-1,this,0,0,this.t);                                                                    // 934
  ++this.t;                                                                                                         // 935
  this.clamp();                                                                                                     // 936
}                                                                                                                   // 937
                                                                                                                    // 938
// (protected) this += n << w words, this >= 0                                                                      // 939
function bnpDAddOffset(n,w) {                                                                                       // 940
  while(this.t <= w) this[this.t++] = 0;                                                                            // 941
  this[w] += n;                                                                                                     // 942
  while(this[w] >= this.DV) {                                                                                       // 943
    this[w] -= this.DV;                                                                                             // 944
    if(++w >= this.t) this[this.t++] = 0;                                                                           // 945
    ++this[w];                                                                                                      // 946
  }                                                                                                                 // 947
}                                                                                                                   // 948
                                                                                                                    // 949
// A "null" reducer                                                                                                 // 950
function NullExp() {}                                                                                               // 951
function nNop(x) { return x; }                                                                                      // 952
function nMulTo(x,y,r) { x.multiplyTo(y,r); }                                                                       // 953
function nSqrTo(x,r) { x.squareTo(r); }                                                                             // 954
                                                                                                                    // 955
NullExp.prototype.convert = nNop;                                                                                   // 956
NullExp.prototype.revert = nNop;                                                                                    // 957
NullExp.prototype.mulTo = nMulTo;                                                                                   // 958
NullExp.prototype.sqrTo = nSqrTo;                                                                                   // 959
                                                                                                                    // 960
// (public) this^e                                                                                                  // 961
function bnPow(e) { return this.exp(e,new NullExp()); }                                                             // 962
                                                                                                                    // 963
// (protected) r = lower n words of "this * a", a.t <= n                                                            // 964
// "this" should be the larger one if appropriate.                                                                  // 965
function bnpMultiplyLowerTo(a,n,r) {                                                                                // 966
  var i = Math.min(this.t+a.t,n);                                                                                   // 967
  r.s = 0; // assumes a,this >= 0                                                                                   // 968
  r.t = i;                                                                                                          // 969
  while(i > 0) r[--i] = 0;                                                                                          // 970
  var j;                                                                                                            // 971
  for(j = r.t-this.t; i < j; ++i) r[i+this.t] = this.am(0,a[i],r,i,0,this.t);                                       // 972
  for(j = Math.min(a.t,n); i < j; ++i) this.am(0,a[i],r,i,0,n-i);                                                   // 973
  r.clamp();                                                                                                        // 974
}                                                                                                                   // 975
                                                                                                                    // 976
// (protected) r = "this * a" without lower n words, n > 0                                                          // 977
// "this" should be the larger one if appropriate.                                                                  // 978
function bnpMultiplyUpperTo(a,n,r) {                                                                                // 979
  --n;                                                                                                              // 980
  var i = r.t = this.t+a.t-n;                                                                                       // 981
  r.s = 0; // assumes a,this >= 0                                                                                   // 982
  while(--i >= 0) r[i] = 0;                                                                                         // 983
  for(i = Math.max(n-this.t,0); i < a.t; ++i)                                                                       // 984
    r[this.t+i-n] = this.am(n-i,a[i],r,0,0,this.t+i-n);                                                             // 985
  r.clamp();                                                                                                        // 986
  r.drShiftTo(1,r);                                                                                                 // 987
}                                                                                                                   // 988
                                                                                                                    // 989
// Barrett modular reduction                                                                                        // 990
function Barrett(m) {                                                                                               // 991
  // setup Barrett                                                                                                  // 992
  this.r2 = nbi();                                                                                                  // 993
  this.q3 = nbi();                                                                                                  // 994
  BigInteger.ONE.dlShiftTo(2*m.t,this.r2);                                                                          // 995
  this.mu = this.r2.divide(m);                                                                                      // 996
  this.m = m;                                                                                                       // 997
}                                                                                                                   // 998
                                                                                                                    // 999
function barrettConvert(x) {                                                                                        // 1000
  if(x.s < 0 || x.t > 2*this.m.t) return x.mod(this.m);                                                             // 1001
  else if(x.compareTo(this.m) < 0) return x;                                                                        // 1002
  else { var r = nbi(); x.copyTo(r); this.reduce(r); return r; }                                                    // 1003
}                                                                                                                   // 1004
                                                                                                                    // 1005
function barrettRevert(x) { return x; }                                                                             // 1006
                                                                                                                    // 1007
// x = x mod m (HAC 14.42)                                                                                          // 1008
function barrettReduce(x) {                                                                                         // 1009
  x.drShiftTo(this.m.t-1,this.r2);                                                                                  // 1010
  if(x.t > this.m.t+1) { x.t = this.m.t+1; x.clamp(); }                                                             // 1011
  this.mu.multiplyUpperTo(this.r2,this.m.t+1,this.q3);                                                              // 1012
  this.m.multiplyLowerTo(this.q3,this.m.t+1,this.r2);                                                               // 1013
  while(x.compareTo(this.r2) < 0) x.dAddOffset(1,this.m.t+1);                                                       // 1014
  x.subTo(this.r2,x);                                                                                               // 1015
  while(x.compareTo(this.m) >= 0) x.subTo(this.m,x);                                                                // 1016
}                                                                                                                   // 1017
                                                                                                                    // 1018
// r = x^2 mod m; x != r                                                                                            // 1019
function barrettSqrTo(x,r) { x.squareTo(r); this.reduce(r); }                                                       // 1020
                                                                                                                    // 1021
// r = x*y mod m; x,y != r                                                                                          // 1022
function barrettMulTo(x,y,r) { x.multiplyTo(y,r); this.reduce(r); }                                                 // 1023
                                                                                                                    // 1024
Barrett.prototype.convert = barrettConvert;                                                                         // 1025
Barrett.prototype.revert = barrettRevert;                                                                           // 1026
Barrett.prototype.reduce = barrettReduce;                                                                           // 1027
Barrett.prototype.mulTo = barrettMulTo;                                                                             // 1028
Barrett.prototype.sqrTo = barrettSqrTo;                                                                             // 1029
                                                                                                                    // 1030
// (public) this^e % m (HAC 14.85)                                                                                  // 1031
function bnModPow(e,m) {                                                                                            // 1032
  var i = e.bitLength(), k, r = nbv(1), z;                                                                          // 1033
  if(i <= 0) return r;                                                                                              // 1034
  else if(i < 18) k = 1;                                                                                            // 1035
  else if(i < 48) k = 3;                                                                                            // 1036
  else if(i < 144) k = 4;                                                                                           // 1037
  else if(i < 768) k = 5;                                                                                           // 1038
  else k = 6;                                                                                                       // 1039
  if(i < 8)                                                                                                         // 1040
    z = new Classic(m);                                                                                             // 1041
  else if(m.isEven())                                                                                               // 1042
    z = new Barrett(m);                                                                                             // 1043
  else                                                                                                              // 1044
    z = new Montgomery(m);                                                                                          // 1045
                                                                                                                    // 1046
  // precomputation                                                                                                 // 1047
  var g = new Array(), n = 3, k1 = k-1, km = (1<<k)-1;                                                              // 1048
  g[1] = z.convert(this);                                                                                           // 1049
  if(k > 1) {                                                                                                       // 1050
    var g2 = nbi();                                                                                                 // 1051
    z.sqrTo(g[1],g2);                                                                                               // 1052
    while(n <= km) {                                                                                                // 1053
      g[n] = nbi();                                                                                                 // 1054
      z.mulTo(g2,g[n-2],g[n]);                                                                                      // 1055
      n += 2;                                                                                                       // 1056
    }                                                                                                               // 1057
  }                                                                                                                 // 1058
                                                                                                                    // 1059
  var j = e.t-1, w, is1 = true, r2 = nbi(), t;                                                                      // 1060
  i = nbits(e[j])-1;                                                                                                // 1061
  while(j >= 0) {                                                                                                   // 1062
    if(i >= k1) w = (e[j]>>(i-k1))&km;                                                                              // 1063
    else {                                                                                                          // 1064
      w = (e[j]&((1<<(i+1))-1))<<(k1-i);                                                                            // 1065
      if(j > 0) w |= e[j-1]>>(this.DB+i-k1);                                                                        // 1066
    }                                                                                                               // 1067
                                                                                                                    // 1068
    n = k;                                                                                                          // 1069
    while((w&1) == 0) { w >>= 1; --n; }                                                                             // 1070
    if((i -= n) < 0) { i += this.DB; --j; }                                                                         // 1071
    if(is1) {	// ret == 1, don't bother squaring or multiplying it                                                  // 1072
      g[w].copyTo(r);                                                                                               // 1073
      is1 = false;                                                                                                  // 1074
    }                                                                                                               // 1075
    else {                                                                                                          // 1076
      while(n > 1) { z.sqrTo(r,r2); z.sqrTo(r2,r); n -= 2; }                                                        // 1077
      if(n > 0) z.sqrTo(r,r2); else { t = r; r = r2; r2 = t; }                                                      // 1078
      z.mulTo(r2,g[w],r);                                                                                           // 1079
    }                                                                                                               // 1080
                                                                                                                    // 1081
    while(j >= 0 && (e[j]&(1<<i)) == 0) {                                                                           // 1082
      z.sqrTo(r,r2); t = r; r = r2; r2 = t;                                                                         // 1083
      if(--i < 0) { i = this.DB-1; --j; }                                                                           // 1084
    }                                                                                                               // 1085
  }                                                                                                                 // 1086
  return z.revert(r);                                                                                               // 1087
}                                                                                                                   // 1088
                                                                                                                    // 1089
// (public) gcd(this,a) (HAC 14.54)                                                                                 // 1090
function bnGCD(a) {                                                                                                 // 1091
  var x = (this.s<0)?this.negate():this.clone();                                                                    // 1092
  var y = (a.s<0)?a.negate():a.clone();                                                                             // 1093
  if(x.compareTo(y) < 0) { var t = x; x = y; y = t; }                                                               // 1094
  var i = x.getLowestSetBit(), g = y.getLowestSetBit();                                                             // 1095
  if(g < 0) return x;                                                                                               // 1096
  if(i < g) g = i;                                                                                                  // 1097
  if(g > 0) {                                                                                                       // 1098
    x.rShiftTo(g,x);                                                                                                // 1099
    y.rShiftTo(g,y);                                                                                                // 1100
  }                                                                                                                 // 1101
  while(x.signum() > 0) {                                                                                           // 1102
    if((i = x.getLowestSetBit()) > 0) x.rShiftTo(i,x);                                                              // 1103
    if((i = y.getLowestSetBit()) > 0) y.rShiftTo(i,y);                                                              // 1104
    if(x.compareTo(y) >= 0) {                                                                                       // 1105
      x.subTo(y,x);                                                                                                 // 1106
      x.rShiftTo(1,x);                                                                                              // 1107
    }                                                                                                               // 1108
    else {                                                                                                          // 1109
      y.subTo(x,y);                                                                                                 // 1110
      y.rShiftTo(1,y);                                                                                              // 1111
    }                                                                                                               // 1112
  }                                                                                                                 // 1113
  if(g > 0) y.lShiftTo(g,y);                                                                                        // 1114
  return y;                                                                                                         // 1115
}                                                                                                                   // 1116
                                                                                                                    // 1117
// (protected) this % n, n < 2^26                                                                                   // 1118
function bnpModInt(n) {                                                                                             // 1119
  if(n <= 0) return 0;                                                                                              // 1120
  var d = this.DV%n, r = (this.s<0)?n-1:0;                                                                          // 1121
  if(this.t > 0)                                                                                                    // 1122
    if(d == 0) r = this[0]%n;                                                                                       // 1123
    else for(var i = this.t-1; i >= 0; --i) r = (d*r+this[i])%n;                                                    // 1124
  return r;                                                                                                         // 1125
}                                                                                                                   // 1126
                                                                                                                    // 1127
// (public) 1/this % m (HAC 14.61)                                                                                  // 1128
function bnModInverse(m) {                                                                                          // 1129
  var ac = m.isEven();                                                                                              // 1130
  if((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO;                                              // 1131
  var u = m.clone(), v = this.clone();                                                                              // 1132
  var a = nbv(1), b = nbv(0), c = nbv(0), d = nbv(1);                                                               // 1133
  while(u.signum() != 0) {                                                                                          // 1134
    while(u.isEven()) {                                                                                             // 1135
      u.rShiftTo(1,u);                                                                                              // 1136
      if(ac) {                                                                                                      // 1137
        if(!a.isEven() || !b.isEven()) { a.addTo(this,a); b.subTo(m,b); }                                           // 1138
        a.rShiftTo(1,a);                                                                                            // 1139
      }                                                                                                             // 1140
      else if(!b.isEven()) b.subTo(m,b);                                                                            // 1141
      b.rShiftTo(1,b);                                                                                              // 1142
    }                                                                                                               // 1143
    while(v.isEven()) {                                                                                             // 1144
      v.rShiftTo(1,v);                                                                                              // 1145
      if(ac) {                                                                                                      // 1146
        if(!c.isEven() || !d.isEven()) { c.addTo(this,c); d.subTo(m,d); }                                           // 1147
        c.rShiftTo(1,c);                                                                                            // 1148
      }                                                                                                             // 1149
      else if(!d.isEven()) d.subTo(m,d);                                                                            // 1150
      d.rShiftTo(1,d);                                                                                              // 1151
    }                                                                                                               // 1152
    if(u.compareTo(v) >= 0) {                                                                                       // 1153
      u.subTo(v,u);                                                                                                 // 1154
      if(ac) a.subTo(c,a);                                                                                          // 1155
      b.subTo(d,b);                                                                                                 // 1156
    }                                                                                                               // 1157
    else {                                                                                                          // 1158
      v.subTo(u,v);                                                                                                 // 1159
      if(ac) c.subTo(a,c);                                                                                          // 1160
      d.subTo(b,d);                                                                                                 // 1161
    }                                                                                                               // 1162
  }                                                                                                                 // 1163
  if(v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO;                                                      // 1164
  if(d.compareTo(m) >= 0) return d.subtract(m);                                                                     // 1165
  if(d.signum() < 0) d.addTo(m,d); else return d;                                                                   // 1166
  if(d.signum() < 0) return d.add(m); else return d;                                                                // 1167
}                                                                                                                   // 1168
                                                                                                                    // 1169
var lowprimes = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101,103,107,109,113,127,131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,271,277,281,283,293,307,311,313,317,331,337,347,349,353,359,367,373,379,383,389,397,401,409,419,421,431,433,439,443,449,457,461,463,467,479,487,491,499,503,509];
var lplim = (1<<26)/lowprimes[lowprimes.length-1];                                                                  // 1171
                                                                                                                    // 1172
// (public) test primality with certainty >= 1-.5^t                                                                 // 1173
function bnIsProbablePrime(t) {                                                                                     // 1174
  var i, x = this.abs();                                                                                            // 1175
  if(x.t == 1 && x[0] <= lowprimes[lowprimes.length-1]) {                                                           // 1176
    for(i = 0; i < lowprimes.length; ++i)                                                                           // 1177
      if(x[0] == lowprimes[i]) return true;                                                                         // 1178
    return false;                                                                                                   // 1179
  }                                                                                                                 // 1180
  if(x.isEven()) return false;                                                                                      // 1181
  i = 1;                                                                                                            // 1182
  while(i < lowprimes.length) {                                                                                     // 1183
    var m = lowprimes[i], j = i+1;                                                                                  // 1184
    while(j < lowprimes.length && m < lplim) m *= lowprimes[j++];                                                   // 1185
    m = x.modInt(m);                                                                                                // 1186
    while(i < j) if(m%lowprimes[i++] == 0) return false;                                                            // 1187
  }                                                                                                                 // 1188
  return x.millerRabin(t);                                                                                          // 1189
}                                                                                                                   // 1190
                                                                                                                    // 1191
// (protected) true if probably prime (HAC 4.24, Miller-Rabin)                                                      // 1192
function bnpMillerRabin(t) {                                                                                        // 1193
  var n1 = this.subtract(BigInteger.ONE);                                                                           // 1194
  var k = n1.getLowestSetBit();                                                                                     // 1195
  if(k <= 0) return false;                                                                                          // 1196
  var r = n1.shiftRight(k);                                                                                         // 1197
  t = (t+1)>>1;                                                                                                     // 1198
  if(t > lowprimes.length) t = lowprimes.length;                                                                    // 1199
  var a = nbi();                                                                                                    // 1200
  for(var i = 0; i < t; ++i) {                                                                                      // 1201
    a.fromInt(lowprimes[i]);                                                                                        // 1202
    var y = a.modPow(r,this);                                                                                       // 1203
    if(y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {                                                  // 1204
      var j = 1;                                                                                                    // 1205
      while(j++ < k && y.compareTo(n1) != 0) {                                                                      // 1206
        y = y.modPowInt(2,this);                                                                                    // 1207
        if(y.compareTo(BigInteger.ONE) == 0) return false;                                                          // 1208
      }                                                                                                             // 1209
      if(y.compareTo(n1) != 0) return false;                                                                        // 1210
    }                                                                                                               // 1211
  }                                                                                                                 // 1212
  return true;                                                                                                      // 1213
}                                                                                                                   // 1214
                                                                                                                    // 1215
// protected                                                                                                        // 1216
BigInteger.prototype.chunkSize = bnpChunkSize;                                                                      // 1217
BigInteger.prototype.toRadix = bnpToRadix;                                                                          // 1218
BigInteger.prototype.fromRadix = bnpFromRadix;                                                                      // 1219
BigInteger.prototype.fromNumber = bnpFromNumber;                                                                    // 1220
BigInteger.prototype.bitwiseTo = bnpBitwiseTo;                                                                      // 1221
BigInteger.prototype.changeBit = bnpChangeBit;                                                                      // 1222
BigInteger.prototype.addTo = bnpAddTo;                                                                              // 1223
BigInteger.prototype.dMultiply = bnpDMultiply;                                                                      // 1224
BigInteger.prototype.dAddOffset = bnpDAddOffset;                                                                    // 1225
BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;                                                          // 1226
BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;                                                          // 1227
BigInteger.prototype.modInt = bnpModInt;                                                                            // 1228
BigInteger.prototype.millerRabin = bnpMillerRabin;                                                                  // 1229
                                                                                                                    // 1230
// public                                                                                                           // 1231
BigInteger.prototype.clone = bnClone;                                                                               // 1232
BigInteger.prototype.intValue = bnIntValue;                                                                         // 1233
BigInteger.prototype.byteValue = bnByteValue;                                                                       // 1234
BigInteger.prototype.shortValue = bnShortValue;                                                                     // 1235
BigInteger.prototype.signum = bnSigNum;                                                                             // 1236
BigInteger.prototype.toByteArray = bnToByteArray;                                                                   // 1237
BigInteger.prototype.equals = bnEquals;                                                                             // 1238
BigInteger.prototype.min = bnMin;                                                                                   // 1239
BigInteger.prototype.max = bnMax;                                                                                   // 1240
BigInteger.prototype.and = bnAnd;                                                                                   // 1241
BigInteger.prototype.or = bnOr;                                                                                     // 1242
BigInteger.prototype.xor = bnXor;                                                                                   // 1243
BigInteger.prototype.andNot = bnAndNot;                                                                             // 1244
BigInteger.prototype.not = bnNot;                                                                                   // 1245
BigInteger.prototype.shiftLeft = bnShiftLeft;                                                                       // 1246
BigInteger.prototype.shiftRight = bnShiftRight;                                                                     // 1247
BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;                                                           // 1248
BigInteger.prototype.bitCount = bnBitCount;                                                                         // 1249
BigInteger.prototype.testBit = bnTestBit;                                                                           // 1250
BigInteger.prototype.setBit = bnSetBit;                                                                             // 1251
BigInteger.prototype.clearBit = bnClearBit;                                                                         // 1252
BigInteger.prototype.flipBit = bnFlipBit;                                                                           // 1253
BigInteger.prototype.add = bnAdd;                                                                                   // 1254
BigInteger.prototype.subtract = bnSubtract;                                                                         // 1255
BigInteger.prototype.multiply = bnMultiply;                                                                         // 1256
BigInteger.prototype.divide = bnDivide;                                                                             // 1257
BigInteger.prototype.remainder = bnRemainder;                                                                       // 1258
BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;                                                     // 1259
BigInteger.prototype.modPow = bnModPow;                                                                             // 1260
BigInteger.prototype.modInverse = bnModInverse;                                                                     // 1261
BigInteger.prototype.pow = bnPow;                                                                                   // 1262
BigInteger.prototype.gcd = bnGCD;                                                                                   // 1263
BigInteger.prototype.isProbablePrime = bnIsProbablePrime;                                                           // 1264
                                                                                                                    // 1265
// BigInteger interfaces not implemented in jsbn:                                                                   // 1266
                                                                                                                    // 1267
// BigInteger(int signum, byte[] magnitude)                                                                         // 1268
// double doubleValue()                                                                                             // 1269
// float floatValue()                                                                                               // 1270
// int hashCode()                                                                                                   // 1271
// long longValue()                                                                                                 // 1272
// static BigInteger valueOf(long val)                                                                              // 1273
                                                                                                                    // 1274
/// METEOR WRAPPER                                                                                                  // 1275
return BigInteger;                                                                                                  // 1276
})();                                                                                                               // 1277
                                                                                                                    // 1278
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/srp/srp.js                                                                                              //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
// This package contains just enough of the original SRP code to                                                    // 1
// support the backwards-compatibility upgrade path.                                                                // 2
//                                                                                                                  // 3
// An SRP (and possibly also accounts-srp) package should eventually be                                             // 4
// available in Atmosphere so that users can continue to use SRP if they                                            // 5
// want to.                                                                                                         // 6
                                                                                                                    // 7
SRP = {};                                                                                                           // 8
                                                                                                                    // 9
/**                                                                                                                 // 10
 * Generate a new SRP verifier. Password is the plaintext password.                                                 // 11
 *                                                                                                                  // 12
 * options is optional and can include:                                                                             // 13
 * - identity: String. The SRP username to user. Mostly this is passed                                              // 14
 *   in for testing.  Random UUID if not provided.                                                                  // 15
 * - hashedIdentityAndPassword: combined identity and password, already hashed, for the SRP to bcrypt upgrade path. // 16
 * - salt: String. A salt to use.  Mostly this is passed in for                                                     // 17
 *   testing.  Random UUID if not provided.                                                                         // 18
 * - SRP parameters (see _defaults and paramsFromOptions below)                                                     // 19
 */                                                                                                                 // 20
SRP.generateVerifier = function (password, options) {                                                               // 21
  var params = paramsFromOptions(options);                                                                          // 22
                                                                                                                    // 23
  var salt = (options && options.salt) || Random.secret();                                                          // 24
                                                                                                                    // 25
  var identity;                                                                                                     // 26
  var hashedIdentityAndPassword = options && options.hashedIdentityAndPassword;                                     // 27
  if (!hashedIdentityAndPassword) {                                                                                 // 28
    identity = (options && options.identity) || Random.secret();                                                    // 29
    hashedIdentityAndPassword = params.hash(identity + ":" + password);                                             // 30
  }                                                                                                                 // 31
                                                                                                                    // 32
  var x = params.hash(salt + hashedIdentityAndPassword);                                                            // 33
  var xi = new BigInteger(x, 16);                                                                                   // 34
  var v = params.g.modPow(xi, params.N);                                                                            // 35
                                                                                                                    // 36
  return {                                                                                                          // 37
    identity: identity,                                                                                             // 38
    salt: salt,                                                                                                     // 39
    verifier: v.toString(16)                                                                                        // 40
  };                                                                                                                // 41
};                                                                                                                  // 42
                                                                                                                    // 43
// For use with check().                                                                                            // 44
SRP.matchVerifier = {                                                                                               // 45
  identity: String,                                                                                                 // 46
  salt: String,                                                                                                     // 47
  verifier: String                                                                                                  // 48
};                                                                                                                  // 49
                                                                                                                    // 50
                                                                                                                    // 51
/**                                                                                                                 // 52
 * Default parameter values for SRP.                                                                                // 53
 *                                                                                                                  // 54
 */                                                                                                                 // 55
var _defaults = {                                                                                                   // 56
  hash: function (x) { return SHA256(x).toLowerCase(); },                                                           // 57
  N: new BigInteger("EEAF0AB9ADB38DD69C33F80AFA8FC5E86072618775FF3C0B9EA2314C9C256576D674DF7496EA81D3383B4813D692C6E0E0D5D8E250B98BE48E495C1D6089DAD15DC7D7B46154D6B6CE8EF4AD69B15D4982559B297BCF1885C529F566660E57EC68EDBC3C05726CC02FD4CBF4976EAA9AFD5138FE8376435B9FC61D2FC0EB06E3", 16),
  g: new BigInteger("2")                                                                                            // 59
};                                                                                                                  // 60
_defaults.k = new BigInteger(                                                                                       // 61
  _defaults.hash(                                                                                                   // 62
    _defaults.N.toString(16) +                                                                                      // 63
      _defaults.g.toString(16)),                                                                                    // 64
  16);                                                                                                              // 65
                                                                                                                    // 66
/**                                                                                                                 // 67
 * Process an options hash to create SRP parameters.                                                                // 68
 *                                                                                                                  // 69
 * Options can include:                                                                                             // 70
 * - hash: Function. Defaults to SHA256.                                                                            // 71
 * - N: String or BigInteger. Defaults to 1024 bit value from RFC 5054                                              // 72
 * - g: String or BigInteger. Defaults to 2.                                                                        // 73
 * - k: String or BigInteger. Defaults to hash(N, g)                                                                // 74
 */                                                                                                                 // 75
var paramsFromOptions = function (options) {                                                                        // 76
  if (!options) // fast path                                                                                        // 77
    return _defaults;                                                                                               // 78
                                                                                                                    // 79
  var ret = _.extend({}, _defaults);                                                                                // 80
                                                                                                                    // 81
  _.each(['N', 'g', 'k'], function (p) {                                                                            // 82
    if (options[p]) {                                                                                               // 83
      if (typeof options[p] === "string")                                                                           // 84
        ret[p] = new BigInteger(options[p], 16);                                                                    // 85
      else if (options[p] instanceof BigInteger)                                                                    // 86
        ret[p] = options[p];                                                                                        // 87
      else                                                                                                          // 88
        throw new Error("Invalid parameter: " + p);                                                                 // 89
    }                                                                                                               // 90
  });                                                                                                               // 91
                                                                                                                    // 92
  if (options.hash)                                                                                                 // 93
    ret.hash = function (x) { return options.hash(x).toLowerCase(); };                                              // 94
                                                                                                                    // 95
  if (!options.k && (options.N || options.g || options.hash)) {                                                     // 96
    ret.k = ret.hash(ret.N.toString(16) + ret.g.toString(16));                                                      // 97
  }                                                                                                                 // 98
                                                                                                                    // 99
  return ret;                                                                                                       // 100
};                                                                                                                  // 101
                                                                                                                    // 102
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package.srp = {
  SRP: SRP
};

})();
//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
//                                                                      //
// If you are using Chrome, open the Developer Tools and click the gear //
// icon in its lower right corner. In the General Settings panel, turn  //
// on 'Enable source maps'.                                             //
//                                                                      //
// If you are using Firefox 23, go to `about:config` and set the        //
// `devtools.debugger.source-maps-enabled` preference to true.          //
// (The preference should be on by default in Firefox 24; versions      //
// older than 23 do not support source maps.)                           //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Accounts = Package['accounts-base'].Accounts;
var SRP = Package.srp.SRP;
var SHA256 = Package.sha.SHA256;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var DDP = Package.ddp.DDP;

(function () {

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                            //
// packages/accounts-password/password_client.js                                                              //
//                                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                              //
// Attempt to log in with a password.                                                                         // 1
//                                                                                                            // 2
// @param selector {String|Object} One of the following:                                                      // 3
//   - {username: (username)}                                                                                 // 4
//   - {email: (email)}                                                                                       // 5
//   - a string which may be a username or email, depending on whether                                        // 6
//     it contains "@".                                                                                       // 7
// @param password {String}                                                                                   // 8
// @param callback {Function(error|undefined)}                                                                // 9
                                                                                                              // 10
/**                                                                                                           // 11
 * @summary Log the user in with a password.                                                                  // 12
 * @locus Client                                                                                              // 13
 * @param {Object | String} user Either a string interpreted as a username or an email; or an object with a single key: `email`, `username` or `id`.
 * @param {String} password The user's password.                                                              // 15
 * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */                                                                                                           // 17
Meteor.loginWithPassword = function (selector, password, callback) {                                          // 18
  if (typeof selector === 'string')                                                                           // 19
    if (selector.indexOf('@') === -1)                                                                         // 20
      selector = {username: selector};                                                                        // 21
    else                                                                                                      // 22
      selector = {email: selector};                                                                           // 23
                                                                                                              // 24
  Accounts.callLoginMethod({                                                                                  // 25
    methodArguments: [{                                                                                       // 26
      user: selector,                                                                                         // 27
      password: Accounts._hashPassword(password)                                                              // 28
    }],                                                                                                       // 29
    userCallback: function (error, result) {                                                                  // 30
      if (error && error.error === 400 &&                                                                     // 31
          error.reason === 'old password format') {                                                           // 32
        // The "reason" string should match the error thrown in the                                           // 33
        // password login handler in password_server.js.                                                      // 34
                                                                                                              // 35
        // XXX COMPAT WITH 0.8.1.3                                                                            // 36
        // If this user's last login was with a previous version of                                           // 37
        // Meteor that used SRP, then the server throws this error to                                         // 38
        // indicate that we should try again. The error includes the                                          // 39
        // user's SRP identity. We provide a value derived from the                                           // 40
        // identity and the password to prove to the server that we know                                      // 41
        // the password without requiring a full SRP flow, as well as                                         // 42
        // SHA256(password), which the server bcrypts and stores in                                           // 43
        // place of the old SRP information for this user.                                                    // 44
        srpUpgradePath({                                                                                      // 45
          upgradeError: error,                                                                                // 46
          userSelector: selector,                                                                             // 47
          plaintextPassword: password                                                                         // 48
        }, callback);                                                                                         // 49
      }                                                                                                       // 50
      else if (error) {                                                                                       // 51
        callback && callback(error);                                                                          // 52
      } else {                                                                                                // 53
        callback && callback();                                                                               // 54
      }                                                                                                       // 55
    }                                                                                                         // 56
  });                                                                                                         // 57
};                                                                                                            // 58
                                                                                                              // 59
Accounts._hashPassword = function (password) {                                                                // 60
  return {                                                                                                    // 61
    digest: SHA256(password),                                                                                 // 62
    algorithm: "sha-256"                                                                                      // 63
  };                                                                                                          // 64
};                                                                                                            // 65
                                                                                                              // 66
// XXX COMPAT WITH 0.8.1.3                                                                                    // 67
// The server requested an upgrade from the old SRP password format,                                          // 68
// so supply the needed SRP identity to login. Options:                                                       // 69
//   - upgradeError: the error object that the server returned to tell                                        // 70
//     us to upgrade from SRP to bcrypt.                                                                      // 71
//   - userSelector: selector to retrieve the user object                                                     // 72
//   - plaintextPassword: the password as a string                                                            // 73
var srpUpgradePath = function (options, callback) {                                                           // 74
  var details;                                                                                                // 75
  try {                                                                                                       // 76
    details = EJSON.parse(options.upgradeError.details);                                                      // 77
  } catch (e) {}                                                                                              // 78
  if (!(details && details.format === 'srp')) {                                                               // 79
    callback && callback(                                                                                     // 80
      new Meteor.Error(400, "Password is old. Please reset your " +                                           // 81
                       "password."));                                                                         // 82
  } else {                                                                                                    // 83
    Accounts.callLoginMethod({                                                                                // 84
      methodArguments: [{                                                                                     // 85
        user: options.userSelector,                                                                           // 86
        srp: SHA256(details.identity + ":" + options.plaintextPassword),                                      // 87
        password: Accounts._hashPassword(options.plaintextPassword)                                           // 88
      }],                                                                                                     // 89
      userCallback: callback                                                                                  // 90
    });                                                                                                       // 91
  }                                                                                                           // 92
};                                                                                                            // 93
                                                                                                              // 94
                                                                                                              // 95
// Attempt to log in as a new user.                                                                           // 96
                                                                                                              // 97
/**                                                                                                           // 98
 * @summary Create a new user.                                                                                // 99
 * @locus Anywhere                                                                                            // 100
 * @param {Object} options                                                                                    // 101
 * @param {String} options.username A unique name for this user.                                              // 102
 * @param {String} options.email The user's email address.                                                    // 103
 * @param {String} options.password The user's password. This is __not__ sent in plain text over the wire.    // 104
 * @param {Object} options.profile The user's profile, typically including the `name` field.                  // 105
 * @param {Function} [callback] Client only, optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */                                                                                                           // 107
Accounts.createUser = function (options, callback) {                                                          // 108
  options = _.clone(options); // we'll be modifying options                                                   // 109
                                                                                                              // 110
  if (typeof options.password !== 'string')                                                                   // 111
    throw new Error("Must set options.password");                                                             // 112
  if (!options.password) {                                                                                    // 113
    callback(new Meteor.Error(400, "Password may not be empty"));                                             // 114
    return;                                                                                                   // 115
  }                                                                                                           // 116
                                                                                                              // 117
  // Replace password with the hashed password.                                                               // 118
  options.password = Accounts._hashPassword(options.password);                                                // 119
                                                                                                              // 120
  Accounts.callLoginMethod({                                                                                  // 121
    methodName: 'createUser',                                                                                 // 122
    methodArguments: [options],                                                                               // 123
    userCallback: callback                                                                                    // 124
  });                                                                                                         // 125
};                                                                                                            // 126
                                                                                                              // 127
                                                                                                              // 128
                                                                                                              // 129
// Change password. Must be logged in.                                                                        // 130
//                                                                                                            // 131
// @param oldPassword {String|null} By default servers no longer allow                                        // 132
//   changing password without the old password, but they could so we                                         // 133
//   support passing no password to the server and letting it decide.                                         // 134
// @param newPassword {String}                                                                                // 135
// @param callback {Function(error|undefined)}                                                                // 136
                                                                                                              // 137
/**                                                                                                           // 138
 * @summary Change the current user's password. Must be logged in.                                            // 139
 * @locus Client                                                                                              // 140
 * @param {String} oldPassword The user's current password. This is __not__ sent in plain text over the wire. // 141
 * @param {String} newPassword A new password for the user. This is __not__ sent in plain text over the wire. // 142
 * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */                                                                                                           // 144
Accounts.changePassword = function (oldPassword, newPassword, callback) {                                     // 145
  if (!Meteor.user()) {                                                                                       // 146
    callback && callback(new Error("Must be logged in to change password."));                                 // 147
    return;                                                                                                   // 148
  }                                                                                                           // 149
                                                                                                              // 150
  check(newPassword, String);                                                                                 // 151
  if (!newPassword) {                                                                                         // 152
    callback(new Meteor.Error(400, "Password may not be empty"));                                             // 153
    return;                                                                                                   // 154
  }                                                                                                           // 155
                                                                                                              // 156
  Accounts.connection.apply(                                                                                  // 157
    'changePassword',                                                                                         // 158
    [oldPassword ? Accounts._hashPassword(oldPassword) : null,                                                // 159
     Accounts._hashPassword(newPassword)],                                                                    // 160
    function (error, result) {                                                                                // 161
      if (error || !result) {                                                                                 // 162
        if (error && error.error === 400 &&                                                                   // 163
            error.reason === 'old password format') {                                                         // 164
          // XXX COMPAT WITH 0.8.1.3                                                                          // 165
          // The server is telling us to upgrade from SRP to bcrypt, as                                       // 166
          // in Meteor.loginWithPassword.                                                                     // 167
          srpUpgradePath({                                                                                    // 168
            upgradeError: error,                                                                              // 169
            userSelector: { id: Meteor.userId() },                                                            // 170
            plaintextPassword: oldPassword                                                                    // 171
          }, function (err) {                                                                                 // 172
            if (err) {                                                                                        // 173
              callback && callback(err);                                                                      // 174
            } else {                                                                                          // 175
              // Now that we've successfully migrated from srp to                                             // 176
              // bcrypt, try changing the password again.                                                     // 177
              Accounts.changePassword(oldPassword, newPassword, callback);                                    // 178
            }                                                                                                 // 179
          });                                                                                                 // 180
        } else {                                                                                              // 181
          // A normal error, not an error telling us to upgrade to bcrypt                                     // 182
          callback && callback(                                                                               // 183
            error || new Error("No result from changePassword."));                                            // 184
        }                                                                                                     // 185
      } else {                                                                                                // 186
        callback && callback();                                                                               // 187
      }                                                                                                       // 188
    }                                                                                                         // 189
  );                                                                                                          // 190
};                                                                                                            // 191
                                                                                                              // 192
// Sends an email to a user with a link that can be used to reset                                             // 193
// their password                                                                                             // 194
//                                                                                                            // 195
// @param options {Object}                                                                                    // 196
//   - email: (email)                                                                                         // 197
// @param callback (optional) {Function(error|undefined)}                                                     // 198
                                                                                                              // 199
/**                                                                                                           // 200
 * @summary Request a forgot password email.                                                                  // 201
 * @locus Client                                                                                              // 202
 * @param {Object} options                                                                                    // 203
 * @param {String} options.email The email address to send a password reset link.                             // 204
 * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */                                                                                                           // 206
Accounts.forgotPassword = function(options, callback) {                                                       // 207
  if (!options.email)                                                                                         // 208
    throw new Error("Must pass options.email");                                                               // 209
  Accounts.connection.call("forgotPassword", options, callback);                                              // 210
};                                                                                                            // 211
                                                                                                              // 212
// Resets a password based on a token originally created by                                                   // 213
// Accounts.forgotPassword, and then logs in the matching user.                                               // 214
//                                                                                                            // 215
// @param token {String}                                                                                      // 216
// @param newPassword {String}                                                                                // 217
// @param callback (optional) {Function(error|undefined)}                                                     // 218
                                                                                                              // 219
/**                                                                                                           // 220
 * @summary Reset the password for a user using a token received in email. Logs the user in afterwards.       // 221
 * @locus Client                                                                                              // 222
 * @param {String} token The token retrieved from the reset password URL.                                     // 223
 * @param {String} newPassword A new password for the user. This is __not__ sent in plain text over the wire. // 224
 * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */                                                                                                           // 226
Accounts.resetPassword = function(token, newPassword, callback) {                                             // 227
  check(token, String);                                                                                       // 228
  check(newPassword, String);                                                                                 // 229
                                                                                                              // 230
  if (!newPassword) {                                                                                         // 231
    callback(new Meteor.Error(400, "Password may not be empty"));                                             // 232
    return;                                                                                                   // 233
  }                                                                                                           // 234
                                                                                                              // 235
  Accounts.callLoginMethod({                                                                                  // 236
    methodName: 'resetPassword',                                                                              // 237
    methodArguments: [token, Accounts._hashPassword(newPassword)],                                            // 238
    userCallback: callback});                                                                                 // 239
};                                                                                                            // 240
                                                                                                              // 241
// Verifies a user's email address based on a token originally                                                // 242
// created by Accounts.sendVerificationEmail                                                                  // 243
//                                                                                                            // 244
// @param token {String}                                                                                      // 245
// @param callback (optional) {Function(error|undefined)}                                                     // 246
                                                                                                              // 247
/**                                                                                                           // 248
 * @summary Marks the user's email address as verified. Logs the user in afterwards.                          // 249
 * @locus Client                                                                                              // 250
 * @param {String} token The token retrieved from the verification URL.                                       // 251
 * @param {Function} [callback] Optional callback. Called with no arguments on success, or with a single `Error` argument on failure.
 */                                                                                                           // 253
Accounts.verifyEmail = function(token, callback) {                                                            // 254
  if (!token)                                                                                                 // 255
    throw new Error("Need to pass token");                                                                    // 256
                                                                                                              // 257
  Accounts.callLoginMethod({                                                                                  // 258
    methodName: 'verifyEmail',                                                                                // 259
    methodArguments: [token],                                                                                 // 260
    userCallback: callback});                                                                                 // 261
};                                                                                                            // 262
                                                                                                              // 263
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-password'] = {};

})();
