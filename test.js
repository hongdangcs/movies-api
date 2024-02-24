let arrayWithDuplicates = [1, 2, 2, 3, 4, 4, 5, 5];

console.log([...new Set(arrayWithDuplicates)]);
console.log(new Set([...arrayWithDuplicates]));
