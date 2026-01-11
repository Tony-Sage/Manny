// data.ja
// carData is used for the filter pills at the top of the search page
export async function fetchCarData() {
  const res = await fetch("http://localhost:4000/search/car-data");
  return res.json();
}

export async function fetchCategoryData(){
 const res = await fetch("http://localhost:4000/search/category-data");
 return res.json();
 console.log("The response:" + res.json())
}