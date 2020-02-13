import { BaseStore, getOrCreateStore } from "next-mobx-wrapper";
import { observable, action, flow } from "mobx";
import firebase from "firebase";
import { auth } from "./";

class Store extends BaseStore {
  @observable user = null;

  constructor(isServer) {
    this.unwatchAuth = auth.onAuthStateChanged(user => {
      this.user = user;
    });
  }

  cleanup() {
    if (this.unwatchAuth) {
      this.unwatchAuth();
    }
  }

  signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then(function(result) {
        // console.log(result);
      })
      .catch(function(error) {
        // const errorMessage = error.message;
      });
  };

  signOut = () => {
    auth.signOut().then(
      function() {
        // Sign-out successful.
      },
      function(error) {
        // An error happened.
      }
    );
  };
}

export const getAuthStore = getOrCreateStore("authStore", Store);
