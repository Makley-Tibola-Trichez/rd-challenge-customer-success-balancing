interface Person {
  id: number;
  score: number;
  customers?: Person[];
}

export function customerSuccessBalancing(
  customerSuccess: Person[],
  customers: Person[],
  customerSuccessAway: number[]
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
    customersSuccessSortedByHowManyCustomersCanServe[0]?.customers?.length !==
    customersSuccessSortedByHowManyCustomersCanServe[1]?.customers?.length
  ) {
    return customersSuccessSortedByHowManyCustomersCanServe[0].id;
  }

  return 0;
}

function getAvaliablesCustomersSuccess(
  customerSuccess: Person[],
  customerSuccessAway: number[]
) {
  return customerSuccess.filter((cs) => !customerSuccessAway.includes(cs.id));
}

function sortCustomersSuccessByScore(customersSuccess: Person[]) {
  return customersSuccess.sort((cs1, cs2) => cs1.score - cs2.score);
}

function sortCustomersSuccessByWichCustomersCanServe(
  customersSuccess: Person[]
) {
  return customersSuccess.sort(
    (cs1, cs2) => cs2.customers!.length - cs1.customers!.length
  );
}

function groupCustomersByScore(customers: Person[]) {
  return customers.reduce((customersGroupedByScore, customer) => {
    const groupOfCustomers = customersGroupedByScore[customer.score];

    const newGroupOfCustomers = groupOfCustomers ?? [customer];

    customersGroupedByScore[customer.score] = newGroupOfCustomers;

    return customersGroupedByScore;
  }, {});
}
function addCustomersToQualifiedsCustomersSuccess(
  customersSuccess: Person[],
  customersGroupedByScore: Record<string, Person[]>
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

export function buildSizeEntities(size, score) {
  const result: any = [];
  for (let i = 0; i < size; i += 1) {
    result.push({ id: i + 1, score });
  }
  return result;
}

export function mapEntities(arr) {
  return arr.map((item, index) => ({
    id: index + 1,
    score: item,
  }));
}

export function arraySeq(count, startAt) {
  return Array.apply(0, Array(count)).map((it, index) => index + startAt);
}

// test1();
// test2();
// test3();
// test4();
// test5();
// test6();
// test7();

// function test1() {
//   console.groupCollapsed("test1");
//   const css = [
//     { id: 1, score: 60 },
//     { id: 2, score: 20 },
//     { id: 3, score: 95 },
//     { id: 4, score: 75 },
//   ];
//   const customers = [
//     { id: 1, score: 90 },
//     { id: 2, score: 20 },
//     { id: 3, score: 70 },
//     { id: 4, score: 40 },
//     { id: 5, score: 60 },
//     { id: 6, score: 10 },
//   ];
//   const csAway = [2, 4];

//   let _result = customerSuccessBalancing(css, customers, csAway);

//   console.log(`
//     expected: 1
//     received: ${_result}
//   `);

//   console.groupEnd();
// }

// function test2() {
//   console.group("test2");

//   const css = mapEntities([11, 21, 31, 3, 4, 5]);
//   const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
//   const csAway = [];

//   const _result = customerSuccessBalancing(css, customers, csAway);
//   console.log(`
//     expected: 0
//     received: ${_result}
//   `);
//   console.groupEnd();
// }

// function test3() {
//   console.group("test3");
//   const testTimeoutInMs = 100;
//   const testStartTime = new Date().getTime();

//   const css = mapEntities(arraySeq(999, 1));

//   const customers = buildSizeEntities(10000, 998);
//   const csAway = [999];

//   const _result = customerSuccessBalancing(css, customers, csAway);

//   console.log(`
//     expected: 998
//     received: ${_result}
//   `);

//   if (new Date().getTime() - testStartTime > testTimeoutInMs) {
//     console.error(`Test took longer than ${testTimeoutInMs}ms!`);
//     return;
//   }
//   console.groupEnd();
// }

// function test4() {
//   console.group("test4");

//   const css = mapEntities([1, 2, 3, 4, 5, 6]);
//   const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
//   const csAway = [];

//   const _result = customerSuccessBalancing(css, customers, csAway);
//   console.log(`
//     expected: 0
//     received: ${_result}
//   `);
//   console.groupEnd();
// }

// function test5() {
//   console.group("test5");

//   const css = mapEntities([100, 2, 3, 6, 4, 5]);
//   const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
//   const csAway = [];

//   const _result = customerSuccessBalancing(css, customers, csAway);
//   console.log(`
//     expected: 1
//     received: ${_result}
//   `);
//   console.groupEnd();
// }

// function test6() {
//   console.group("test6");

//   const css = mapEntities([100, 99, 88, 3, 4, 5]);
//   const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
//   const csAway = [1, 3, 2];

//   const _result = customerSuccessBalancing(css, customers, csAway);
//   console.log(`
//     expected: 0
//     received: ${_result}
//   `);

//   console.groupEnd();
// }

// function test7() {
//   console.group("test7");

//   const css = mapEntities([100, 99, 88, 3, 4, 5]);
//   const customers = mapEntities([10, 10, 10, 20, 20, 30, 30, 30, 20, 60]);
//   const csAway = [4, 5, 6];

//   const _result = customerSuccessBalancing(css, customers, csAway);
//   console.log(`
//     expected: 3
//     received: ${_result}
//   `);
//   console.groupEnd();
// }

// function buildSizeEntities(size, score) {
//   const result: Person[] = [];
//   for (let i = 0; i < size; i += 1) {
//     result.push({ id: i + 1, score });
//   }
//   return result;
// }

// function mapEntities(arr) {
//   return arr.map((item, index) => ({
//     id: index + 1,
//     score: item,
//   }));
// }

// function arraySeq(count, startAt) {
//   return Array.apply(0, Array(count)).map((it, index) => index + startAt);
// }
