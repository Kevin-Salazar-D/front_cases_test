import axios from "axios";

const apiClientAxios = async (data, UrlApi, methodHTTP, expectBlob = false) => {
  try {
    let response;

    const isFormData = data instanceof FormData;

    const config = {
      headers: {
        "Content-Type": isFormData ? "multipart/form-data" : "application/json",
      },
      responseType: expectBlob ? "blob" : "json", 
    };

    switch (methodHTTP.toUpperCase()) {
      case "GET":
        response = await axios.get(UrlApi, config);
        break;

      case "POST":
        response = await axios.post(UrlApi, data, config);
        break;

      case "PUT":
        response = await axios.put(UrlApi, data, config);
        break;

      case "PATCH":
        response = await axios.patch(UrlApi, data, config);
        break;

      case "DELETE":
        response = await axios.delete(UrlApi, config);
        break;

      default:
        throw new Error(`Método HTTP no soportado: ${methodHTTP}`);
    }

    return response.data; // Si es blob, lo recibirás directamente como archivo
  } catch (error) {
    console.error("Error en apiClientAxios:", error);
    throw error;
  }
};

export default apiClientAxios;
