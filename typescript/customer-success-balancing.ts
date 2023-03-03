interface Person {
  id: number;
  score: number;
  customers?: Person[];
}

const CUSTOMERS_SUCCESS_WITH_SAME_AMOUT_OF_CUSTOMERS = 0;

/**
 * Returns the id of the CustomerSuccess with the most customers
 * @param customerSuccess
 * @param customers
 * @param customerSuccessAway
 */
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

  return CUSTOMERS_SUCCESS_WITH_SAME_AMOUT_OF_CUSTOMERS;
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

    const firstOverscore = customersGroupsScores.findIndex(
      (value) => Number(value) > csScore
    );

    const customersGroupsScoresKeys = customersGroupsScores.splice(
      0,
      firstOverscore < 0 ? customersGroupsScores.length : firstOverscore
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
