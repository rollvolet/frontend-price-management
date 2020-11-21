import fetch from 'fetch';

async function next() {
  const endpoint = new URL(`/sequence-numbers`, window.location.origin);
  const { data } = await (await fetch(endpoint, {
    method: 'POST'
  })).json();
  return data && data.attributes && data.attributes.value;
}

export {
  next
}
