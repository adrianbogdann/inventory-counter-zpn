const moment = require("moment");
const parser = require("cron-parser");
const { dbGetSubProductByBarcode } = require("../repository/barcodeRepository");
moment.tz.setDefault("Europe/Athens");

function checkIfTimeToStartCountExecution(schedule) {
  const date = new Date().toLocaleString("en-GB", {
    timeZone: "Europe/Athens",
    dateStyle: "short",
    timeStyle: "medium",
  });

  const newDate = new Date();
  // set the current time back to 1 minute
  // if I didn't do this and tried to trigger a plan that had a schedule set at '18:10' at 18:10
  // interval.next() would give me the next timeframe since `npm-parser` package considers that the date had already passed
  newDate.setMinutes(newDate.getMinutes() - 1);

  const options = {
    currentDate: newDate,
    iterator: true,
    utc: false,
    tz: "Europe/Athens",
  };

  try {
    const interval = parser.parseExpression(schedule, options);
    const nextDate = interval.next();
    console.log("Next schedule date is ", nextDate.value.toString());

    return (
      nextDate.value.getDate() === moment().date() &&
      nextDate.value.getHours() === moment().hours() &&
      nextDate.value.getMinutes() === moment().minutes()
    );
  } catch (err) {
    console.log(err);
    throw new Error(
      `Could not parse schedule. Reason: ${err.message} Skipping...`
    );
  }
}

function generateCronString(schedule) {
  if (schedule === "weekly") {
    const cronSeconds = 0;
    const cronDayNumber = moment().day();
    const cronHour = moment().hour();
    const cronMinutes = moment().add(5, "minutes").minutes();

    return `${cronSeconds} ${cronMinutes} ${cronHour} * * ${cronDayNumber}`;
  }

  // Monthly, At 15:00 on the second Monday of the month
  // http://www.quartz-scheduler.org/documentation/quartz-2.2.2/tutorials/crontrigger.html#special-characters
  return "0 15 ? * MON#2";
}

function isObjEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function groupProductsByCategory(products) {
  const groupedProducts = {};
  products.forEach((product) => {
    const category = product["category"];
    if (!groupedProducts[category]) {
      groupedProducts[category] = [];
    }
    groupedProducts[category].push(product);
  });

  return groupedProducts;
}

function groupSubProductCounts(subProductCounts) {
  const groupedSubProductCounts = {};
  let totalQty = 0;

  subProductCounts.map((subProductCount) => {
    const subproductName = subProductCount["linkedSubProduct.name"];
    const productId = subProductCount["linkedSubProduct.productId"];
    totalQty += subProductCount.qty;

    // calculate the total qty of a subproduct
    const qty = subProductCounts
      .filter((spc) => spc.subProductId === subProductCount.subProductId)
      .reduce((acc, val) => acc + val.qty, 0);

    if (!groupedSubProductCounts[subproductName])
      groupedSubProductCounts[subproductName] = {
        name: subproductName,
        qty,
        productId,
      };
  });
  groupedSubProductCounts["totalSubProducts"] = totalQty;

  return groupedSubProductCounts;
}

function extractProductPrices(groupedProducts, groupedSubProductCounts) {
  let productData = [];
  let categoryData = [];
  let totalPrice = 0;

  try {
    // foreach category in groupedProducts, loop through its array, calculate the price of each product
    for (let [category, products] of Object.entries(groupedProducts)) {
      let categoryPrice = 0;
      products.forEach((product) => {
        let availableQtys = [];
        let composed = JSON.parse(JSON.parse(product.composedOf));

        // go through each subproduct and calculate the qty available for this count execution
        for (let [subproduct, necessaryQty] of Object.entries(composed)) {
          let availableQty;
          if (!groupedSubProductCounts[subproduct]) {
            availableQty = 0;
          } else {
            availableQty = Math.floor(
              parseInt(groupedSubProductCounts[subproduct]["qty"]) /
                parseInt(necessaryQty)
            );
          }

          availableQtys.push({
            subProduct: subproduct,
            availableQty: availableQty,
          });
        }

        // get the minimum of the subproducts' availableQtys to determine how many products we have
        let productAvailableQty;
        if (availableQtys.length === 1) {
          productAvailableQty = availableQtys[0].availableQty;
        } else {
          productAvailableQty = availableQtys.reduce((acc, val) =>
            val.availableQty < acc.availableQty
              ? val.availableQty
              : acc.availableQty
          );
        }

        // calculate product price + category price based on available qtys
        let productPrice = parseFloat(product.price) * productAvailableQty;
        categoryPrice += productPrice;

        productData.push({ ...product, countExecutionPrice: productPrice });
      });

      // add the prices for each category
      categoryData.push({ category, categoryPrice });
    }

    // calculate total price
    totalPrice = categoryData.reduce(
      (acc, val) => acc.categoryPrice + val.categoryPrice
    );

    // return an object containing all the info ( points 7,8,9 from the PDF)
    return {
      productData: { ...productData },
      categoryData: { ...categoryData },
      totalPrice,
    };
  } catch (err) {
    console.log(err);
  }
}

async function transformSubproductDTO(composedOf, flag = "name") {
  let transformedSubproductsObj = {};

  for (let [barcode, qty] of Object.entries(composedOf)) {
    const subproduct = await dbGetSubProductByBarcode(barcode);
    if (!subproduct) throw new Error("Subproduct not found. Skipping");

    const subproductName = subproduct["subProductOwner"]["name"];
    const subproductId = subproduct["subProductOwner"]["id"];

    if (flag === "name") {
      transformedSubproductsObj[subproductName] = qty;
    } else {
      transformedSubproductsObj[subproductId] = qty;
    }
  }

  return transformedSubproductsObj;
}

module.exports = {
  checkIfTimeToStartCountExecution,
  isObjEmpty,
  groupProductsByCategory,
  groupSubProductCounts,
  extractProductPrices,
  generateCronString,
  transformSubproductDTO,
};
