const NAV_ITEMS = require('../../json/nav-items.json');
import DATA_STRUCTURE from '../data-structure.js';
const NavItemsBLL = {
  findByIndex(index){
    return DATA_STRUCTURE.Tree.find(NAV_ITEMS, item => item.index === index);
  }
};

export default NavItemsBLL;
