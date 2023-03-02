const CUSTOMERS_SUCCESS_WITH_SAME_AMOUT_OF_CUSTOMERS = 0;

/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param {array} customerSuccess
 * @param {array} customers
 * @param {array} customerSuccessAway
 */

function customerSuccessBalancing(
  customerSuccess,
  customers,
  customerSuccessAway
) {
  const customersSuccessAvailables = getAvaliablesCustomersSuccess(
    customerSuccess,
    customerSuccessAway
  );
  const customersSuccessAvailablesSortedByScore = sortCustomersSuccessByScore(
    customersSuccessAvailables
  );

  const customersGroupedByScore = groupCustomersByScore(customers);

  const customersSuccessWithCustomers =
    addCustomersToQualifiedsCustomersSuccess(
      customersSuccessAvailablesSortedByScore,
      customersGroupedByScore
    );

  const customersSuccessSortedByHowManyCustomersCanServe =
    sortCustomersSuccessByWichCustomersCanServe(customersSuccessWithCustomers);

  if (
    customersSuccessSortedByHowManyCustomersCanServe[0].customers.length !==
    customersSuccessSortedByHowManyCustomersCanServe[1].customers.length
  ) {
    return customersSuccessSortedByHowManyCustomersCanServe[0].id;
  }

  return CUSTOMERS_SUCCESS_WITH_SAME_AMOUT_OF_CUSTOMERS;
}

function getAvaliablesCustomersSuccess(customerSuccess, customerSuccessAway) {
  return customerSuccess.filter((cs) => !customerSuccessAway.includes(cs.id));
}

function sortCustomersSuccessByScore(customersSuccess) {
  return customersSuccess.sort((cs1, cs2) => cs1.score - cs2.score);
}

function sortCustomersSuccessByWichCustomersCanServe(customersSuccess) {
  return customersSuccess.sort(
    (cs1, cs2) => cs2.customers.length - cs1.customers.length
  );
}

function groupCustomersByScore(customers) {
  return customers.reduce((customersGroupedByScore, customer) => {
    const groupOfCustomers = customersGroupedByScore[customer.score];

    const newGroupOfCustomers = groupOfCustomers ?? [customer];

    customersGroupedByScore[customer.score] = newGroupOfCustomers;

    return customersGroupedByScore;
  }, {});
}

function addCustomersToQualifiedsCustomersSuccess(
  customersSuccess,
  customersGroupedByScore
) {
  const customersGroupsScores = Object.keys(customersGroupedByScore);

  return customersSuccess.map((cs) => {
    const csScore = cs.score;

    const firstOverScore = customersGroupsScores.findIndex(
      (value) => Number(value) > csScore
    );

    const customersGroupsScoresKeys = customersGroupsScores.splice(
      0,
      firstOverScore < 0 ? customersGroupsScores.length : firstOverScore
    );

    cs.customers = customersGroupsScoresKeys
      .map((scoreKey) => customersGroupedByScore[scoreKey])
      .flat();
    return cs;
  });
}

test("Scenario 1", () => {
  const css = [
    { id: 1, score: 60 },
    { id: 2, score: 20 },
    { id: 3, score: 95 },
    { id: 4, score: 75 },
  ];
  const customers = [
    { id: 1, score: 90 },
    { id: 2, score: 20 },
    { id: 3, score: 70 },
    { id: 4, score: 40 },
    { id: 5, score: 60 },
    { id: 6, score: 10 },
  ];
  const csAway = [2, 4];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

function buildSizeEntities(size, score) {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

function arraySeq(count, startAt) {
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

test("Scenario 2", () => {
  const css = mapEntities([11, 21, 31, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 3", () => {
  const testTimeoutInMs = 100;
  const testStartTime = new Date().getTime();

  const css = mapEntities(arraySeq(999, 1));
  const customers = buildSizeEntities(10000, 998);
  const csAway = [999];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(998);

  if (new Date().getTime() - testStartTime > testTimeoutInMs) {
    throw new Error(`Test took longer than ${testTimeoutInMs}ms!`);
  }
});

test("Scenario 4", () => {
  const css = mapEntities([1, 2, 3, 4, 5, 6]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 5", () => {
  const css = mapEntities([100, 2, 3, 6, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(1);
});

test("Scenario 6", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [1, 3, 2];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(0);
});

test("Scenario 7", () => {
  const css = mapEntities([100, 99, 88, 3, 4, 5]);
  const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
  const csAway = [4, 5, 6];

  expect(customerSuccessBalancing(css, customers, csAway)).toEqual(3);
});
