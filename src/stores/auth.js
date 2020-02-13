import { BaseStore, getOrCreateStore } from "next-mobx-wrapper";
import { observable, action, flow } from "mobx";

const mockUser = {
  name: "Zac Holland"
};

class Store extends BaseStore {
  @observable user = null;

  // signin = flow(function*(username, password) {
  //   // TODO: Do check to make sure user isnt already signed in
  //   // TODO: sign in with firebase
  //   this.user = mockUser;
  // });

  signin = () => {
    this.user = mockUser;
  };

  getUser = () => {
    return this.user;
  };
}

// Make sure the store’s unique name
// AND must be same formula
// Example: getUserStore => userStore
// Example: getProductStore => productStore
export const getAuthStore = getOrCreateStore("authStore", Store);
