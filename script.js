"use strict";


// let's set up a user class that does all of our functioning! First things first, let's
// set up our constructor with some information about our user. transactions will be an
// array where we are saving every transaction we make, budget will be the actual budget
// the user has set, and the filter will be used for all of our filtering on our categories.

class user {
  constructor() {
    this.transactions = [];
    this.budget = 0;
    this.filter = {
      Bills: true,
      Fashion: true,
      Fun: true,
      Food: true,
      Savings: true
    };
    
  }

  // this class method grabs the values of what is entered in our add transaction pop up.
  // the parseFloat() function makes sure that the item is converted to a number so that
  // we can do proper maths on it.
  addTransaction() {
    let transaction = {
      itemCategory: $("#item_category :selected").val(), //how to pull value from a dropdown
      itemName: $("#item_name").val(), 
      itemPrice: parseFloat($("#item_price").val())
    };

    
    // This functioning tests to see if any of the values are blank, and if so, return
    // so that we don't get any blank entries.
    if (transaction.itemCategory === "" || transaction.itemName === "" || isNaN(transaction.itemPrice)) {
      return;
    }

    // Zero out the values after we get all the values.
    $("#item_category").val('');
    $("#item_name").val('');
    $("#item_price").val('');

    // this.transactions.push(transaction) should be familiar... push our transaction info
    // to the array.
    this.transactions.push(transaction);

    // After pushing, run the displayBudget() and displayItems() functions to update the
    // budget and print the new items to the page
    this.displayBudget();
    this.displayItems();
  }

  // this will print our transactions to the page.
  displayItems() {
    
    // This one is hard to explain, and it took me some time to understand what is going on,
    // but basically we are executing several methods in a row to simultaneously print our new
    // transactions to the screen, and filter out those that have a category that is set to
    // false within the user's class filter object.
    let items = this.transactions
    
    // the filter() method works like a forEach() or map() method in that it takes an
    // anonymous function as its only parameter, iterates over an array of some sort, 
    // and returns a true or false value.
    .filter(transaction => this.filter[transaction.itemCategory])
    
    // similarly, the map method is also iterating through each element of the
    // this.transactions, and on those that were true from the filter() method, we
    // return the final html we are using and store all this information in the 'items'
    // variable from above we are initializing.
    .map(transaction => {
      return (`
      <div class="detailedView ${transaction.itemCategory.toLowerCase()}">
      <img class="icons" src="icons/${transaction.itemCategory}.png">
      <div id="">${transaction.itemName}</div>
      <div id="">$${transaction.itemPrice}</div>
      </div>
      `);
    });

    // Now let's take all those elements saved in items and use another nifty method called
    // .join(), which basically takes everything in an array and turns it into one long
    // string. By doing this, it makes sure we can properly display all of ourtransactions
    // to the screen. Let's target our div and create new html with our string. 
    $(".detailedViewWrapper").html(items.join(''));

  }

  // the setBudget method will save what a user enters for his weekly budget, hide the
  // modal popup, and then run the displayBudget() and the displayItems() method. Once
  // again, we are using the parseFloat function to make sure that we are working with
  // numbers and not another data type, say, a string, or an object.
  setBudget() {
    this.transactions = [];
    this.budget = parseFloat($("#weeklyBudget").val());
    $('#enterBudgetPopUp').modal('hide');
    $("#circleButtonId").removeClass("circleRedButton").addClass("circleButton");
    this.displayBudget();
    this.displayItems();
  }

  // getBudget() will update the user's budget with a fun little method called reduce(),
  // which iterates through each transaction in the array, and takes an accumulator (in 
  // in this case, its our array of transactions) and an initial value (in this case, it
  // is our transaction array) and reduces it to a single value. to understand what is
  // happening, here is a short hand example pulled from the MDN:
  // const array1 = [1, 2, 3, 4];
  // const reducer = (accumulator, currentValue) => accumulator + currentValue;
  
  // // 1 + 2 + 3 + 4
  // console.log(array1.reduce(reducer));
  // // expected output: 10
  // In our version, we are subtracting all the values within our transaction array from
  // our budget variable to get a final running total of how much is left in our budget.
  getBudget() {
    return this.transactions.reduce((value, transaction) => value - transaction.itemPrice, this.budget); 
  }



