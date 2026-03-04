import React from 'react'

async function page() {
  const res = await getProduct();
  console.log("res in product page:", res);
  return (
    <div>Hello this is protect route, product</div>
  )
}

export default page