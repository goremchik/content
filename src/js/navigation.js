// /**
//  * Created by Goremchik on 2016-12-06.
//  */
//
// function Main() {
//     this.isMobile = window.innerWidth <= this.smallDisplay ? true : false;
//
//     this.getMobile =function () {
//         var boolAns = window.innerWidth > this.smallDisplay && this.isMobile || window.innerWidth <= this.smallDisplay && !this.isMobile;
//         this.isMobile = window.innerWidth <= this.smallDisplay ? true : false;
//         return boolAns;
//     };
//
//     this.checkMobile = function() {
//         this.isMobile = window.innerWidth <= this.smallDisplay ? true : false;
//     };
// };
//
// function Navigation(menuName, navigationName, mobileName) {
//     this.elements = [];
//     this.activeMenu = {};
//     this.smallDisplay = 899;
//     this.mediumDisplay = 1040;
//     this.clickMobileMenu = false;
//     Main.call(this);
//
//     this.head = document.getElementById("header");
//     this.navMenu = document.getElementById(navigationName);
//     this.navMenuMobile = document.getElementById(mobileName);
//
//     var menu = document.getElementById(menuName).getElementsByTagName("li");
//
//     function getSubmenu(submenuId) {
//         var submenu = document.getElementById(submenuId);
//         if (!submenu) {
//             return [];
//         }
//
//         submenu = submenu.getElementsByTagName("li");
//
//         var arr = [];
//         for (var i = 0; i < submenu.length; i++) {
//             submenu[i].style.display = "none";
//             var obj = {
//                 text: submenu[i].innerText,
//                 url: submenu[i].getAttribute("url") ? submenu[i].getAttribute("url") : "#",
//                 submenu: getSubmenu(submenuId + "-submenu-" + (i + 1))
//             };
//
//             arr.push(obj);
//         }
//         return arr;
//     }
//
//     for (var i = 0; i < menu.length; i++) {
//         menu[i].style.display = "none";
//         var obj = {
//             text: menu[i].innerText,
//             url: menu[i].getAttribute("url") ? menu[i].getAttribute("url") : "#",
//             submenu: getSubmenu("for-" + menu[i].id)
//         };
//
//         this.elements.push(obj);
//     }
//
//     this.createMenu = function () {
//         if (!this.elements.length) {
//             return;
//         }
//         var html = '';
//         this.navMenu.style.display = "block";
//
//         this.checkMobile();
//
//         for (var i = 0; i < this.elements.length; i++) {
//             html += '<div class="menu-element"><a href="' + (this.elements[i].url === '#' ? 'javascript:void(0)' : this.elements[i].url) + '" class="menu-url' + (this.elements[i].url !== '#' ? ' active-url-after' : '') + '" '
//             html += 'onmouseout="menu.unhover(this)" onmouseover="menu.hover(' + "this,'menu-url',1" + ')" onclick="menu.getSubmenu(this, ' + i + ')">' + this.elements[i].text + '</a>';
//             html += this.getHtmlSubMenu(this.elements[i].submenu, i);
//
//
//             html += '</div>';
//         }
//
//         if (!this.isMobile) {
//             this.navMenu.innerHTML = html;
//             this.navMenuMobile.innerHTML = "";
//         } else {
//             this.navMenuMobile.innerHTML = html;
//             this.navMenu.innerHTML = "";
//         }
//     };
//
//     this.getHtmlSub2Menu = function (element, iterSub2, iterSub) {
//
//         var sub2Html = '<div class="submenu-dropdown" id="sub-drop-' + iterSub + '-' + iterSub2 + '">';
//         for (var i = 0; i < element.length; i++) {
//             sub2Html += '<div class="sub2menu-element"><a href="' + (element[i].url === '#' ? 'javascript:void(0)' : element[i].url) + '" ';
//             sub2Html += 'class="sub2menu-url' + (element[i].url !== '#' ? ' active-url' : '') + '" ';
//             sub2Html += (this.isMobile ? 'onmouseover="menu.hover(this,' + "'sub2menu-url'" + ',3)" onmouseout="menu.unhover(this)"' : '') + '>';
//             sub2Html += '<div class="dop-el' + (element[i].url !== '#' ? ' active-url-after' : '') + '">' + element[i].text + '</div></a>';
//             sub2Html += '</div>';
//         }
//         sub2Html += '</div>';
// //                console.log(sub2Html);
//         return sub2Html;
//     };
//
//     this.getSubmenu = function (element, number) {
// //    console.log(element);
//         if (this.activeMenu != element) {
//             var allElements = document.getElementsByClassName('menu-element');
//             this.activeMenu = element;
//             for (var i = 0; i < allElements.length; i++) {
//                 allElements[i].getElementsByTagName('a')[0].style.background = this.isMobile ? this.background[1] : this.background[0];
//             }
//             element.style.background = this.isMobile ? this.background[1] : this.background[1];
//
//             var menuEl = document.getElementsByClassName('menu-dropdown');
//             for (var i = 0; i < menuEl.length; i++) {
//                 menuEl[i].style.display = 'none';
//             }
//
//
//             document.getElementById('menu-drop-' + number).style.display = 'block';
//
//         } else {
// //        console.log('dd');
//             this.activeMenu = null;
//             document.getElementById('menu-drop-' + number).style.display = 'none';
//
//         }
//     };
//
//     this.getSub2menu = function (element, menuNumber, number) {
//         var dropdown = document.getElementById('sub-drop-' + menuNumber + '-' + number);
//
//         if (dropdown.style.display !== 'block') {
//             var allElements = document.getElementsByClassName('submenu-element');
//
//             for (var i = 0; i < allElements.length; i++) {
//                 allElements[i].getElementsByTagName('a')[0].style.background = this.isMobile ? this.background[2] : this.background[1];
//             }
//             element.style.background = this.isMobile ? this.background[3] : this.background[2];
//
//             var menuEl = document.getElementsByClassName('submenu-dropdown');
//             for (var i = 0; i < menuEl.length; i++) {
//                 menuEl[i].style.display = 'none';
//             }
//
//             dropdown.style.display = 'block';
//
//             if (!this.isMobile) {
//                 var dropdownParent = dropdown.parentNode.parentNode;
//                 dropdownParent.style.width = '241px';
//                 if (!dropdown.height) {
//                     dropdown.height = dropdown.offsetHeight;
//                 }
//
//                 if (!dropdownParent.height) {
//                     dropdownParent.height = dropdownParent.offsetHeight;
//                 }
//
//                 if (!dropdown.offsetHeight) {
//                     dropdownParent.style.height = dropdownParent.height + 'px';
//                     return;
//                 }
//
//                 if (dropdown.height >= dropdownParent.height) {
//                     dropdownParent.style.height = dropdown.height + 'px';
//                     dropdown.style.height = dropdown.height + 'px';
//                 } else {
//                     dropdownParent.style.height = dropdownParent.height + 'px';
//                     dropdown.style.height = dropdownParent.height + 'px';
//                 }
//                 dropdownParent.style.width = '540px';
//             }
//         } else {
//             dropdown.style.display = 'none';
//         }
//     };
//
//     this.getMobileMenu = function (element) {
//
//         this.clickMobileMenu = !this.clickMobileMenu;
//         if (this.clickMobileMenu) {
//             element.style.backgroundColor = this.background[1];
//             var height = window.innerHeight - 48;
//             this.navMenuMobile.style.display = 'block';
//             this.navMenuMobile.style.height = height + 'px';
//             document.body.style.overflow = 'hidden';
//         } else {
//             this.navMenuMobile.style.display = 'none';
//             document.body.style.overflow = 'auto';
//         }
//     };
//
//     this.checkMenuHeight = function () {
//         if (!this.isMobile) {
//             document.body.style.overflow = 'auto';
//             this.navMenuMobile.style.display = 'none';
//             this.navMenuMobile.style.background = this.background[0];
//             this.clickMobileMenu = false;
//         }
//         this.navMenuMobile.style.height = window.innerHeight - 48 + 'px';
//     }
//
// }
//
//
// var menu = new Navigation("menu", "navigation", "mobile-menu-block");
// menu.createMenu();