  // Our buildCategories() method dynamically builds the filter popup every time it is
  // opened. We don't necessarily need to do this, but if we ever add more categories,
  // we only need to add them in one place, and that is our user class constructor. 
  buildCategories() {

    // let's use an empty method to erase any html within our div!
    $("#filterPopUpSectionOptions").empty();
    
    // Object.keys() returns the names of the filter object in the user class, then runs a
    // forEach function to loop through each element and creates the html for that element 
    Object.keys(this.filter).forEach((category, index) => {
      
      // set up a variable called outerCheckBox and set it equal to a jquery command
      // that creates a new html element. the bootstrap styling for the checkbox
      // being created.
      let outerCheckBox = $('<div class="custom-control custom-checkbox mb-3"></div>');

      // set up a variable called innerCheckBox equal to the html we are going to append.
      // The innerCheckBox will create a checkbox input with an onclick element that
      // switches the true/false value of the category names that we grabbed with
      // Object.keys(). 
      let innerCheckbox = $('<input onclick="currentUser.toggleFilter(\'' + category + '\')" type="checkbox" class="custom-control-input" id="filter-checkbox-' + index + '">');
    
      // The if statement will set the attribute of each of the created elements to
      // "checked" if that element is true within the object. By default, all of the
      // categories set up within the constructor are true when it is created.
      if (this.filter[category]) {
        innerCheckbox.attr("checked", "checked");
      }

      //Here we are appending the innerCheckbox html within the outerCheckBox html: the
      //jQuery call with the "<div..." information in it is creating a new div element.
      outerCheckBox.append(innerCheckbox);

      // similarly, we are also appending a label for each checkbox we are creating, and
      // setting the values based on what is in the filter object within the constructor.
      outerCheckBox.append($('<label class="custom-control-label" for="filter-checkbox-' + index + '">' + category + '</label>'));
      
      // And finally, we append all of our information created above to the actual html
      // element within our document that has an id of #filterPopUpSectionOptions.
      $("#filterPopUpSectionOptions").append(outerCheckBox);
    });
  }

  // the toggleFilter() function is literally a shorthand version of an if statement, called
  // a ternary statement. This is saying, set the value of this.filter[category] to true
  // if it's false, or false if it's true. 
  toggleFilter(category) {
    this.filter[category]=this.filter[category] ? false : true;
    this.displayItems();
  }

  // here we are adding transactions to the transaction array of the class, and then use
  // a push method to add it to the end of the array.
  add(info) {
    // pushing transaction info to transaction array 
    let newTransaction = new transaction(info.itemCategory, info.itemName, info.itemPrice);
    this.transaction.push(newTransaction);
  }

  // the displayBudget() function writes the budget to the circleButton Div and is called
  // each time a new transaction is added to keep the budget updated.
  displayBudget() {
    // let remainingBudget = this.getBudget();
    checkPositiveBalance(this.getBudget());
    // console.log(this.getBudget());
    //targeted ID instead of class because I changed the background color by class when budget is 0 or less
    $("#circleButtonId").html(`Budget:<br>$${this.getBudget()}`);
  }
} //closes class user block 

// this is the jQuery preloader.
$(document).ready(() => {

  // Enable those Tooltips!
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

  // Create a global variable called currentUser (We use "window." to take it out of
  // the scope of the document.ready function).
  window.currentUser = new user();
  
  // pop up the budget window first thing on load! EDIT: Commented out so people can see
  // what the page is about.
  // showPopUp("enterBudgetPopUp");

  // run the buildCategories function.
  currentUser.buildCategories(); //


  function displayBreakdown() {
    // TODO: get all of the transactions and display the overview of each
    // item; this will separate each transaction by category and total the
    // amount spent on each of those items.
  }

  // Work on later
  function showToolTips() {
    // TODO: retrieve the tool tip data of an element and display it when
    // a user hovers over an element.
  }

});


// Just a small function to scroll the page to the top when they click on a modal popup
function showPopUp(popUpId) {
  $("#" + popUpId).modal("show");
  $("html, body").animate({ scrollTop: "0px" });
}

// FUNCTION TO CHECK POSITIVE BALANCE, CHANGE BACKGROUND COLOR AND SWAP POPUP TO ALERT USER OUT OF MONEY
function checkPositiveBalance(remainingBudget){
  if(remainingBudget <= 0){
    // console.log("You're out of money fool!");
    setToOutOfMoney();
    swapModals();
  }
}

function setToOutOfMoney(){
  $("#circleButtonId").removeClass("circleButton").addClass("circleRedButton");  
}

function swapModals(){ 
  $('#addTransactionPopUp').modal('hide');
  $('#outOfMoneyPopup').modal('show');
}


//WishList: 
//Delete an item 
