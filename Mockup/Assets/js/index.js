import { minisearch } from "./_search.js";
import Cart from "./_cart.js";
import { products } from "./_data.js";
let cart = new Cart();

const searchEngine = minisearch(products);
//products
function createProductElement(product) {
  // Tạo một thẻ div có class là product
  let productDiv = document.createElement("div");
  productDiv.className = "product";

  // Tạo một thẻ div có class là product-image và chứa một thẻ img
  let productImageDiv = document.createElement("div");
  productImageDiv.className = "product-image";
  let productImage = document.createElement("img");
  productImage.src = "Assets/image/" + product.thumnal;
  productImage.alt = product.name;
  productImageDiv.appendChild(productImage);

  // Tạo một thẻ div có class là product-name và chứa tên sản phẩm
  let productNameDiv = document.createElement("div");
  productNameDiv.className = "product-name";
  productNameDiv.textContent = product.name;

  // Tạo một thẻ div có class là product-price và chứa giá sản phẩm
  let productPriceDiv = document.createElement("div");
  productPriceDiv.className = "product-price";
  let formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  productPriceDiv.textContent = `${formatter
    .format(product.price)
    .replace("₫", "")
    .trimEnd()} `;
  let currency = document.createElement("u");
  currency.textContent = "đ";
  productPriceDiv.appendChild(currency);

  // Tạo một thẻ div có class là btn-addtocart và chứa nút thêm vào giỏ hàng
  let btnAddtocartDiv = document.createElement("div");
  btnAddtocartDiv.className = "btn-addtocart";
  btnAddtocartDiv.textContent = "Chọn Mua";
  btnAddtocartDiv.setAttribute("data-product-id", product.id);
  btnAddtocartDiv.addEventListener("click", function () {
    var productId = this.dataset.productId;
    cart.addProduct(productId, 1);
  });

  // Thêm các thẻ div con vào thẻ div cha
  productDiv.appendChild(productImageDiv);
  productDiv.appendChild(productNameDiv);
  productDiv.appendChild(productPriceDiv);
  productDiv.appendChild(btnAddtocartDiv);
  // Trả về phần tử HTML của sản phẩm
  return productDiv;
}
// Hàm để thêm các sản phẩm vào các catalog tương ứng
function appendProductsToCatalogs(products) {
  // Lấy ra tất cả các phần tử section có class là group-products

  // Duyệt qua mảng các sản phẩm
  for (let product of products) {
    // Lấy ra các catalog của sản phẩm và chuyển thành mảng
    let productCatalogs = product.catalogs.split(",");

    // Duyệt qua mảng các catalog
    for (let catalog of productCatalogs) {
      // Tạo một phần tử HTML cho sản phẩm
      let productElement = createProductElement(product);
      let catalogElement = document.getElementById(`${catalog}`);
      let catalogElementParent = catalogElement.parentElement;
      let section = catalogElementParent.nextElementSibling;

      section.prepend(productElement);
    }
  }
}
// Gọi hàm để thêm các sản phẩm vào các catalog tương ứng
function notiGroupProductsEmpty() {
  // select all the .group-products elements
  let groups = document.querySelectorAll(".group-products");
  // loop through each group
  for (var i = 0; i < groups.length; i++) {
    // check if it has any .product element inside
    var hasProduct = groups[i].querySelector(".product") !== null;
    // if not, add the .group-products-empty class
    if (!hasProduct) {
      groups[i].classList.add("group-products-empty");
    }

    var checkbox = groups[i].querySelector(".view-more > input[type='checkbox']");
    // add an event listener for the change event
    checkbox.addEventListener("change", function() {
      // check if the checkbox is checked
      if (this.checked) {
        // add the .show-more class to the group
        this.closest(".group-products").classList.add("show-more");
      } else {
        // remove the .show-more class from the group
        this.closest(".group-products").classList.remove("show-more");
      }
    });
  }
}

