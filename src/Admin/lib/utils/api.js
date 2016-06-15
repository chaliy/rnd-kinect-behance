const _fetch = async (path, options) => {
  options = options || {};
  let fetchOptions = Object.assign({
       //credentials: 'same-origin',             
       headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json'
       },
       method: options.method || 'get'
     }, options);

   let response = await fetch(path, fetchOptions);
   let data = await response.json();

   return data;
}

export const load = path => _fetch(`http://localhost:8380/${path}`);
