async function runTests() {
  const base = 'http://localhost:3000/api/resources';

  console.log('=== Step 1: Create Resource ===');
  let res = await fetch(base, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Portable SSD 1TB',
      description: 'USB-C ultra-fast external storage',
      category: 'Electronics',
      price: 109.99,
      status: 'active',
    }),
  });
  let data = await res.json();
  console.log('Status:', res.status);
  console.log('Body:', data);
  const createdId = data.data.id;

  console.log('\n=== Step 2: Get Details of Resource ===');
  res = await fetch(`${base}/${createdId}`);
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Body:', data);

  console.log('\n=== Step 3: Update Resource Details ===');
  res = await fetch(`${base}/${createdId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      price: 94.99,
      description: 'Updated price on flash sale!',
    }),
  });
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Body:', data);

  console.log('\n=== Step 4: List Resources with Filters ===');
  res = await fetch(`${base}?search=Portable&category=Electronics&status=active&minPrice=50&maxPrice=150`);
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Total matches:', data.pagination.total);
  console.log('Matched items:', data.data);

  console.log('\n=== Step 5: Delete Resource ===');
  res = await fetch(`${base}/${createdId}`, { method: 'DELETE' });
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Body:', data);

  console.log('\n=== Step 6: Verify 404 on Deleted Resource ===');
  res = await fetch(`${base}/${createdId}`);
  data = await res.json();
  console.log('Status:', res.status);
  console.log('Body:', data);
}

runTests().catch(console.error);
