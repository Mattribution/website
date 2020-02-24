import { observable } from "mobx";

class Kpi {
  @observable id = "";
  @observable name = false;
  @observable target = 0;
  @observable column = "";
  @observable value = "";
}

class 