//
$(document).ready(function () {
  appendProductsToCatalogs(products);
  notiGroupProductsEmpty();

  console.log("loaded");
  // get all link tags
  let links = document.getElementsByTagName("a");
  let nav = document.getElementById("ham-toggle");
  let navAfter = document.querySelector("#nav-left");
  let productsHtml = document.querySelectorAll(".product");
  let header = $("header");
  let sticky = header.offset().top;
  let groupProducts = document.querySelectorAll(".group-products");

  nav.addEventListener("change", function () {
    //get all .drop-down elements
    var items = document.querySelectorAll(".drop-down .drop-down--items");

    for (var i = 0; i < items.length; i++) {
      items[i].style.display = "none";
    }
  });

  productsHtml.forEach(function (product) {
    // Lấy vị trí của .product so với cửa sổ xem
    var rect = product.getBoundingClientRect();
    // Lấy chiều cao của cửa sổ
    var height = window.innerHeight;
    // Nếu .product đi qua điểm cuối của trang mà không có class .scale-up-bl
    if (rect.top < height) {
      product.classList.add("scale-up-bl");
    }
  });
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > sticky) {
      header.addClass("sticky");
      //get header height
      var headerHeight = header.height();
      $("body").css("padding-top", headerHeight + "px");
    } else {
      header.removeClass("sticky");
      $("body").css("padding-top", "");
    }
    // Lặp qua tất cả các .product
    productsHtml.forEach(function (product) {
      // Lấy vị trí của .product so với cửa sổ xem
      var rect = product.getBoundingClientRect();
      // Lấy chiều cao của cửa sổ
      var height = window.innerHeight;
      // Nếu .product đi qua điểm cuối của trang mà không có class .scale-up-bl
      if (rect.top <= height && !product.classList.contains("scale-up-bl")) {
        // Thêm class .scale-up-bl cho .product
        product.classList.add("scale-up-bl");
      } else if (
        rect.top > height &&
        product.classList.contains("scale-up-bl")
      ) {
        // Nếu điểm đầu của sản phẩm đã đi qua điểm cuối của trang mà có chứa class .scale-up-bl
        // Xóa class .scale-up-bl cho .product
        product.classList.remove("scale-up-bl");
      }
    });
  });

  // loop through each link
  for (let link of links) {
    // add onclick event listener
    link.addEventListener("click", function (event) {
      console.log("click");
      // get the uri from the href attribute
      let uri = link.getAttribute("href");
      // check if uri is a hashtag
      if (uri.startsWith("#")) {
        // prevent the default behavior of jumping to the element
        event.preventDefault();
        if (uri.length > 1) {
          if (
            link.nextElementSibling != null &&
            link.nextElementSibling.classList.contains("drop-down--items") &&
            link.nextElementSibling.style.display == "flex"
          ) {
            // get the element with the id matching the hashtag
            let target = document.getElementById(uri.slice(1));
            // get the header element height
            let headerHeight = document.querySelector("header").offsetHeight;
            // scroll to the target element smoothly with padding top by header height
            window.scrollTo({
              top: target.offsetTop - headerHeight - 15,
              behavior: "smooth",
            });

            if (nav.checked) {
              console.log("close 1");
              nav.checked = false;
            }
            var items = document.querySelectorAll(
              ".drop-down .drop-down--items"
            );

            for (var i = 0; i < items.length; i++) {
              items[i].style.display = "none";
            }
          } else {
            ///debug
            console.log(link);
            console.log(link.nextElementSibling != null);
            if (link.nextElementSibling != null) {
              console.log(
                link.nextElementSibling.classList.contains("drop-down--items")
              );
              console.log(link.nextElementSibling.style.display == "flex");

              console.log(link.nextElementSibling);
              console.log(link.nextElementSibling.classList);
              console.log(link.nextElementSibling.style.display);
            }
            ///end debug

            //next element is null doing scroll
            if (link.nextElementSibling != null) {
              if (
                link.nextElementSibling.classList.contains("drop-down--items")
              ) {
                if (link.nextElementSibling.style.display == "flex") {
                  //close all drop down
                  // var items = document.querySelectorAll(
                  //   ".drop-down .drop-down--items"
                  // );
                  // items.forEach(function (item) {
                  //   item.style.display = "none";
                  // });
                  //go
                } else if (link.nextElementSibling.style.display == "none") {
                  //close all drop down
                  link.nextElementSibling.style.display = "flex";
                  return;
                }
              } else {
                // //close all drop down
                // var items = document.querySelectorAll(
                //   ".drop-down .drop-down--items"
                // );
                // items.forEach(function (item) {
                //   item.style.display = "none";
                // });
                //go
              }
            }
            //go to
            let target = document.getElementById(uri.slice(1));
            // get the header element height
            let headerHeight = document.querySelector("header").offsetHeight;
            // scroll to the target element smoothly with padding top by header height
            window.scrollTo({
              top: target.offsetTop - headerHeight - 15,
              behavior: "smooth",
            });

            if (nav.checked) {
              console.log("close 2");

              nav.checked = false;
            }

            var items = document.querySelectorAll(
              ".drop-down .drop-down--items"
            );

            for (var i = 0; i < items.length; i++) {
              items[i].style.display = "none";
            }
          }
        }
      }
    });
  }

  // add a click event listener to the nav element
  navAfter.addEventListener("click", function (e) {
    // get the position and size of the nav element
    var rect = navAfter.getBoundingClientRect();

    // get the position and size of the hamburger hamburger-toggle element. (id is hamburger-toggle) 描述: hamburger hamburger
    // calculate the position and size of the pseudo-element
    var pseudoX = rect.right - 10; // assuming 10px width
    var pseudoY = rect.top - 2; // assuming -2px top position
    var pseudoWidth = 10; // assuming 10px width
    var pseudoHeight = rect.height + 4; // assuming -2px top and bottom positions

    // check if the click event was inside the pseudo-element
    if (e.clientX >= pseudoX && nav.checked) {
      // toggle the checked property of the ham element
      nav.checked = !nav.checked;
    }
  });
});
