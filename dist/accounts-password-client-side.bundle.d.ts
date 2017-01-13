declare namespace Meteor {
  function loginWithPassword(selector: Object | String, password: String, callback?: Function): void;
}

declare module 'meteor/meteor' {
  namespace Meteor {
    function loginWithPassword(selector: Object | String, password: String, callback?: Function): void;
  }
}

declare namespace Accounts {
  function _hashPassword(password: String): Object;
  function createUser(options: Object, callback?: Function): void;
  function changePassword(oldPassword: string, newPassword: string, callback?: Function): void;
  function forgotPassword(options: Object, callback?: Function): void;
  function resetPassword(token: string, newPassword: string, callback?: Function): void;
  function verifyEmail(token: string, callback?: Function): void;
}

declare module 'meteor/accounts-base' {
  namespace Accounts {
    function _hashPassword(password: String): Object;
    function createUser(options: Object, callback?: Function): void;
    function changePassword(oldPassword: string, newPassword: string, callback?: Function): void;
    function forgotPassword(options: Object, callback?: Function): void;
    function resetPassword(token: string, newPassword: string, callback?: Function): void;
    function verifyEmail(token: string, callback?: Function): void;
  }
}
