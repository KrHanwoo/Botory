import { Money } from "../utils/money";
import { Xp } from "../utils/xp";

let map = new Map<string, number>();

export class Chat{

  static async chat(id: string){
    if(!check(id))return;
    Money.addMoney(id, 50);
    Xp.addXp(id, 20);
  }

  
}

function check(id: string){
  let last = map.get(id) ?? 0;
  if(Date.now() >= last + 1000 * 60 ){
    map.set(id, Date.now());
    return true;
  }
  return false;
}