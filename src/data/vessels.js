// Ropax fleet data
// Book value uses straight-line depreciation over 25-year useful life
// Annual depreciation = Original Cost / 25 years
// Book Value = Original Cost - (Age * Annual Depreciation)
// Residual / Scrap value assumed at 10% of original cost

const vessels = [
  {
    id: '1',
    name: 'Adriatic Star',
    type: 'Ropax Ferry',
    flag: 'Greece',
    grossTonnage: 28450,
    yearBuilt: 2008,
    originalCost: 85000000, // USD
    usefulLifeYears: 25,
    residualRate: 0.10,
  },
  {
    id: '2',
    name: 'Baltic Express',
    type: 'Ropax Ferry',
    flag: 'Finland',
    grossTonnage: 33200,
    yearBuilt: 2012,
    originalCost: 102000000,
    usefulLifeYears: 25,
    residualRate: 0.10,
  },
  {
    id: '3',
    name: 'Mediterranean Dream',
    type: 'Ropax Ferry',
    flag: 'Italy',
    grossTonnage: 41800,
    yearBuilt: 2015,
    originalCost: 135000000,
    usefulLifeYears: 25,
    residualRate: 0.10,
  },
  {
    id: '4',
    name: 'Norse Viking',
    type: 'Ropax Ferry',
    flag: 'Norway',
    grossTonnage: 36700,
    yearBuilt: 2005,
    originalCost: 78000000,
    usefulLifeYears: 25,
    residualRate: 0.10,
  },
  {
    id: '5',
    name: 'Aegean Horizon',
    type: 'Ropax Ferry',
    flag: 'Greece',
    grossTonnage: 22900,
    yearBuilt: 2018,
    originalCost: 110000000,
    usefulLifeYears: 25,
    residualRate: 0.10,
  },
  {
    id: '6',
    name: 'Celtic Pride',
    type: 'Ropax Ferry',
    flag: 'Ireland',
    grossTonnage: 31500,
    yearBuilt: 2010,
    originalCost: 95000000,
    usefulLifeYears: 25,
    residualRate: 0.10,
  },
  {
    id: '7',
    name: 'Iberian Mariner',
    type: 'Ropax Ferry',
    flag: 'Spain',
    grossTonnage: 38100,
    yearBuilt: 2014,
    originalCost: 125000000,
    usefulLifeYears: 25,
    residualRate: 0.10,
  },
  {
    id: '8',
    name: 'Bosphorus Queen',
    type: 'Ropax Ferry',
    flag: 'Turkey',
    grossTonnage: 27300,
    yearBuilt: 2007,
    originalCost: 72000000,
    usefulLifeYears: 25,
    residualRate: 0.10,
  },
  {
    id: '9',
    name: 'Atlantic Pioneer',
    type: 'Ropax Ferry',
    flag: 'Portugal',
    grossTonnage: 44600,
    yearBuilt: 2020,
    originalCost: 165000000,
    usefulLifeYears: 25,
    residualRate: 0.10,
  },
  {
    id: '10',
    name: 'North Sea Trader',
    type: 'Ropax Ferry',
    flag: 'Netherlands',
    grossTonnage: 35800,
    yearBuilt: 2003,
    originalCost: 65000000,
    usefulLifeYears: 25,
    residualRate: 0.10,
  },
];

const CURRENT_YEAR = 2026;

export function getVessels() {
  return vessels.map((v) => {
    const age = CURRENT_YEAR - v.yearBuilt;
    const residualValue = v.originalCost * v.residualRate;
    const depreciableAmount = v.originalCost - residualValue;
    const annualDepreciation = depreciableAmount / v.usefulLifeYears;
    const accumulatedDepreciation = Math.min(
      annualDepreciation * age,
      depreciableAmount
    );
    const bookValue = Math.max(v.originalCost - accumulatedDepreciation, residualValue);

    return {
      ...v,
      age,
      annualDepreciation,
      accumulatedDepreciation,
      bookValue,
      residualValue,
    };
  });
}

export default vessels;
