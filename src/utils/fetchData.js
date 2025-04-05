const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }

  // Verificar si es una respuesta 204 No Content
  if (response.status === 204) {
    return { success: true }; // Devolver un objeto simple para mantener consistencia
  }

  // Verificar si hay contenido antes de intentar parsear JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  // Si no hay JSON, devolver el texto o un objeto de éxito
  const text = await response.text();
  return text ? JSON.parse(text) : { success: true };
};

export const fetchData = async (url, options = {}) => {
  try {;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...options.headers
      },
      ...options
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error in fetchData:', error);
    throw error;
  }
};

export const postData = async (url, data, headers = {}) => {
  try {

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(data)
    });
    localStorage.setItem('email', data.email)

    return handleResponse(response);
  } catch (error) {
    console.error('Error in postData:', error);
    throw error;
  }
};

export const putData = async (url, data, headers = {}) => {
  try {

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify(data)
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error in putData:', error);
    throw error;
  }
};

export const deleteData = async (url, headers = {}) => {
  try {

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error in deleteData:', error);
    throw error;
  }
};
